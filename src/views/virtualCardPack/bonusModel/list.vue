<script setup lang="ts">
defineOptions({
    name: 'bonusModelList'
})
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import bonusModel_api from '@/api/bonusModel/index'
import PushBonusProductModel from './components/PushBonusProductModel.vue'
import virtualCardPackProductEnum from '@/utils/constant/virtualCardPackProduct'
import bonusModel_enum from '@/utils/constant/bonusModel'
import BonusProductDetail from './components/BonusProductDetail.vue'
const router = useRouter()

const dataPage: IPage<any, any> = reactive({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        "skuCode": null,
        "skuName": null,
        "status": null,
        "pushStatus": null,
        "supplyPriceMin": null,
        "supplyPriceMax": null,
        "marketPriceMin": null,
        "marketPriceMax": null,
        "couponType": null,
        categoryCode: null,
        "updateDateMin": null,
        "updateDateMax": null,
    },
    otherData: {
        showRecharge: false,
        curryInfo: {}
    },
    showPushVirtualProductModel: false,
    dataList: [],
    curryInfo: {},
    type: 'push',
    isBatch: false,
    mulSelect: [],
    multipleList: [],
    showDetailModel: false,
    curryRow: {},
    toDownloadCenterApi: null,//bonusModel_api.A_packageExport,
    selectPage: bonusModel_api.A_couponPage,
})
const { searchQuery, toDownloadCenter, downloadFile, handleSelectionChange } = pageHooks(dataPage)

const getQueryParams = () => {
    const { page, facade, facadeKz } = dataPage
    return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}
/**
 * 导出
 */
const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter(obj)
}
const batchPushHandler = () => {
    dataPage.type = 'push'
    dataPage.isBatch = true
    dataPage.curryInfo = null
    dataPage.mulSelect = dataPage.multipleList
    dataPage.showPushVirtualProductModel = true
}
const pushHandler = (row: any = null) => {
    dataPage.type = 'push'
    dataPage.isBatch = false
    dataPage.curryInfo = row
    dataPage.mulSelect = []
    dataPage.showPushVirtualProductModel = true
}

const openDetail = (row: any = null) => {
    dataPage.curryRow = row
    dataPage.showDetailModel = true
}

</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="商品编码">
                <el-input v-model="dataPage.facade.skuCode" placeholder="请输入商品编码" clearable />
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="dataPage.facade.skuName" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="平台成本">
                <div class="flex items-center gap-2">
                    <el-input v-model.number="dataPage.facade.supplyPriceMin" placeholder="最低价" />
                    <span>-</span>
                    <el-input v-model.number="dataPage.facade.supplyPriceMax" placeholder="最高价" />
                </div>
            </el-form-item>
            <el-form-item label="商品状态">
                <el-select v-model="dataPage.facade.status" placeholder="请选择商品状态" clearable>
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="item in bonusModel_enum.goodsStatusList" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="最近更新时间">
                <DatePickerRange v-model:start="dataPage.facade.updateDateMin"
                    v-model:end="dataPage.facade.updateDateMax" />
            </el-form-item>
            <el-form-item label="市场价">
                <div class="flex items-center gap-2">
                    <el-input v-model.number="dataPage.facade.marketPriceMin" placeholder="最低价" />
                    <span>-</span>
                    <el-input v-model.number="dataPage.facade.marketPriceMax" placeholder="最高价" />
                </div>
            </el-form-item>
            <el-form-item label="推送状态">
                <el-select v-model="dataPage.facade.pushStatus" placeholder="请选择推送状态" clearable>
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="item in virtualCardPackProductEnum.goodsPushStatusList" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="商品分类">
                <ClassificationSelect class="w-full" source="bonusGoods" filterable clearable placeholder="请选择商品分类"
                    v-model:code="dataPage.facade.couponType" v-model:categoryCode="dataPage.facade.categoryCode">
                </ClassificationSelect>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder"
                :loading="dataPage.loadingData" row-key="id" @selection-change="handleSelectionChange">
                uat-test-116
                <template #option>
                    <el-button type="primary" @click="batchPushHandler"
                        :disabled="!dataPage.multipleList.length">批量推送</el-button>
                    <el-button v-if="dataPage.toDownloadCenterApi" type="primary" :loading="dataPage.loadingExport"
                        @click="exportHandler">导出</el-button>
                </template>
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品编码" prop="couponId" min-width="180px" align="left" show-overflow-tooltip />
                <el-table-column label="商品名称" prop="couponName" min-width="180px" align="left" show-overflow-tooltip />
                <el-table-column label="市场价" prop="faceValue" min-width="120px" align="left" />
                <el-table-column label="平台成本" prop="supplyPrice" min-width="120px" align="left" />
                <el-table-column label="面额" prop="faceValue" min-width="120px" align="left" />
                <el-table-column label="商品状态" min-width="100px" align="left">
                    <template #default="scope">{{
                        bonusModel_enum.getGoodsStatusTitle(scope.row.status)
                        || '-' }}</template>
                </el-table-column>
                <el-table-column label="商品分类" prop="couponTypeName" min-width="120px" align="left" />
                <el-table-column label="推送状态" min-width="100px" align="left">
                    <template #default="scope">{{
                        virtualCardPackProductEnum.getGoodsPushStatusTitle(scope.row.pushStatus) || '-' }}</template>
                </el-table-column>
                <el-table-column label="已推送应用" min-width="160px" align="left">
                    <template #default="scope">
                        <MoreTag :list="scope.row.appNameList" titleKey="appName" />
                    </template>
                </el-table-column>
                <el-table-column label="批次有效期" prop="createDate" min-width="200" align="left">
                    <template #default="scope">{{ `${scope.row.expireDateMin} 至 ${scope.row.expireDateMax}`
                        }}</template>
                </el-table-column>
                <el-table-column label="最近更新时间" prop="updateDate" min-width="170px" align="left">
                </el-table-column>
                <el-table-column label="操作" min-width="180px" align="right" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" v-if="scope.row.status === 2" link
                            @click="pushHandler(scope.row)">推送</el-button>
                        <el-button type="primary" link @click="openDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
    <PushBonusProductModel v-model="dataPage.showPushVirtualProductModel" :curryInfo="dataPage.curryInfo"
        @refresh="searchQueryHarder" :type="dataPage.type" :isBatch="dataPage.isBatch" :mulSelect="dataPage.mulSelect"
        ref="pushVirtualProductModelRef">
    </PushBonusProductModel>
    <BonusProductDetail v-model:show="dataPage.showDetailModel" productSource="108" type="api"
        :itemInfo="dataPage.curryRow">
    </BonusProductDetail>

</template>
<style lang="scss" scoped></style>