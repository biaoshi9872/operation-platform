<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import virtualCardPackProduct_enum from '@/utils/constant/virtualCardPackProduct'
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
    dialogVisible: boolean,
    submitLoading: boolean,
}
const data = reactive<IData>({
    packageAppList: [],
    selectedPackageAppList: [],
    defaultCheckedKeys: [],

    dialogVisible: false,
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
const handleSubmit = () => {
    let selectedPackageAppList = data.selectedPackageAppList.filter((item: any) => {
        return !String(item).startsWith('ORG')
    })
    if (props.isBatch) {
        virtualCardPackProduct_api.A_push({
            appIds: selectedPackageAppList,
            packageCodes: props.isBatch ? props.mulSelect.map((item: any) => item.packageCode) : [props.curryInfo.packageCode]
        }).then(() => {
            ElMessage.success(title.value + '成功')
            emits('refresh')
            handleClose()
        })
    } else {
        virtualCardPackProduct_api.A_singPush({
            appIds: selectedPackageAppList,
            packageCode: props.curryInfo.packageCode
        }).then(() => {
            ElMessage.success(title.value + '成功')
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
        data.defaultCheckedKeys = props.curryInfo.appNameList?.map(item => item.appId) || []
        data.selectedPackageAppList = [...data.defaultCheckedKeys]
    }
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
    <el-dialog v-model="data.dialogVisible" :title="title + '结果详情'" class="dialog-m" append-to-body draggable
        destroy-on-close :close-on-click-modal="false" @closed="data.dialogVisible = false">
        <div class="result-container">" >
            <div class="dialog-body-title" v-for="value in 10">
                <span>API开放平台:</span>
                <span>本次共选择推送1个商品</span>
                <span>成功1条信息</span>
                <span>失败0条信息</span>
            </div>
        </div>
        <template #footer>
            <el-button @click="data.dialogVisible = false" class="mr-10">关闭</el-button>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped>
.result-container {
    padding: 20px;
}
</style>
