<script setup lang="ts">
import messageApi from '@/api/system/message'
const dataPage = reactive({
  fromData: {
    resultData: '',
    merchantPrivateKey: ''
  },
  decryptResultData: {},
  loading: false
})

const clickHandler = () => {
  const fromData = dataPage.fromData
  dataPage.loading = true
  messageApi
    .A_decryptResultData({
      ...fromData
    })
    .then((res: any) => {
      dataPage.decryptResultData = res
    })
    .finally(() => {
      dataPage.loading = false
    })
}
const jsonValue = computed(() => {
  return function (val: any) {
    try {
      let obj = JSON.parse(val)
      return obj
    } catch (e) {
      // 转换出错，抛出异常
      return val
    }
  }
})
</script>
<template>
  <PageContainer class="main_box">
    <div class="header-container">
      <el-form inline="true">
        <el-form-item label="分销商私钥">
          <el-input class="w-300" v-model="dataPage.fromData.merchantPrivateKey" type="text" placeholder="请输入分销商私钥" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="dataPage.loading" @click="clickHandler">解密</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex content-container items-center gap-8">
      <div class="item flex-1">
        <el-input v-model="dataPage.fromData.resultData" type="textarea" placeholder="请输入原文" />
      </div>
      <div>
        <svg-icon name="to_right"></svg-icon>
      </div>
      <div class="item flex-1">
        <json-viewer :value="jsonValue(dataPage.decryptResultData)" :expand-depth="5" copyable boxed sort
          class="w-100%"></json-viewer>
      </div>
    </div>
  </PageContainer>
</template>
<style lang="scss" scoped>
.header-container {
  background-color: #fff;
  padding-top: 16px;
  padding-left: 16px;
  margin-bottom: 16px;
}

.content-container {
  height: calc(100vh - 200px);

  .item {
    height: 100%;

    ::v-deep(.el-textarea) {
      height: 100% !important;
    }

    ::v-deep(.el-textarea__inner) {
      height: 100% !important;
    }

    ::v-deep(.jv-container) {
      height: 100% !important;
    }
  }
}
</style>