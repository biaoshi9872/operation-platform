<!--
 * @Descripttion:内容模块分区组件 --- 统一内容模块分区样式统一
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->
<template>
  <div class="c_main_box">
    <div v-if="props.title" class="left_box">
      <div v-if="openLeftTip" class="left_tip"></div>
      <div class="title" :class="props.isFix ? 'title_fix' : ''">
        <span>{{ props.title }}</span>
        <span class="option_container" :class="isStart ? 'start' : ''">
          <span>
            <slot name="titleContent"></slot>
          </span>
          <span>
            <slot name="option"></slot>
          </span>
        </span>
      </div>
    </div>
    <div :class="slots.default ? 'content_container' : ''">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ModalContent'
})
import { withDefaults, useSlots, onMounted } from 'vue'
const slots = useSlots()
interface Props {
  title: string
  isFix: boolean
  isStart?: boolean
  isOnlyOpiton?: boolean
  openLeftTip?: boolean
  mb?: number
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  isOnlyOpiton: true,
  isFix: false,
  isStart: false,
  openLeftTip: false
})
</script>
<style scoped lang="scss">
.c_main_box {
  width: 100%;
  // min-width: 1200px;
  background: var(--el-bg-color);
  border-radius: 0px 0px 0px 0px;
  box-sizing: border-box;
  margin-bottom: 8px;
  padding: 8px;

  .title {
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    line-height: 16px;
    display: flex;
    align-items: center;

    .option_container {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .start {
      justify-content: flex-start;
    }
  }

  .left_box {
    @include flex('start');
  }

  .left_tip {
    width: 6px;
    height: 19px;
    box-sizing: border-box;
    border-radius: 0px;
    margin-right: 4px;
    background-color: var(--el-color-primary);
  }

  .option_container {
    font-size: 14px;
    font-weight: 500;
  }

  .content_container {
    padding: 16px 10px;
    //margin-bottom: 8px;
  }

  .title_fix:before {
    content: '*';
    color: red;
    margin-right: 4px;
  }
}
</style>
