<script setup lang='ts'>
defineOptions({ name: 'orderList' })
import after_api from '@/api/afterOrder/index'
import SkuDetail from '@/components/SkuDetail/index.vue'
import ConfirmReceiptModel from './components/ConfirmReceiptModel.vue'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
import pageHooks from '@/hooks/pageListHooks'
import { tabsStore } from '@/stores'
import { IPage } from '@/types/from-types'
import goodPoor from '@/utils/constant/goodPoor'
import order_enum from '@/utils/constant/order'
import { ElButton } from 'element-plus'
import { ref, resolveDirective, withDirectives } from 'vue'
import system_enum from '@/utils/constant/system'
const { isFromOrgLast, getSystemOptionType } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()
const $route = useRoute()
const authDir = resolveDirective('auth')

const routeConversion = () => {
    const { query } = $route
    if (query) {
        dataPage.facade.currentFlowNodeCode = query.currentFlowNodeCode ? query.currentFlowNodeCode?.split(',').map((el: any) => el + '') : []
    }
}
const dataPage: IPage<any, any> = reactive({
    selectPage: after_api.A_queryPage,
    defaultValueConversion: routeConversion,
    toDownloadCenterApi: after_api.A_AfterOrderExport,
    dataList: [],
    multipleList: [],
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    isOnload: true,
    facade: {
        orgIdList: [],
        appIdList: [],
        afterSaleTypeList: [], //售后类型
        statusList: [], //售后单状态
        applyTimeStart: '', //申请时间起
        applyTimeEnd: '', //申请时间止
        channelOrderNo: '', //渠道订单号
        channelAfterSaleNo: '', //渠道售后单号
        skuName: '', //商品名称
        skuCode: '', //商品编码
        orderNo: '',
        supplierIdList: [], //供应商
        desensitizationStatus: null, //是否脱敏
        afterSaleNo: ''
    },
    facadeKz: {
        bizType: 2
    },
    showConfirmReceiptModel: false,
    curryInfo: null
})
onActivated(() => {
    routeConversion()
    watch(
        () => dataPage.facade.currentFlowNodeCode,
        () => {
            searchQueryHarder()
        }
    )
})
const { pagingQuery, searchQuery, toDownloadCenter } = pageHooks(dataPage)

const exportHandler = () => {
    const obj = getQueryParams()
    toDownloadCenter({ ...obj })
}

// 查询回调
const getQueryParams = () => {
    const { page, facade, facadeKz } = dataPage
    return { ...page, ...facade, ...facadeKz }
}

// 查询回调
const searchQueryHarder = () => {
    const obj = getQueryParams()
    searchQuery(obj)
}

// 分页回调
const pagingQueryHarder = () => {
    const obj = getQueryParams()
    pagingQuery(obj)
}

const toDetailHandler = (row: any) => {
    tabsStoreInfo.reload({
        path: '/orderManagement/compensationOrder/compensationOrderDetail',
        query: {
            afterSaleNo: row.afterSaleNo
        }
    })
}
//确认收款
const confirmReceiptHandler = (row: any) => {
    dataPage.curryInfo = row
    dataPage.showConfirmReceiptModel = true
}

