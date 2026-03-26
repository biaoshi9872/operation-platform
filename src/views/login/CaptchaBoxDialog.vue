<template>
  <el-dialog
    v-bind="$attrs"
    title="请拖动下方滑块完成拼图"
    width="400px"
    append-to-body
    @open="open"
    draggable
    class="captcha-box-dialog"
    destroy-on-close
    :close-on-click-modal="false"
    @closed="close"
  >
    <div v-loading="dataInfo.loading" class="slideVerifyWrap">
      <div ref="imgBg" class="imgBg" :style="{ background: 'url(' + dataInfo.shadeImage + ')' }">
        <div ref="block" class="imgBtn">
          <el-image v-if="dataInfo.cutoutImage" :src="dataInfo.cutoutImage">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outlines" />
            </div>
          </el-image>
        </div>
      </div>
      <div
        class="slide-verify-slider"
        :class="{
              'container-active': dataInfo.containerActive,
              'container-success': dataInfo.containerSuccess,
              'container-fail': dataInfo.containerFail
            }"
      >
        <div class="slide-verify-slider-mask" :style="{ width: dataInfo.sliderMaskWidth }">
          <!-- slider -->
          <div
            class="slide-verify-slider-mask-item"
            :style="{ left: dataInfo.sliderLeft }"
            @mousedown="touchStartEvent"
            @touchstart="touchStartEvent"
          >
            <div class="slide-verify-slider-mask-item-icon">
              <svg-icon icon-class="slide" name="slide" class="icon-box" />
            </div>
          </div>
        </div>
        <span class="slide-verify-slider-text">拖动滑块完成拼图</span>
      </div>
    </div>
  </el-dialog>
</template>
  
<script setup lang="ts" name="Login">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
import verifyApi from '@/api/system/verify'

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'validSuccess'): void
  (e: 'validFail'): void
}>()
const dataInfo = reactive<any>({
  loading: false,
  x: 0,
  y: 0,
  text: '向右滑动滑块填充拼图',
  cutoutImage: '',
  shadeImage: '',
  containerActive: false, // container active class
  containerSuccess: false, // container success class
  containerFail: false, // container fail class
  sliderLeft: 0, // block right offset
  sliderMaskWidth: 0, // mask width,
  originX: undefined,
  originY: undefined,
  isMouseDown: false,
  startSlidingTime: '',
  entSlidingTime: '',
  trackArr: [],
  startDate: ''
})
const block = ref(null) as any
const open = () => {
  initCaptcha()
}

