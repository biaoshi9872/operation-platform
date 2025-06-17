<script setup lang="ts">
defineOptions({
    name: ''
})
import goods_api from '@/api/goods'
import supplier_api from '@/api/supplier'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
import goods_enum from '@/utils/constant/goods'
import { ElMessage, ElMessageBox } from 'element-plus'
import UpdateStockNumDialog from './components/UpdateStockNumDialog.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
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
        "skuCode": "",
        "skuName": "",
        "operStatus": null,
        "categoryCode": "",
        "supplyIds": [],
        "platformSupplyPriceMin": null,
        "platformSupplyPriceMax": null,
        "marketPriceMin": null,
        "marketPriceMax": null,
        "stockStart": null,
        "stockEnd": null
    },
    facadeKz: {
        active: '1'
    },
    curryInfo: null,
    dataList: [],
    multipleList: [],
    showResetPassword: false,
    showSupplier: false,
    supplerList: [],
    updateStockShow: false,
    toDownloadCenterApi: goods_api.A_goodsExport,
    selectPage: goods_api.A_page,
})
const { searchQuery, toDownloadCenter, downloadFile } = pageHooks(dataPage)
const getQueryParams = () => {
    const { page, facade, facadeKz } = dataPage
    return { ...page, ...facade, ...facadeKz }
}
onMounted(() => {
    supplier_api.A_supplierManageGetByOrgId({ orgId: '' }).then(res => {
        dataPage.supplerList = res
    })
})
const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}

const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter(obj)
}
const handleSelectionChange = (value: any) => {
    dataPage.multipleList = value
}
const batchUpOrDownDateHandler = (type: 'up' | 'down') => {
    const title = type == 'up' ? '上架' : '下架'
    let obj = {
        "skuCode": dataPage.multipleList.map(item => item.skuCode),
        "operStatus": type == 'up' ? 1 : 2
    }
    ElMessageBox.confirm(
        `是否批量${title}?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            goods_api.A_upDown(obj).then(res => {
                ElMessage.success(`批量${title}成功`)
                searchQueryHarder()
            })
        })
}



const upOrDownDateHandler = (row: any, type: 'up' | 'down') => {
    const title = type == 'up' ? '上架' : '下架'
    let obj = {
        "skuCode": [row.skuCode],
        "operStatus": type == 'up' ? 1 : 2
    }
    ElMessageBox.confirm(
        `是否${title}?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            goods_api.A_upDown(obj).then(res => {
                ElMessage.success(`批量${title}成功`)
                searchQueryHarder()
            })
        })
}


/**
 * 新增
 */
const handleAdd = () => {
    router.push({
        path: '/supplierManagement/commodity/index',
        query: {
        }
    })
}
/**
 * 修改
 */
const editGoodHandler = (row: any) => {
    router.push({
        path: '/supplierManagement/commodity/edit',
        query: {
            skuCode: encodeURIComponent(row.skuCode)
        }
    })
}
/**
 * 查看
 */
const viewGoodHandler = (row: any) => {
    router.push({
        path: '/supplierManagement/commodity/detail',
        query: {
            skuCode: encodeURIComponent(row.skuCode)
        }
    })
}

