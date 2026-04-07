<script setup lang="ts">
defineOptions({
  name: 'configurationList'
})
import application_api from '@/api/system/application'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { ElMessage } from 'element-plus'

type PriceAlarmRecord = API.T_YingYongJiaGeYuJingFenYeListRecords

const appStatusList = [
  {
    value: 1,
    label: '正常'
  },
  {
    value: 0,
    label: '禁用'
  }
]

const dataPage: IPage<any, PriceAlarmRecord> = reactive({
  isOnload: true,
  page: {
    page: 1,
    limit: 10,
    totalCount: 0
  },
  facade: {
    appIdList: [],
    status: '',
    orgIdList: []
  },
  otherData: {
    showConfig: false,
    showLog: false,
    configLoading: false,
    logLoading: false,
    curryInfo: {} as PriceAlarmRecord,
    configForm: {
      status: true
    },
    logList: [] as API.T_JiaGeYuJingBianGengJiLuListRecords[]
  },
  refreshLoading: false,
  dataList: [],
  selectPage: application_api.A_pagePriceAlarm,
  toDownloadCenterApi:application_api.A_pagePriceAlarmExport
})
const { searchQuery , toDownloadCenter} = pageHooks(dataPage)
const { otherData } = toRefs(dataPage as any)

const getQueryParams = () => {
  const { page, facade, facadeKz } = dataPage
  const params = { ...page, ...facade, ...facadeKz }
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && !value.length)) {
      delete params[key]
    }
  })
  return params
}

const searchQueryHarder = () => {
  searchQuery(getQueryParams())
}

const handleExport = () => {
  const obj = getQueryParams()
  toDownloadCenter(obj)
}

const openConfigDialog = (row: PriceAlarmRecord) => {
  otherData.value.curryInfo = row
  otherData.value.configForm.status = Boolean(row.priceAlarmSwitch)
  otherData.value.showConfig = true
}

const confirmConfig = () => {
  const row = otherData.value.curryInfo
  if (!row?.id) return
  otherData.value.configLoading = true
  application_api
    .A_updatePriceAlarm({
      appId: row.id,
      status: otherData.value.configForm.status
    })
    .then(() => {
      ElMessage.success('配置成功')
      otherData.value.showConfig = false
      searchQueryHarder()
    })
    .finally(() => {
      otherData.value.configLoading = false
    })
}

const openLogDialog = (row: PriceAlarmRecord) => {
  otherData.value.curryInfo = row
  otherData.value.showLog = true
  otherData.value.logLoading = true
  application_api
    .A_priceAlarmLog({
      appId: row.id as number
    })
    .then((res: any) => {
      otherData.value.logList = Array.isArray(res) ? res : []
    })
    .finally(() => {
      otherData.value.logLoading = false
    })
}

const getStatusLabel = (status: any) => {
  return appStatusList.find(item => item.value == status)?.label || '--'
}

const getPriceAlarmLabel = (status: any) => {
  return status ? '开启' : '关闭'
}
</script>
<template>
  <PageContainer class="main_box price-alarm-page">
    <SearchForm
      v-model:model="dataPage.facade"
      v-model:current-page="dataPage.page.page"
      class="el-search-item"
      @search="searchQueryHarder"
    >
      <el-form-item label="应用名称">
        <ApplicationSelect
          v-model="dataPage.facade.appIdList"
          :multiple="true"
          value-key="id"
          value-label="appName"
        ></ApplicationSelect>
      </el-form-item>
      <el-form-item label="应用状态">
        <SelectModel v-model="dataPage.facade.status" :selectList="appStatusList"></SelectModel>
      </el-form-item>
      <el-form-item label="分支机构">
        <OrgSelect v-model="dataPage.facade.orgIdList" :multiple="true"></OrgSelect>
      </el-form-item>
    </SearchForm>
      <TableModel
        :page="dataPage.page"
        :listTableData="dataPage.dataList"
        :dataPage="dataPage"
        :loading="dataPage.loadingData"
        @pagingQuery="searchQueryHarder"
      >
        <template #option>
          <el-button type="primary" :loading="dataPage.loadingExport" @click="handleExport">导出</el-button>
        </template>
        <YbtTableColumn type="index" label="序号" width="70" align="center"></YbtTableColumn>
        <YbtTableColumn prop="appCode" label="应用编码" min-width="120"></YbtTableColumn>
        <YbtTableColumn prop="appName" label="应用名称" min-width="140" show-overflow-tooltip></YbtTableColumn>
        <YbtTableColumn prop="orgName" label="分支机构" min-width="130" show-overflow-tooltip></YbtTableColumn>
        <YbtTableColumn prop="status" label="应用状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status == 1 ? 'success' : 'info'">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="priceAlarmSwitch" min-width="210" align="center">
          <template #header>
            <div class="alarm-header">
              <span>商品价格倒挂风控</span>
              <el-tooltip content="开启后，商品价格倒挂将会触发企微提醒，且下单失败" placement="top">
                <span class="info-icon">i</span>
              </el-tooltip>
              <span>（分销价&lt;平台供应价/平台成本）</span>
            </div>
          </template>
          <template #default="{ row }">
            {{ getPriceAlarmLabel(row.priceAlarmSwitch) }}
          </template>
        </YbtTableColumn>
        <YbtTableColumn prop="configUser" label="配置人" min-width="120" show-overflow-tooltip></YbtTableColumn>
        <YbtTableColumn prop="updateTime" label="更新时间" min-width="170"></YbtTableColumn>
        <YbtTableColumn prop label="操作" fixed="right" align="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="openConfigDialog(row)">配置</el-button>
            <el-button type="primary" link @click="openLogDialog(row)">修改记录</el-button>
          </template>
        </YbtTableColumn>
      </TableModel>
    <el-dialog
      v-model="otherData.showConfig"
      title="配置"
      width="450px"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form :model="otherData.configForm" label-width="160px" class="config-form">
        <el-form-item required label="商品价格倒挂风控">
          <el-tooltip content="开启后，商品价格倒挂将会触发企微提醒，且下单失败" placement="top">
            <span class="info-icon form-info-icon">i</span>
          </el-tooltip>
          <el-radio-group v-model="otherData.configForm.status">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="otherData.showConfig = false">取消</el-button>
        <el-button type="primary" :loading="otherData.configLoading" @click="confirmConfig">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="otherData.showLog" title="修改记录" width="560px" append-to-body destroy-on-close>
      <el-table :data="otherData.logList" border v-loading="otherData.logLoading" max-height="360px">
        <el-table-column prop="operateTime" label="操作时间" min-width="170"></el-table-column>
        <el-table-column prop="operateUser" label="操作人" min-width="120"></el-table-column>
        <el-table-column prop="operateContent" label="操作内容" min-width="220" show-overflow-tooltip></el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </el-dialog>
  </PageContainer>
</template>
<style lang="scss" scoped>
.price-alarm-page {
  .alarm-header {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    line-height: 20px;
    vertical-align: middle;

    .info-icon {
      position: absolute;
      margin-left: 128px;
      margin-top: 2px;
    }
  }

  .info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: var(--el-color-primary);
    font-size: 12px;
    line-height: 14px;
    border: 1px solid var(--el-color-primary);
    border-radius: 50%;
    cursor: pointer;
  }

  .config-form {
    padding: 20px 0;
  }

  .form-info-icon {
    margin-right: 24px;
  }
}
</style>
