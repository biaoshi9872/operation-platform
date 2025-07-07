<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
interface IProp {
    curryInfo: any,
}
const props = withDefaults(defineProps<IProp>(), {
    curryInfo: {}
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
interface IData {
    formData: any,
    formDataBK: any,
    formRules: any,
    tableFromData: any,
    submitLoading: boolean,
}
const data = reactive<IData>({
    formData: {
        stockNum: ''
    },
    formDataBK: {},
    formRules: {
        stockNum: [{ required: true, message: '请输入商品数量', trigger: ['change', 'blur'] }],
    },
    tableFromData: {},
    submitLoading: false,
})
const handleReset = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('update:modelValue', false)
}
const handleClose = () => {
    handleReset()
    emits('refresh')
    searchQueryHandler()
    emits('update:modelValue', false)
}
const searchQueryHandler = inject('searchQueryHandler', () => { })
onMounted(() => {
    data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
    data.formData = {
        ...data.formDataBK
    }
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
    })
}
</script>
<template>
    <el-dialog v-bind="$attrs" title="API设置" width="500px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="层级">
                    <el-select v-model="data.formData.stockNum" placeholder="请选择">
                        <el-option label="一级" value="1" />
                        <el-option label="二级" value="2" />
                        <el-option label="三级" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接口">
                    <el-input v-model="data.formData.stockNum" placeholder="请输入" maxlength="200" show-word-limit />
                </el-form-item>
                <el-form-item label="接口名称">
                    <el-input v-model="data.formData.stockNum" placeholder="请输入" maxlength="200" show-word-limit />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="data.formData.stockNum">
                        <el-radio value="0">禁用</el-radio>
                        <el-radio value="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="data.formData.sort" placeholder="请输入" controls-position="right"
                        precision="0" step="1" min="0" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="data.formData.stockNum" type="textarea" placeholder="请输入" maxlength="500"
                        show-word-limit />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped></style>