const toFreightHandler = (row: any) => {
    router.push({
        path: '/system/restrictedSalesArea/index',
        query: {
            id: row.limitTemplateId
        }
    })
}
const updataStockHandler = (row: any) => {
    dataPage.curryInfo = row
    dataPage.updateStockShow = true

}
</script>
<template>
    <PageContainer class="main_box">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="商品名称">
                <el-input v-model="dataPage.facade.skuName" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="商品编码">
                <el-input v-model="dataPage.facade.skuCode" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="商品分类">
                <ClassificationSelect v-model:firstCateId="dataPage.facade.firstCateId"
                    v-model:secondCateId="dataPage.facade.secondCateId"
                    v-model:thirdCateId="dataPage.facade.thirdCateId"
                    v-model:categoryCode="dataPage.facade.categoryCode">
                </ClassificationSelect>
            </el-form-item>
            <el-form-item v-if="getSystemOptionType !=401 "  label="供应商">
                <el-select v-model="dataPage.facade.supplyIds" multiple placeholder="请选择供应商" clearable>
                    <el-option v-for="item in dataPage.supplerList" :key="item.id" :label="item.supplyName"
                        :value="item.supplyId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <SelectModel v-model="dataPage.facade.operStatus" placeholder="请选择状态"
                    :selectList="goods_enum.operStatus" :isShowAll="true"></SelectModel>
            </el-form-item>
            <el-form-item label="添加时间">
                <DatePickerRange v-model:start="dataPage.facade.addStartTime" v-model:end="dataPage.facade.addEndTime">
                </DatePickerRange>
            </el-form-item>
            <el-form-item label="含税供应价">
                <DoubleInput v-model:start="dataPage.facade.platformSupplyPriceMin"
                    v-model:end="dataPage.facade.platformSupplyPriceMax"></DoubleInput>
            </el-form-item>
            <el-form-item label="库存数量">
                <DoubleInput v-model:start="dataPage.facade.stockStart" v-model:end="dataPage.facade.stockEnd">
                </DoubleInput>
            </el-form-item>
            <el-form-item label="市场价">
                <DoubleInput v-model:start="dataPage.facade.marketPriceMin"
                    v-model:end="dataPage.facade.marketPriceMax">
                </DoubleInput>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList"
                @selection-change="handleSelectionChange" :loading="dataPage.loadingData"
                @pagingQuery="searchQueryHarder">
                <template #option>
                    <AuthButton authKey="Good_ADD" type="primary" @click="handleAdd">新增</AuthButton>
                    <AuthButton authKey="GOOD_EXPOERT" type="primary" :loading="dataPage.loadingExport"
                        @click="exportHandler">导出</AuthButton>
                    <AuthButton authKey="Good_BATCH_UP" type="primary" @click="batchUpOrDownDateHandler('up')">批量上架
                    </AuthButton>
                    <AuthButton authKey="Good_BATCH_DOWN" type="primary" @click="batchUpOrDownDateHandler('down')">批量下架
                    </AuthButton>
                </template>
                <el-table-column type="selection" width="80px" align="left"></el-table-column>
                <el-table-column label="商品信息" prop="skuName" width="200px" align="left">
                    <template #default="{ row }">
                        <SkuDetail :goodDetail="row" :showBrandName="false"
                            :customAttribute="{ url: 'images', name: 'skuName', id: '' }">
                        </SkuDetail>
                    </template>
                </el-table-column>
                <el-table-column label="商品编码" prop="skuCode" min-width="120px" align="left"></el-table-column>
                <el-table-column label="商品分类" prop="skuCategory" min-width="120px" align="left"></el-table-column>
                <el-table-column v-if="getSystemOptionType !=401 "  label="供应商" prop="supplyName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="市场价" prop="markPrice" min-width="120px" align="left"></el-table-column>
                <el-table-column label="库存数量" prop="stock" min-width="120px" align="left">
                    <template #default="{ row }">
                        <div class="stock-box">
                            <div> {{ row.stock }}</div>
                            <el-icon v-auth="'Good_EDIT_STOCK'" @click="updataStockHandler(row)">
                                <Edit />
                            </el-icon>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="含税供应价" prop="taxPurchaseCost" min-width="120px" align="left"></el-table-column>
                <el-table-column label="不含税供应价" prop="noTaxPurchaseCost" min-width="120px"
                    align="left"></el-table-column>0
                <el-table-column label="销售单位" prop="unit" min-width="120px" align="left"></el-table-column>
                <el-table-column label="状态" prop="operStatus" min-width="120px" align="left">
                    <template #default="{ row }">
                        {{ goods_enum.getOperStatus(row.operStatus) }}
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" prop="createDate" min-width="120px" align="left"></el-table-column>
                <el-table-column label="电商链接" prop="stock" min-width="120px" align="left">
                    <template #default="{ row }">
                        <JinDLink type="view" :row="{ jdLink: row.businessLink, ...row }"></JinDLink>
                    </template>
                </el-table-column>
                <el-table-column label="限售模版" prop="limitTemplateId" min-width="120px" align="left">
                    <template #default="{ row }">
                        <el-link v-if="row.limitTemplateName" type="primary" @click="toFreightHandler(row)">{{
                            row.limitTemplateName }}</el-link>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="accountValidStart" min-width="180px" fixed="right" align="right">
                    <template #default="{ row }">
                        <AuthButton authKey="Good_EDIT" type="primary" v-if="[0, 2].includes(row.operStatus)" link
                            @click="editGoodHandler(row)">编辑</AuthButton>
                        <AuthButton authKey="Good_UP" v-if="[2].includes(row.operStatus)" type="primary" link
                            @click="upOrDownDateHandler(row, 'up')">上架</AuthButton>
                        <AuthButton authKey="Good_DOWN" v-if="row.operStatus == 1" type="primary" link
                            @click="upOrDownDateHandler(row, 'down')">下架</AuthButton>
                        <el-button type="primary" link @click="viewGoodHandler(row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
        <UpdateStockNumDialog v-model="dataPage.updateStockShow" :curryInfo="dataPage.curryInfo"
            @refresh="searchQueryHarder">
        </UpdateStockNumDialog>
    </PageContainer>
</template>
<style lang="scss" scoped>
.stock-box {
    display: flex;
    align-items: center;
    gap: 4px;

}
</style>