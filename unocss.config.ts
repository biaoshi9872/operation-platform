import { defineConfig, presetAttributify, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex justify-between',
    'flex-start-center': 'flex items-center'
  },
  theme: {},
  rules: [
    [/^gab-(\d+)$/, ([, d]) => ({ gab: `${d}px` })],
    [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` })],
    [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })],
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
    [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d}px` })],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d}px` })],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d}px` })],
    [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d}px` })],
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
    [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d}px` })],
    [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d}px` })],
    [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d}px` })],
    [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d}px` })],
    [/^fs-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    [/^lh-(\d+)$/, ([, d]) => ({ 'line-height': `${d}px` })],
    [/^c-(\d)$/, ([, d]) => ({ color: `#${d}${d}${d}` })],
    [/^p-(\d+)-(\d+)/, ([, d, s]) => ({ padding: `${d}px ${s}px` })],
    [/^m-(\d+)-(\d+)/, ([, d, s]) => ({ margin: `${d}px ${s}px` })],
    [/^text-indent-(\d+)$/, ([, d]) => ({ 'text-indent': `${d}ch` })],
  ]
})
