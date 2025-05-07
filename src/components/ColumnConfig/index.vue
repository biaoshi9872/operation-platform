<!--
 * @Descripttion: 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-04-20 14:39:22
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-05-25 14:01:01
-->
<template>
  <div class="columns_box">
    <el-button v-bind="$attrs" type="primary" plain @click="clickHandler">
      <slot>
        <i class="iconfont icon-lieshezhi mr-4"></i>列设置
      </slot>
    </el-button>
    <div v-if="data.show" class="columns_content_box" :class="isLift ? 'columns_content_box_left' : ''" v-click-outside="onClickOutside">
      <div class="content">
        <div class="item flex items-center" v-for="(item, index) in columnConfigs">
          <el-switch class="mr-6" :active-value="1" :inactive-value="0" v-model="item.isShow" />
          <span class="title tooltip">{{ item.title }}</span>
        </div>
      </div>
      <div class="option">
        <el-button type="primary" @click="saveDataHandler">保存</el-button>
        <el-button @click="reSetHandler">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="ColumnConfig" setup>
import { ClickOutside as vClickOutside } from 'element-plus'

interface IProp {
  isLift?: boolean
  saveFiledConfigData: any
  columnConfigs: any
}
const props = withDefaults(defineProps<IProp>(), {
  isLift: true,
  columnConfigs: [],
  saveFiledConfigData: () => {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'saveFiledData'): void
  (e: 'reSetFiledData'): void
}>()

const data = reactive({
  value1: 1,
  show: false
})

const onClickOutside = () => {
  data.show = false
}

const clickHandler = () => {
  data.show = true
}

const saveDataHandler = () => {
  data.show = false
  props.saveFiledConfigData(props.columnConfigs)
}

const reSetHandler = () => {
  //@ts-ignore
  props.columnConfigs.forEach(element => {
    element.isShow = 1
  })
  // props.saveFiledConfigData([])
}
</script>
<style scoped lang="scss">
.columns_box {
  position: relative;
  display: inline-block;
  .columns_content_box {
    position: absolute;
    top: 40px;
    z-index: 9999;
    width: 216px;
    height: 420px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 1px rgba(200, 201, 204, 0.5);
    border-radius: 2px 2px 2px 2px;
    opacity: 1;

    .content {
      height: 356px;
      padding: 8px;
      box-sizing: border-box;
      overflow: scroll;
      .item {
        height: 40px;
        .title {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #27262b;
        }
      }
    }
    .option {
      display: flex;
      justify-content: center;
      gap: 16px;
      align-items: center;
      height: 64px;
      box-shadow: 0px -1px 4px 1px rgba(10, 50, 97, 0.1);
    }
  }
  .columns_content_box_left {
    left: -110px;
  }
}
</style>