onMounted(() => {
  window.addEventListener('mousemove', touchMoveEvent)
  window.addEventListener('mouseup', touchEndEvent)
  window.addEventListener('touchmove', touchMoveEvent, { passive: false })
  window.addEventListener('touchend', touchEndEvent, { passive: false })
  window.addEventListener('touchcancel', touchEndEvent, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', touchMoveEvent, false)
  window.removeEventListener('mouseup', touchEndEvent, false)
  window.removeEventListener('touchmove', touchMoveEvent)
  window.removeEventListener('touchend', touchEndEvent)
  window.removeEventListener('touchcancel', touchEndEvent)
})

const getEventPoint = (event: any) => {
  const point = event.touches?.[0] || event.changedTouches?.[0] || event
  return {
    pageX: point?.pageX ?? 0,
    pageY: point?.pageY ?? 0
  }
}

const initCaptcha = () => {
  reset()
  dataInfo.loading = true
  verifyApi
    .A_verifyGen()
    .then((res: any) => {
      dataInfo.cutoutImage = res.captcha.sliderImage
      dataInfo.shadeImage = res.captcha.backgroundImage
      dataInfo.captchaId = res.id
      dataInfo.startDate = dayjs()
    })
    .finally(() => {
      dataInfo.loading = false
    })
}
const touchStartEvent = (event: any) => {
  event.preventDefault()
  const { pageX, pageY } = getEventPoint(event)
  dataInfo.startSlidingTime = new Date()
  dataInfo.originX = pageX
  dataInfo.originY = pageY
  dataInfo.isMouseDown = true
}
const touchMoveEvent = (e: any) => {
  if (!dataInfo.isMouseDown) return false
  e.preventDefault()
  const { pageX, pageY } = getEventPoint(e)
  let moveX = pageX - dataInfo.originX
  if (moveX < 0) {
    moveX = 0
  }
  if (moveX >= 240) {
    moveX = 240
  }
  dataInfo.sliderLeft = moveX + 'px'
  const blockLeft = ((280 - 50) / (280 - 40)) * moveX
  if (block.value) {
    block.value.style.left = blockLeft + 'px'
  }
  dataInfo.trackArr.push({
    x: pageX - dataInfo.originX,
    y: pageY - dataInfo.originY,
    t: new Date().getTime() - dataInfo.startSlidingTime.getTime()
  })
  dataInfo.containerActive = true
  dataInfo.sliderMaskWidth = moveX + 'px'
}
const touchEndEvent = (e: any) => {
  if (!dataInfo.isMouseDown) return false
  e.preventDefault()
  const { pageX } = getEventPoint(e)
  dataInfo.entSlidingTime = new Date()
  dataInfo.isMouseDown = false
  if (pageX === dataInfo.originX) return false
  dataInfo.containerActive = false // remove active
  const x = block.value?.style.left.substring(0, block.value.style.left.length - 2) || '0'
  onEnd(Math.round(Number(x)))
}
const onEnd = (x: any) => {
  const obj = {
    id: dataInfo.captchaId,
    sliderCaptchaTrack: {
      bgImageWidth: 280,
      bgImageHeight: 171,
      sliderImageWidth: 54,
      sliderImageHeight: 171,
      startSlidingTime: newFormatDate(dataInfo.startSlidingTime, '-', 'YMDHMS'),
      entSlidingTime: newFormatDate(dataInfo.entSlidingTime, '-', 'YMDHMS'),
      trackList: dataInfo.trackArr
    }
  }
  //验证超时
  const endDate = dayjs()
  if (endDate.diff(dataInfo.startDate, 'second') > 180) {
    initCaptcha()
    return ElMessage.error('验证超时,请重试')
  }
  let data = markRaw(obj)
  reset()
  //验证滑块
  verifyApi
    .A_verifyCheck(data)
    .then((res: any) => {
      validSuccess()
    })
    .catch((err: any) => {
      initCaptcha()
    })
}
const validSuccess = () => {
  emits('validSuccess')
  close()
}
const close = () => {
  reset()
  emits('update:modelValue', false)
}
const reset = () => {
  dataInfo.containerActive = false
  dataInfo.containerSuccess = false
  dataInfo.containerFail = false
  dataInfo.sliderLeft = 0
  if (block.value) {
    block.value.style.left = '0px'
  }
  dataInfo.sliderMaskWidth = 0
  dataInfo.cutoutImage = ''
  dataInfo.shadeImage = ''
  dataInfo.x = 0
  dataInfo.y = 0
  dataInfo.originX = undefined
  dataInfo.originY = undefined
  dataInfo.isMouseDown = false
  dataInfo.trackArr = []
}
const newFormatDate = (date: any, code: any, type: any) => {
  const time = new Date(date)
  const Year = time.getFullYear()
  const Month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
  const Day = time.getDate() > 9 ? time.getDate() : '0' + time.getDate()
  const Hour = time.getHours() > 9 ? time.getHours() : '0' + time.getHours()
  const Minute = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()
  const Seconds = time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds()
  if (code === 'cn') {
    if (type === 'YMDHMS') {
      return `${Year}年${Month}月${Day}日 ${Hour}:${Minute}:${Seconds}`
    }
    return `${Year}年${Month}月${Day}日`
  } else {
    if (type === 'YMDHMS') {
      return `${Year}${code}${Month}${code}${Day} ${Hour}:${Minute}:${Seconds}`
    }
    return `${Year}${code}${Month}${code}${Day}`
  }
}
</script>
  
  <style lang="scss" scoped>
.slideVerifyWrap {
  width: 336px;
  margin: 0 auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  .imgBg {
    position: relative;
    width: 280px;
    margin: 24px auto 30px auto;
    height: 171px;
    background-size: cover !important;
    .imgBtn {
      position: absolute;
      left: 0;
      top: 0;
      .el-image {
        display: block;
        width: 54px;
        height: 171px;
      }
    }
  }
  .loadingBg {
    position: relative;
    width: 280px;
    margin: 24px auto 30px auto;
    text-align: center;
    height: 171px;
    line-height: 171px;
  }
  .slide-verify-slider {
    position: relative;
    text-align: center;
    width: 278px;
    margin: 0 auto 28px auto;
    height: 40px;
    line-height: 40px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
    box-shadow: 1px 1px 10px -1px #c2d7ec;

    -webkit-background-clip: text; /*按文字裁剪*/
    -webkit-text-fill-color: transparent; /*文字的颜色使用背景色*/
    background-color: #c8c9cc; /*设置一个背景色*/
    background-image: -webkit-linear-gradient(-45deg, rgba(0, 0, 0, 0.6) 30%, #fff 50%, rgba(0, 0, 0, 0.6) 70%); /*设置渐变的背景，按对角线渐变*/
    background-blend-mode: hard-light; /*设置背景为混合模式下的强光模式*/
    background-size: 200%;
    -webkit-animation: shine 4s infinite; /*给背景添加动画改变位置*/
    @-webkit-keyframes shine {
      from {
        background-position: 100%;
      }
      to {
        background-position: 0;
      }
    }
    .slide-verify-slider-mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 40px;
      border: 0 solid #1991fa;
      background: #d1e9fe;
      .slide-verify-slider-mask-item {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        width: 40px;
        height: 38px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        touch-action: none;
        transition: background 0.2s linear;
        .slide-verify-slider-mask-item-icon {
          width: 40px;
          height: 38px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #00aa72;
          .icon-box {
            color: #c8c9cc;
            -webkit-text-fill-color: #c8c9cc;
          }
        }
      }
      .slide-verify-slider-mask-item:hover {
        background: #1991fa;
        .slide-verify-slider-mask-item-icon {
          background-position: 0 -13px;
        }
      }
    }
  }
  .container-active {
    .slide-verify-slider-mask {
      height: 40px;
      border-width: 1px;
      .slide-verify-slider-mask-item {
        height: 40px;
        top: -1px;
        border: 1px solid #1991fa;
      }
    }
    .slide-verify-slider-text {
      display: none;
    }
  }
  .container-success {
    .slide-verify-slider-mask {
      height: 40px;
      border: 1px solid #52ccba;
      background-color: #d2f4ef;
      .slide-verify-slider-mask-item {
        height: 40px;
        top: -1px;
        border: 1px solid #52ccba;
        background-color: #52ccba !important;
        .slide-verify-slider-mask-item-icon {
          background-position: 0 0 !important;
        }
      }
    }
    .slide-verify-slider-text {
      display: none;
    }
  }
  .container-fail {
    .slide-verify-slider-mask {
      height: 40px;
      border: 1px solid #f57a7a;
      background-color: #fce1e1;
      .slide-verify-slider-mask-item {
        height: 40px;
        top: -1px;
        border: 1px solid #f57a7a;
        background-color: #f57a7a !important;
      }
      .slide-verify-slider-mask-item-icon {
        top: 14px;
        background-position: 0 -82px !important;
      }
    }
    .slide-verify-slider-text {
      display: none;
    }
  }
}
::v-deep .dialog-box {
  .el-dialog__body {
    min-height: 353px;
  }
}
</style>
  