const columns: any = ref([])
onMounted(() => {
    initColumns()
})
const initColumns = () => {
    columns.value = []
    columns.value.push({
        label: '商品信息',
        prop: '1',
        width: '300px',
        align: 'left',
        render: (row: any, props: any) => {
            let newRow = row
            let spec = row.channelSource == 104 ? (row.attributeValue1 || '') + (row.attributeValue2 || '') : ''
            newRow.titleSpec = row.skuName + spec
            return h(SkuDetail, {
                goodDetail: newRow,
                showExtraCode: false,
                customAttribute: {
                    url: 'images',
                    name: 'titleSpec',
                    id: 'skuCode'
                },
                width: '100%',
                curryPropInfo: props
            })
        }
    })
    columns.value.push({
        label: '售后数量',
        align: 'center',
        width: '100px',
        prop: 'afterSaleNum'
    })
    if (!isFromOrgLast.value) {
        columns.value.push({
            label: '平台成本',
            prop: 'platformPurchasePrice',
            align: 'center',
            width: '130px',
            render: (row: any) => {
                return h('div', `￥${row.platformPurchasePrice ?? ''}`)
            }
        })
    }
    columns.value.push({
        label: '平台供应价',
        align: 'center',
        width: '130px',
        prop: 'platformSupplyPrice',
        render: (row: any) => {
            return h('div', `￥${row.platformSupplyPrice ?? ''}`)
        }
    })
    if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
        columns.value.push({
            label: '分销价',
            align: 'center',
            width: '130px',
            prop: 'retailPrice',
            render: (row: any) => {
                return h('div', `￥${row.retailPrice ?? ''}`)
            }
        })
    }
    columns.value.push({
        label: '销售单位',
        align: 'center',
        width: '100px',
        prop: 'unit'
    })
    if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) (columns.value.push({
        label: '商品类型',
        align: 'center',
        width: '100px',
        prop: 'channelSource',
        render: (row: any) => {
            return h('div', goodPoor.getSourceTypeNameByKey(row.channelSource))
        }
    })
    )
    columns.value.push({
        label: '赔付金额',
        align: 'center',
        width: '100px',
        prop: 'afterSaleRetailPrice'
    })
    columns.value.push({
        label: '赔付状态',
        align: 'center',
        prop: 'status',
        render: (row: any) => {
            return h('div', order_enum.getAfter_order_statesTitle(row.status))
        }
    })
    columns.value.push({
        label: '赔付类型',
        align: 'center',
        width: '100px',
        prop: 'afterSaleType',
        render: (row: any) => {
            return h('div', order_enum.getAfterSalesPfTypeTitle(row.afterSaleType))
        }
    })
    //顶级机构
    if (getSystemOptionType.value == '101') {
        columns.value.push({
            label: '分支机构',
            align: 'center',
            width: '160px',
            prop: 'orgName'
        })
        columns.value.push({
            label: '应用名称',
            align: 'center',
            width: '160px',
            prop: 'appName'
        })
    }
    //分支机构
    if (getSystemOptionType.value == '201') {
        columns.value.push({
            label: '应用名称',
            align: 'center',
            width: '160px',
            prop: 'appName'
        })
    }
    if (['10', '101', '20', '201'].includes(getSystemOptionType.value)) {
        columns.value.push({
            label: '项目类型',
            align: 'center',
            width: '160px',
            prop: 'projectType',
            render: (row: any) => {
                let projectTypeName = h('div', system_enum.getProjectType(row.projectType)) //订单状态
                //状态显示
                return h('div', {}, [projectTypeName])
            }
        })
    }
    columns.value.push({
        label: '操作',
        align: 'center',
        width: '160px',
        render: (row: any) => {
            //撤销
            const revocationButton = row.compensateConfirmStatus == 1 &&
                withDirectives(
                    h(ElButton, {
                        type: 'text',
                        innerText: '确认已到账',
                        onClick: () => {
                            confirmReceiptHandler(row)
                        }
                    }),
                    [
                        [
                            authDir,
                            {
                                authKey: 'ORDER_QRDZ_PF',
                                detail: row
                            }
                        ]
                    ]
                )
            //详情
            const detailButton = h(ElButton, {
                type: 'text',
                innerText: '详情',
                onClick: () => {
                    toDetailHandler(row)
                }
            })
            const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
            return h('div', { style }, [revocationButton, detailButton])
        }
    })
}
</script>

