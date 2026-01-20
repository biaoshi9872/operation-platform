<template>
  <div class="flex deposit-card">
    <div class="deposit-card-container left-card mr-5">
      <div class="left-content">
        <div class="balance-label">
          <el-icon class="warning-icon">
            <Warning />
          </el-icon>
          <h3>账户可用余额 (元)</h3>
        </div>
        <div class="balance-amount">￥{{ dataPage.merchantInfo.amountBalance }}</div>
        <div class="apply-btn-wrapper">
          <AuthButton type="primary" size="large" round class="apply-btn" authKey="CWZL_SQCZ" @click="applyHandler">
            <el-icon class="mr-1">
              <Plus />
            </el-icon>申请充值
          </AuthButton>
        </div>
      </div>
      <div class="right-content">
        <div class="dealer-info">
          <div class="dealer-label">机构ID</div>
          <div class="dealer-value">{{ dataPage.merchantInfo.orgId }}</div>
        </div>
        <div class="credit-info mt-4">
          <div class="credit-label">授信额</div>
          <div class="credit-value">￥{{ dataPage.merchantInfo.amountCreditLine }}</div>
        </div>
      </div>
    </div>

    <div class="deposit-card-container right-card">
      <div class="frozen-header">
        <span class="frozen-label">冻结预存款 (元)</span>
        <el-tooltip class="box-item" content="提交订单就会进行预存款冻结" placement="top">
          <el-icon class="info-icon">
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>
      <div class="frozen-content">
        <div class="frozen-amount">￥{{ dataPage.merchantInfo.amountFreeze }}</div>
      </div>
      <!-- <div class="frozen-footer">
        当前占比 0.00%
      </div> -->
    </div>
  </div>
  <DepositApplication v-model="dataPage.openEarlyWarning" :userInfo="userInfo" @refresh="initData"></DepositApplication>
  <FundsAlertSettings v-model="dataPage.openFundsAlert" :userInfo="userInfo" @refresh="initData"
    :curryInfo="dataPage.merchantInfo"></FundsAlertSettings>
</template>

<script setup lang="ts">
import moneyManagement_api from '@/api/moneyManagement/index'

import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import DepositApplication from './DepositApplication.vue'
import FundsAlertSettings from './FundsAlertSettings.vue'
import { ElMessage } from 'element-plus'
import { Warning, QuestionFilled, Plus } from '@element-plus/icons-vue'

const { userInfo } = storeToRefs(useUserStore())
const dataPage = reactive({
  openEarlyWarning: false,
  openFundsAlert: false,
  merchantInfo: {
    id: '',
    merchantId: '',
    merchantCode: '',
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
  A_updatePrepaidDepositRechargeWarnConfig({ ...merchantInfo }).then(res => {
    ElMessage.success('修改成功!')
    initData()
  })
}
</script>

<style lang="scss" scoped>
.deposit-card {
  display: flex;
  margin-right: 6px;
  width: 100%;

  .deposit-card-container {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 30px;
    position: relative;
    box-shadow: 0 6px 18px rgba(31, 41, 55, 0.08);
    border: 1px solid #e6e8eb;
    color: #1f2d3d;
    transition: all 0.2s ease;
  }

  .deposit-card-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(31, 41, 55, 0.12);
    border-color: #d7dade;
  }

  .left-card {
    flex: 2;
    display: flex;
    justify-content: space-between;

    .left-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .balance-label {
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;

        .warning-icon {
          color: #ef4444;
        }
      }

      .balance-amount {
        font-size: 48px;
        font-weight: bold;
        color: #ef4444;
        margin: 10px 0;
        font-family: 'DIN Alternate', sans-serif;
      }

      .apply-btn-wrapper {
        .apply-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(31, 41, 55, 0.12);
          }
        }
      }
    }

    .right-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      text-align: right;
      padding: 24px;
      border-left: 1px solid rgba(17, 24, 39, 0.08);
      margin-left: 20px;

      .dealer-info,
      .credit-info {

        .dealer-label,
        .credit-label {
          font-size: 12px;
          color: #6b7280;
          letter-spacing: 1px;
          margin-bottom: 4px;
          text-transform: uppercase;
          text-align: right;
        }

        .dealer-value {
          font-size: 24px;
          color: #4f46e5;
          font-weight: bold;
          font-family: 'DIN Alternate', sans-serif;
        }

        .credit-value {
          font-size: 24px;
          color: #111827;
          font-weight: bold;
          font-family: 'DIN Alternate', sans-serif;
        }
      }
    }
  }

  .right-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .frozen-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 14px;

      .info-icon {
        color: #6b7280;
        cursor: help;
      }
    }

    .frozen-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .frozen-amount {
        font-size: 32px;
        color: #111827;
        font-weight: bold;
      }
    }

    .frozen-footer {
      text-align: right;
      color: #6b7280;
      font-size: 12px;
    }
  }
}
</style>
