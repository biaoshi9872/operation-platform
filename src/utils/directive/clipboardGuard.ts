/*
 * 全局复制拦截与规范化插件
 * - 默认规范化数字文本：去逗号、全角转半角、trim
 * - 支持元素豁免：data-copy-raw="true" 或 class="copy-raw"
 */
import type { App } from 'vue'

// 类型定义增加 stripNewlines 配置
type ClipboardGuardOptions = {
  rawSelector: string
  normalizeNumbers: boolean
  trim: boolean
  stripCommas: boolean
  fullwidthToHalf: boolean
  stripNewlines: boolean
}

declare global {
  interface Window {
    __clipboardGuardInstalled?: boolean
  }
}

// 默认配置增加 stripNewlines: true
const defaultOptions: ClipboardGuardOptions = {
  rawSelector: '[data-copy-raw], .copy-raw',
  normalizeNumbers: true,
  trim: true,
  stripCommas: true,
  fullwidthToHalf: true,
  stripNewlines: true
}

function toHalfWidth(str: string): string {
  return str.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0xff00 + 0x20)
  )
}

function looksNumeric(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  // 允许千分位逗号（中英文）、小数、正负号；也兼容全角数字先简单判断
  const half = toHalfWidth(t)
  return /^[-+]?(\d{1,3}(?:[,，]\d{3})+|\d+)(\.\d+)?$/.test(half) || /^[-+]?(\d+)(\.\d+)?$/.test(half)
}

// 在 normalize 逻辑前增加通用清理：去掉换行符 + trim
function normalizeTextCommon(text: string, opts: ClipboardGuardOptions): string {
  let result = text
  if (opts.stripNewlines) result = result.replace(/[\r\n]+/g, '')
  if (opts.trim) result = result.trim()
  return result
}

function normalizeNumeric(text: string, opts: ClipboardGuardOptions): string {
  let result = normalizeTextCommon(text, opts)
  if (opts.fullwidthToHalf) result = toHalfWidth(result)
  if (opts.stripCommas) result = result.replace(/[，,]/g, '')
  // normalizeTextCommon 已做 trim
  return result
}

function getCopyText(e: ClipboardEvent): string {
  // 优先选区文本
  const sel = window.getSelection()
  const selected = sel ? sel.toString() : ''
  if (selected) return selected

  // 尝试从输入框的选区读取
  const target = e.target as HTMLElement | null
  if (target && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    const input = target
    if (input.selectionStart != null && input.selectionEnd != null && input.selectionEnd > input.selectionStart) {
      return input.value.substring(input.selectionStart, input.selectionEnd)
    }
    return input.value
  }
  return ''
}

export default function clipboardGuard(app: App) {
  if (typeof window === 'undefined') return
  if (window.__clipboardGuardInstalled) return
  window.__clipboardGuardInstalled = true

  const state = {
    enabled: true,
    options: { ...defaultOptions }
  }

  const handler = (e: ClipboardEvent) => {
    if (!state.enabled) return
    try {
      const target = e.target as Element | null
      // 豁免：目标或祖先命中 rawSelector 则不处理
      if (target && target.closest(state.options.rawSelector)) return

      const text = getCopyText(e)
      if (!text) return

      // 先做通用清理（去换行、trim）
      let processed = normalizeTextCommon(text, state.options)

      // 如果文本看起来是数字样式，再做数字规范化
      if (state.options.normalizeNumbers && looksNumeric(processed)) {
        processed = normalizeNumeric(processed, state.options)
      }

      // 如果有变化，则覆盖剪贴板
      if (processed !== text && e.clipboardData) {
        e.clipboardData.setData('text/plain', processed)
        e.preventDefault()
      }
    } catch {
      // 静默失败，避免影响默认行为
    }
  }

  document.addEventListener('copy', handler, true)

  // 暴露到全局，方便在页面中临时开关或调整
  app.config.globalProperties.$clipboardGuard = {
    enable() {
      state.enabled = true
    },
    disable() {
      state.enabled = false
    },
    setOptions(options: Partial<ClipboardGuardOptions>) {
      state.options = { ...state.options, ...options }
    }
  }
}
