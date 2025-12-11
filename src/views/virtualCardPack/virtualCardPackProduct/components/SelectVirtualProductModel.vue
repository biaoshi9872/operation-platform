<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import virtualCardPackProduct_enum from '@/utils/constant/virtualCardPackProduct'
import pageHooks from '@/hooks/pageListHooks'
import { IPage } from '@/types/from-types'
interface IProp {
    curryInfo: any,
}
const props = withDefaults(defineProps<IProp>(), {
    curryInfo: {}
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'saveData', value: any): void
    (e: 'refresh'): void
}>()
const dataPage: IPage<any, any> = reactive({
    isOnload: false,
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    facade: {
        skuCode: '',
        skuName: '',
        goodsAttr: null,
    },
    dataList: [],
    selectData: [],
    multipleSelection: [],
    selectPage: virtualCardPackProduct_api.A_couponAndVp,
})
const { searchQuery, toDownloadCenter, downloadFile } = pageHooks(dataPage)
const handleReset = () => {
    emits('update:modelValue', false)
}
const handleClose = () => {
    handleReset()
    emits('update:modelValue', false)
}
onMounted(() => {
    dataPage.facade = cloneDeep(dataPage.facade)
})

const openHandler = () => {
    dataPage.facade = {
        ...dataPage.facade
    }
    dataPage.selectData = []
    dataPage.multipleSelection = []
    searchQueryHarder()
}
const handleSubmit = () => {
    handleClose()
    emits('saveData', dataPage.selectData)
}
const handleSelectionChange = (val: any) => {
    dataPage.multipleSelection = val
    val.forEach((item: any) => {
        if (dataPage.selectData.findIndex((i: any) => i.skuCode === item.skuCode) === -1) {
            dataPage.selectData.push({
                ...item,
                goodsNum: 1
            })
        }
    })
}
const getQueryParams = () => {
    const { page, facade, facadeKz } = dataPage
    return { ...page, ...facade, ...facadeKz }
}
const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}
const deleteSelectData = (row: any) => {
    const index = dataPage.selectData.findIndex((item: any) => item.skuCode === row.skuCode)
    if (index !== -1) {
        dataPage.selectData.splice(index, 1)
    }
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="商品选择" width="1450px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
                @search="searchQueryHarder">
                <el-form-item label="产品属性">
                    <el-select v-model="dataPage.facade.goodsAttr" placeholder="请选择" clearable>
                        <el-option v-for="item in virtualCardPackProduct_enum.goodsAttrList" :key="item.value"
                            :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品编码">
                    <el-input v-model="dataPage.facade.skuCode" placeholder="请输入商品编码" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="dataPage.facade.skuName" placeholder="请输入商品名称" clearable></el-input>
                </el-form-item>
            </SearchForm>
            <div class="content">
                <div class="content-table-left">
                    <h3 class="mb-8 color-red">您已选择{{ dataPage.multipleSelection.length }}个商品</h3>
                    <TableModel :page="dataPage.page" :listTableData="dataPage.dataList" :loading="dataPage.loadingData"
                        @pagingQuery="searchQueryHarder" rowKey="skuCode" max-height="400px"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55px"></el-table-column>
                        <el-table-column label="商品名称" prop="skuName" width="200px"
                            :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="商品编码" prop="skuCode" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="面值" prop="faceValue"></el-table-column>
                        <el-table-column label="平台成本" prop="supplyPrice"></el-table-column>
                        <el-table-column label="库存" prop="stock">
                            <template #default="scope">
                                {{ scope.row.stock ? scope.row.stock : '--' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="有效期" prop="expireDateMax" :show-overflow-tooltip="true">
                            <template #default="{ row }">{{ row.expireDateMax ?
                                `${row.expireDateMin}至${row.expireDateMax}` : '-'
                                }}</template>
                        </el-table-column>
                        <el-table-column label="产品属性" prop="goodsAttr" :show-overflow-tooltip="true">
                            <template #default="scope">
                                {{ virtualCardPackProduct_enum.getGoodsAttrTitle(scope.row.goodsAttr) }}
                            </template>
                        </el-table-column>
                    </TableModel>
                </div>
                <div class="content-table-right">
                    <h3 class="mb-8">已选商品列表</h3>
                    <el-table :data="dataPage.selectData" border max-height="460px">
                        <el-table-column label="商品名称" prop="skuName" width="120px"
                            :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="商品编码" prop="skuCode" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="平台成本" prop="supplyPrice"></el-table-column>
                        <el-table-column label="数量" prop="goodsNum" width="120px">
                            <template #default="scope">
                                <el-input-number class="w-80" v-model="scope.row.goodsNum" :min="1" :max="999999999"
                                    :precision="0" :controls="false"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template #default="scope">
                                <el-button type="primary" link @click="deleteSelectData(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确认选择</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped>
.content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-top: 24px;

    .content-table-left {
        width: 60%;
    }

    .content-table-right {
        width: 40%;
    }
}
</style>
