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
        "supplyPriceStart": null,
        "supplyPriceEnd": null,
        "markPriceStart": null,
        "markPriceEnd": null,
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
        "operStatus": type == 'up' ? 3 : 2
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
        "operStatus": type == 'up' ? 3 : 2
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
            id: row.id
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
            id: row.id
        }
    })
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
            <el-form-item label="供应商">
                <el-select v-model="dataPage.facade.supplyIds" multiple placeholder="请选择供应商" clearable>
                    <el-option v-for="item in dataPage.supplerList" :key="item.id" :label="item.supplyName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <SelectModel v-model="dataPage.facade.operStatus" placeholder="请选择状态"
                    :selectList="goods_enum.operStatus"></SelectModel>
            </el-form-item>
            <el-form-item label="添加时间">
                <DatePickerRange v-model:start="dataPage.facade.addStartTime" v-model:end="dataPage.facade.addEndTime">
                </DatePickerRange>
            </el-form-item>
            <el-form-item label="含税供应价">
                <DoubleInput v-model:start="dataPage.facade.supplyPriceStart"
                    v-model:end="dataPage.facade.supplyPriceEnd"></DoubleInput>
            </el-form-item>
            <el-form-item label="库存数量">
                <DoubleInput v-model:start="dataPage.facade.stockStart" v-model:end="dataPage.facade.stockEnd">
                </DoubleInput>
            </el-form-item>
            <el-form-item label="市场价">
                <DoubleInput v-model:start="dataPage.facade.markPriceStart" v-model:end="dataPage.facade.markPriceEnd">
                </DoubleInput>
            </el-form-item>
        </SearchForm>
        <div class="option_box">
            <TableModel :page="dataPage.page" :listTableData="dataPage.dataList"
                @selection-change="handleSelectionChange" :loading="dataPage.loadingData"
                @pagingQuery="searchQueryHarder">
                <template #option>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                    <el-button type="primary" :loading="dataPage.loadingExport" @click="exportHandler">导出</el-button>
                    <el-button type="primary" @click="batchUpOrDownDateHandler('up')">批量上架</el-button>
                    <el-button type="primary" @click="batchUpOrDownDateHandler('down')">批量下架</el-button>
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
                <el-table-column label="供应商" prop="supplyName" min-width="120px" align="left"></el-table-column>
                <el-table-column label="市场价" prop="markPrice" min-width="120px" align="left"></el-table-column>
                <el-table-column label="库存数量" prop="stock" min-width="120px" align="left"></el-table-column>
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
                <el-table-column label="电商链接" prop="stock" min-width="120px" align="left"></el-table-column>
                <el-table-column label="限售模版" prop="freightTemplateId" min-width="120px" align="left"></el-table-column>
                <el-table-column label="操作" prop="accountValidStart" min-width="180px" align="right">
                    <template #default="{ row }">
                        <el-button type="primary" v-if="[0].includes(row.operStatus)" link
                            @click="editGoodHandler(row)">编辑</el-button>
                        <el-button v-if="row.status == 1" type="primary" link
                            @click="upOrDownDateHandler(row, 'up')">上架</el-button>
                        <el-button v-if="row.operStatus == 3" type="primary" link
                            @click="upOrDownDateHandler(row, 'down')">下架</el-button>
                        <el-button type="primary" link @click="viewGoodHandler(row)">详情</el-button>
                    </template>
                </el-table-column>
            </TableModel>
        </div>
    </PageContainer>
</template>
<style lang="scss" scoped></style>