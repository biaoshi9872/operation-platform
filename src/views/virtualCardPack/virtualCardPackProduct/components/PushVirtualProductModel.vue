<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
interface IProp {
    curryInfo: any,
    type: string
    isBatch: boolean
    mulSelect: any
}
const props = withDefaults(defineProps<IProp>(), {
    curryInfo: {},
    type: '',
    isBatch: false,
    mulSelect: []
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
interface IData {
    packageAppList: any,
    selectedPackageAppList: any,
    defaultCheckedKeys: any,
    submitLoading: boolean,
}
const data = reactive<IData>({
    packageAppList: [],
    selectedPackageAppList: [],
    defaultCheckedKeys: [],
    submitLoading: false,
})
const allTree = ref<InstanceType<typeof ElTree>>()
const handleReset = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('update:modelValue', false)
}
const defaultProps = {
    children: 'children',
    disabled: 'disabled',
    label: 'label',
}
const handleCheck = () => {
    const keys = allTree.value?.getCheckedKeys() || []
    const halfKeys = allTree.value?.getHalfCheckedKeys() || []
    data.selectedPackageAppList = [...keys, ...halfKeys]
}
const handleClose = () => {
    handleReset()
    emits('update:modelValue', false)
}

const openHandler = () => {
    getPackageApp()
}
type IResultItem = {
    appId: number,
    appName: string,
    successCount: number,
    failCount: number,
    totalCount: number,
}
const resData = reactive({
    showResult: false,
    openTag: false,
    showResultDetail: false,
    resultDetailList: [],
    resultList: [] as IResultItem[],
})
const getItemClass = (item: IResultItem) => {
    if (item.failCount === 0) return 'success'
    if (item.successCount === 0) return 'fail'
    return 'partial'
}
const handleSubmit = () => {
    let selectedPackageAppList = data.selectedPackageAppList.filter((item: any) => {
        return !String(item).startsWith('ORG')
    })
    if (props.isBatch) {
        virtualCardPackProduct_api.A_push({
            appIds: selectedPackageAppList,
            packageCodes: props.isBatch ? props.mulSelect.map((item: any) => item.packageCode) : [props.curryInfo.packageCode]
        }).then((res: any) => {
            ElMessage.success('批量推送成功')
            emits('refresh')
            handleClose()
            resData.showResult = true
            resData.resultList = res
        })
    } else {
        virtualCardPackProduct_api.A_singPush({
            appIds: selectedPackageAppList,
            packageCode: props.curryInfo.packageCode
        }).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            handleClose()
        })
    }
}
const title = computed(() => {
    if (props.type === 'push') {
        return props.isBatch ? '批量推送' : '推送'
    } else {
        return props.isBatch ? '批量取消推送' : '取消推送'
    }
})
const getPackageApp = async () => {
    const res = await virtualCardPackProduct_api.A_getPackageApp()
    data.packageAppList = res
    data.defaultCheckedKeys = []

    if (!props.isBatch && props.curryInfo.appNameList) {
        data.defaultCheckedKeys = props.curryInfo.appNameList?.map((item: any) => item.appId) || []
        data.selectedPackageAppList = [...data.defaultCheckedKeys]
    }
}
const getResultDetailList = () => {
    resData.openTag = true
    virtualCardPackProduct_api.A_pushFailReason({
    }).then((res: any) => {
        resData.showResultDetail = true
        resData.resultDetailList = res
    }).finally(() => {
        resData.openTag = false
    })
}

</script>
<template>
    <el-dialog v-bind="$attrs" :title="'选择' + title + '应用'" class="dialog-m" append-to-body @open="openHandler"
        draggable destroy-on-close :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-tree style="max-width: 600px" ref="allTree" default-expand-all :data="data.packageAppList"
                :default-checked-keys="data.defaultCheckedKeys" show-checkbox node-key="value" @check="handleCheck"
                :props="defaultProps" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认推送</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="resData.showResult" :title="title + '结果详情'" class="dialog-m" append-to-body draggable
        destroy-on-close :close-on-click-modal="false" @closed="resData.showResult = false">
        <div class="result-container">
            <div class="item" :class="getItemClass(item)" v-for="item in resData.resultList">
                <span>{{ item.appName }}:</span>
                <span class="info">本次共选择推送{{ item.totalCount }}个商品</span>
                <span>成功<span class="success">{{ item.successCount }}</span>条信息</span>
                <span>失败<span class="fail">{{ item.failCount }}</span>条信息</span>
            </div>
        </div>
        <template #footer>
            <el-button @click="resData.showResult = false" class="mr-10">关闭</el-button>
            <el-button @click="getResultDetailList" :loading="resData.openTag" type="primary">查看失败详情</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="resData.showResultDetail" title="失败详情" class="dialog-l" append-to-body draggable
        destroy-on-close :close-on-click-modal="false" @closed="resData.showResultDetail = false">
        <div>
            <el-table :data="resData.resultDetailList" style="width: 100%" max-height="500px">
                <el-table-column type="index" label="序号" width="100" />
                <el-table-column prop="packageName" label="商品信息" />
                <el-table-column prop="packageCode" label="商品编码" />
                <el-table-column prop="appName" label="推送渠道" />
                <el-table-column prop="failReason" label="失败原因" />
            </el-table>
        </div>
        <template #footer>
            <el-button @click="resData.showResultDetail = false" class="mr-10">关闭</el-button>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped>
.result-container {
    padding: 20px;
    max-height: 500px;
    overflow: auto;
}

.item {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    background: #f5f7fa;
    border-left: 4px solid #dcdfe6;
    color: #606266;

    .success {
        color: #67c23a;
    }

    .fail {
        color: #f56c6c;
    }
}

.item:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.item.success {
    background: #f0f9eb;
    border-left-color: #67c23a;
    color: #1f2d3d;
}

.item.fail {
    background: #fde2e2;
    border-left-color: #f56c6c;
    color: #1f2d3d;
}

.item.partial {
    background: #fdf6ec;
    border-left-color: #e6a23c;
    color: #1f2d3d;
}
</style>
