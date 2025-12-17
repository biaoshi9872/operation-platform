<script setup lang="ts">
defineOptions({
    name: 'virtualCardPackProductList'
})
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import { ElMessage, ElMessageBox } from 'element-plus'
import virtualCardPackProductEnum from '@/utils/constant/virtualCardPackProduct'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import PushVirtualProductModel from './components/PushVirtualProductModel.vue'
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const router = useRouter()

const dataPage: IPage<any, any> = reactive({
    isOnload: true,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        skuCode: '',
        skuName: '',
        goodsAttr: null,
        supplyPriceMin: null,
        supplyPriceMax: null,
        markPriceMin: null,
        markPriceMax: null,
        expireDateMin: '',
        expireDateMax: '',
        startDate: '',
        endDate: '',
        pushStatus: null,
        operStatus: null
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
    toDownloadCenterApi: virtualCardPackProduct_api.A_packageExport,
    selectPage: virtualCardPackProduct_api.A_page,
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

// 编辑处理函数
const handleEdit = (row: any) => {
    router.push({
        path: '/virtualCardPack/virtualCardPackProduct/edit',
        query: {
            packageCode: row.packageCode
        }
    })
}

// 查看详情处理函数
const handleView = (row: any) => {
    router.push({
        path: '/virtualCardPack/virtualCardPackProduct/detail',
        query: {
            packageCode: row.packageCode
        }
    })
}
/**
 * 新增
 */
const handleAdd = () => {
    router.push({
        path: '/virtualCardPack/virtualCardPackProduct/index'
    })
}

/**
 * 导出
 */
const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter(obj)
}

const deleteHandler = async (row: any) => {
    try {
        ElMessageBox.confirm('确认删除吗？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            await virtualCardPackProduct_api.A_delPackage({ packageCode: row.packageCode })
            ElMessage.success('删除成功')
            searchQueryHarder()
        })
    } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
    }
}

const enableHandler = async (row: any) => {
    try {
        ElMessageBox.confirm('是否确认设为不可用？不可用后，该商品将不会进行正常售卖。', '设为不可用提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            await virtualCardPackProduct_api.A_enable({ packageCode: row.packageCode })
            ElMessage.success('设为不可用成功')
            searchQueryHarder()
        })
    } catch (error) {
        console.error('设为不可用失败:', error)
        ElMessage.error('设为不可用失败')
    }
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

</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="商品编码">
                <el-input v-model="dataPage.facade.packageCode" placeholder="请输入商品编码" clearable />
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="dataPage.facade.packageName" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="平台成本">
                <div class="flex items-center gap-2">
                    <el-input v-model.number="dataPage.facade.supplyPriceMin" placeholder="最低价" />
                    <span>-</span>
                    <el-input v-model.number="dataPage.facade.supplyPriceMax" placeholder="最高价" />
                </div>
            </el-form-item>
            <el-form-item label="商品状态">
                <el-select v-model="dataPage.facade.packageStatus" placeholder="请选择商品状态" clearable>
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="item in virtualCardPackProductEnum.goodsStatusList" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
                <DatePickerRange v-model:start="dataPage.facade.startDate" v-model:end="dataPage.facade.endDate" />
            </el-form-item>
            <el-form-item label="礼包市场价">
                <div class="flex items-center gap-2">
                    <el-input v-model.number="dataPage.facade.markPriceMin" placeholder="最低价" />
                    <span>-</span>
                    <el-input v-model.number="dataPage.facade.markPriceMax" placeholder="最高价" />
                </div>
            </el-form-item>
            <el-form-item label="推送状态">
                <el-select v-model="dataPage.facade.pushStatus" placeholder="请选择推送状态" clearable>
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="item in virtualCardPackProductEnum.goodsPushStatusList" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" @pagingQuery="searchQueryHarder"
                :loading="dataPage.loadingData" row-key="packageCode" @selection-change="handleSelectionChange">
                <template #option>
                    <el-button type="primary" @click="handleAdd">创建</el-button>
                    <el-button type="primary" @click="batchPushHandler"
                        :disabled="!dataPage.multipleList.length">批量推送</el-button>
                    <el-button v-if="dataPage.toDownloadCenterApi" type="primary" :loading="dataPage.loadingExport"
                        @click="exportHandler">导出</el-button>
                </template>
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品编码" prop="packageCode" min-width="140px" align="left" />
                <el-table-column label="商品名称" prop="packageName" min-width="180px" align="left" show-overflow-tooltip />
                <el-table-column label="子商品明细" min-width="240px" align="left">
                    <template #default="scope">
                        <PackageAttributeModel :couponList="scope.row.couponList" />
                    </template>
                </el-table-column>
                <el-table-column label="礼包市场价" prop="markPrice" min-width="120px" align="left" />
                <el-table-column label="平台成本" prop="supplyPrice" min-width="120px" align="left" />
                <el-table-column label="商品状态" min-width="100px" align="left">
                    <template #default="scope">{{
                        virtualCardPackProductEnum.getGoodsStatusTitle(scope.row.packageStatus)
                        || '-' }}</template>
                </el-table-column>
                <el-table-column label="推送状态" min-width="100px" align="left">
                    <template #default="scope">{{
                        virtualCardPackProductEnum.getGoodsPushStatusTitle(scope.row.pushStatus) || '-' }}</template>
                </el-table-column>
                <el-table-column label="已推送应用" min-width="160px" align="left">
                    <template #default="scope">
                        <MoreTag :list="scope.row.appNameList" titleKey="appName" />
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" prop="createDate" min-width="170px" align="left" />
                <el-table-column label="操作" min-width="180px" align="right" fixed="right">
                    <template #default="scope">
                        <el-button type="primary" link v-if="scope.row.packageStatus === 2"
                            @click="pushHandler(scope.row)">推送</el-button>
                        <el-button type="primary" v-if="scope.row.packageStatus !== 2" link
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="primary" link @click="handleView(scope.row)">详情</el-button>
                        <el-button type="primary" v-if="[0, 1].includes(scope.row.packageStatus)" link
                            @click="deleteHandler(scope.row)">删除</el-button>
                        <el-button type="primary" v-if="scope.row.packageStatus === 2" link
                            @click="enableHandler(scope.row)">设为不可用</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
    <PushVirtualProductModel v-model="dataPage.showPushVirtualProductModel" :curryInfo="dataPage.curryInfo"
        @refresh="searchQueryHarder" :type="dataPage.type" :isBatch="dataPage.isBatch" :mulSelect="dataPage.mulSelect"
        ref="pushVirtualProductModelRef">
    </PushVirtualProductModel>
</template>
<style lang="scss" scoped></style>