<template>
    <PageContainer v-loading="dataPage.loadingData">
        <SearchForm v-model:model="dataPage.facade" v-model:current-page="dataPage.page.page" class="el-search-item"
            @search="searchQueryHarder">
            <el-form-item label="赔付类型" class="formItem">
                <el-select v-model="dataPage.facade.afterSaleTypeList" multiple placeholder="请选择赔付类型" clearable>
                    <el-option label="运费赔付" value="11"></el-option>
                    <el-option label="品质赔付" value="12"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="赔付状态" class="formItem">
                <SelectModel v-model.trim="dataPage.facade.statusList" placeholder="请选择赔付状态" :multiple="true"
                    :selectList="order_enum.after_order_states"></SelectModel>
            </el-form-item>
            <el-form-item label="申请时间" class="el-form-item-inputGroup">
                <DatePickerRange v-model:start="dataPage.facade.applyTimeStart"
                    v-model:end="dataPage.facade.applyTimeEnd">
                </DatePickerRange>
            </el-form-item>
            <el-form-item label="订单编号" class="formItem" placeholder="请选择">
                <el-input v-model.trim="dataPage.facade.orderNo" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <el-form-item label="供应商赔付单编号" class="formItem" placeholder="请选择">
                <el-input v-model.trim="dataPage.facade.channelAfterSaleNo" placeholder="请输入供应商赔付单编号"></el-input>
            </el-form-item>
            <el-form-item label="赔付单编号" class="formItem" placeholder="请选择">
                <el-input v-model.trim="dataPage.facade.afterSaleNo" placeholder="请输入赔付单编号"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" class="formItem" placeholder="请选择">
                <el-input v-model.trim="dataPage.facade.skuName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品编码" class="formItem" placeholder="请选择">
                <el-input v-model.trim="dataPage.facade.skuCode" placeholder="请输入商品编码"></el-input>
            </el-form-item>
            <el-form-item v-if="['101'].includes(getSystemOptionType)" label="分支机构" class="formItem" placeholder="请选择">
                <OrgSelect v-model.trim="dataPage.facade.orgIdList" :multiple="true"></OrgSelect>
            </el-form-item>
            <el-form-item v-if="['101', '201'].includes(getSystemOptionType)" label="应用名称" class="formItem"
                placeholder="请选择">
                <ApplicationSelect v-model.trim="dataPage.facade.appIdList" :multiple="true" valueKey="id">
                </ApplicationSelect>
            </el-form-item>
            <el-form-item v-if="['201', '101'].includes(getSystemOptionType)" label="项目类型" class="formItem"
                placeholder="请选择">
                <SelectModel v-model.trim="dataPage.facade.projectTypeList" :selectList="system_enum.projectType">
                </SelectModel>
            </el-form-item>
        </SearchForm>
        <OrderCustomTable class="order-container" :openERP="false" :openFold="false" :border="true" :dataPage="dataPage"
            :dataList="dataPage.dataList" :columns="columns">
            <template #option>
                <el-button authKey="VO_AFTERWORD_EXPORT" type="primary" @click="exportHandler"
                    :loading="dataPage.loadingExport">导出</el-button>
            </template>
            <template #customRow="{ row }">
                <div class="order_row">
                    <div class="order_detail">
                        <span>订单编号:{{ row.orderNo }}</span>
                        <span>供应商赔付单编号:{{ row.channelAfterSaleNo }}</span>
                        <span>赔付单编号:{{ row.afterSaleNo }}</span>
                        <span>申请时间:{{ row.applyTime }}</span>
                    </div>
                </div>
            </template>
        </OrderCustomTable>
        <CustomPagination @pagingQuery="pagingQueryHarder" :page="dataPage.page"></CustomPagination>
    </PageContainer>
    <ConfirmReceiptModel v-model="dataPage.showConfirmReceiptModel" :curryInfo="dataPage.curryInfo">
    </ConfirmReceiptModel>
</template>

<style lang='scss' scoped>
.tabs-container {
    background-color: var(--el-bg-color);
    padding: 8px;

    ::v-deep(.el-tabs) {
        .el-tabs__header {
            margin-bottom: 0;
        }
    }
}

.order-container {
    .order_row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .order_detail {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            gap: 100px;
            color: #999;

            .thirdOrderNo {
                width: 280px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>