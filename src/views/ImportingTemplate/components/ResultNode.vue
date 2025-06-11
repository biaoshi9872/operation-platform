<script setup lang="ts">
import { tabsStore } from '@/stores'
import { ElMessage } from 'element-plus'

const tabsStoreInfo: any = tabsStore()
const route = useRoute()
interface IProp {
  exportNodeResultDecListConfig: any
  exportReturnRouteConfig: any
  exportErrorApiConfig: any
  resultDetail: any
}
const props = withDefaults(defineProps<IProp>(), {
  exportNodeResultDecListConfig: [],
  resultDetail: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'reloadUpload'): void
}>()

//返回
const returnHandler = () => {
  tabsStoreInfo.close(route, {
    path: props.exportReturnRouteConfig.path
  })
}

//下载
const downLoadingHandler = () => {
  if (!props.exportErrorApiConfig.api && !props.exportErrorApiConfig.toErrorMsg) {
    throw new Error('请添加导出错误详情接口')
  }
  const keys = ''
  //是否走下载中心
  if (props.exportErrorApiConfig.isToCenter) {
    props.exportErrorApiConfig.api({ keys }).then((res: any) => {
      if (res.code == 0) {
        ElMessage.success(res.msg)
      }
    })
  } else if (props.exportErrorApiConfig.toErrorMsg) {
    tabsStoreInfo.reload({
      path: props.exportErrorApiConfig.errPath,
      query: {
        [props.exportErrorApiConfig?.key || 'logId']: props.resultDetail[props.exportErrorApiConfig?.key]
      }
    })
  } else {
    props.exportErrorApiConfig.api({ keys }).then((res: any) => {
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', props.exportErrorApiConfig.exportName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
}

const exportHandler = () => {
  emits('reloadUpload')
}
</script>
<template>
  <div class="result-container">
    <div>
      <div class="item" v-if="resultDetail.failNum">
        <el-icon class="icon-error">
          <WarningFilled />
        </el-icon>
        <h3>
          {{ exportNodeResultDecListConfig.title }}批量导入完成
          <span v-if="resultDetail.failNum">
            ，有{{
              exportNodeResultDecListConfig.title }}导入失败
          </span>
        </h3>
      </div>
      <div class="item" v-else>
        <el-icon class="icon-success">
          <SuccessFilled />
        </el-icon>
        <h3>{{ exportNodeResultDecListConfig.title }}批量导入完成</h3>
      </div>
    </div>
    <span v-if="exportNodeResultDecListConfig.title == 'SKU批量推送'">本次表格（分销渠道：{{ resultDetail?.data?.[0]?.merName }}）包含{{
      resultDetail?.data?.[0]?.totalCount }}条商品数据，其中上传成功{{ resultDetail?.data?.[0]?.successCount }}条，上传失败{{ resultDetail?.data?.[0]?.failCount }}条</span>
    <span v-else>
      本次共导入 {{ resultDetail.totalNum }} 条数据：其中成功 {{ resultDetail.successNum }} 条，失败 {{ resultDetail.failNum }}
      条
    </span>

    <div>
      <el-button type="danger" @click="downLoadingHandler">{{ exportNodeResultDecListConfig.downTitle }}</el-button>
      <el-button v-if="exportNodeResultDecListConfig.soreTile" type="primary" @click="returnHandler">{{
        exportNodeResultDecListConfig.soreTile }}</el-button>
      <!-- <el-button type="primary" @click="exportHandler">继续导入</el-button> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
.result-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .icon-error {
      font-size: 24px;
      color: red;
    }

    .icon-success {
      font-size: 24px;
      color: #2fad44;
    }
  }
}
</style>
