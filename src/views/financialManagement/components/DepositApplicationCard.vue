<template>
  <div class="flex deposit-card">
    <!-- 资金总栏 -->
    <div class="deposit-card-container mr-8">
      <div class="home">
        <div>机构ID：{{ dataPage.merchantInfo.orgId }}</div>
        <div class="deposit-title flex justify-between">
          <svg-icon icon-class="zhiJin" class name="zhiJin"></svg-icon>
          <span class="text-right">账户可用余额(元):</span>
          <span>
            ￥{{
              dataPage.merchantInfo.amountBalance }}
          </span>
        </div>
        <div class="deposit-title flex justify-between">
          <svg-icon icon-class="zhiJin" class name="zhiJin"></svg-icon>
          <span class="text-right">授信额:</span>
          <span>
            ￥{{
              dataPage.merchantInfo.amountCreditLine }}
          </span>
        </div>
      </div>
      <div>
        <AuthButton type="primary" authKey="CWZL_SQCZ" @click="applyHandler">申请充值</AuthButton>
      </div>
    </div>
    <!-- 冻结-->
    <div class="deposit-card-container">
      <div>
        <span class="fs-20 fw-bold">冻结预存款(元)</span>
        <el-tooltip class="box-item" content="提交订单就会进行预存款冻结" placement="top">
          <el-icon>
            <Warning />
          </el-icon>
        </el-tooltip>
      </div>
      <div>
        ￥
        <span class="fs-24">{{ dataPage.merchantInfo.amountFreeze }}</span>
      </div>
    </div>
  </div>
  <!-- 线下回款--->
  <DepositApplication v-model="dataPage.openEarlyWarning" :userInfo="userInfo" @refresh="initData"></DepositApplication>
  <!--修改-->
  <FundsAlertSettings v-model="dataPage.openFundsAlert" :userInfo="userInfo" @refresh="initData"
    :curryInfo="dataPage.merchantInfo"></FundsAlertSettings>
</template>

<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import DepositApplication from './DepositApplication.vue';
import FundsAlertSettings from './FundsAlertSettings.vue';
const { userInfo } = storeToRefs(useUserStore())
const dataPage = reactive({
  openEarlyWarning: false,
  openFundsAlert: false,
  merchantInfo: {
    id: '',
    merchantId: '',
    orgId: '',
    amountBalance: null,
    amountCreditLine: null,
    amountWarningThreshold: null,
    warningStatus: 0,
    amountFreeze: ''
  }
})

onMounted(() => {
  initData()
})
//完善
const initData = () => {
  queryByMerchantId()
}
//查资金信息
const queryByMerchantId = () => {
  const { orgId: orgId } = userInfo.value as any
  moneyManagement_api.A_queryByMerchantId({ orgId }).then((res: any) => {
    dataPage.merchantInfo = {
      ...dataPage.merchantInfo,
      ...res
    }
  })

}
//申请
const applyHandler = () => {
  dataPage.openEarlyWarning = true
}
//修改
const reviseHandler = () => {
  dataPage.openFundsAlert = true
}
//正常修改
const changeHandler = () => {
  const { merchantInfo } = dataPage
  moneyManagement_api.A_updatePrepaidDepositRechargeWarnConfig({ ...merchantInfo }).then(res => {
    ElMessage.success('修改成功!')
    initData()
  })
}
</script>

<style lang="scss" scoped>
.deposit-card {
  flex: 3;

  .deposit-card-container {
    border-radius: 10px;
    flex: 1;
    background: var(--el-searchForm-bg-color);
    padding: 30px 60px;
    position: relative;

    .deposit-title {
      position: relative;
      margin-bottom: 10px;

      svg {
        font-size: 20px;
        position: absolute;
        left: -25px;
        top: 0px;
      }
    }

    .deposit-btn {
      position: absolute;
      right: 20px;
      bottom: 10px;
    }

    .home div:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
