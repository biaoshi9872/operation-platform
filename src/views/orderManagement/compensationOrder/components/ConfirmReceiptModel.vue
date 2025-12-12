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
        remarks: '',
        reasonImages: ''
    },
    formDataBK: {},
    formRules: {
        reasonImages: [{ required: true, message: '请上传凭证', trigger: ['change', 'blur'] }],
    },
    tableFromData: {},
    submitLoading: false,
})
const verifyHandler = () => {
    formRef.value?.validateField('reasonImages')
}
const handleReset = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('update:modelValue', false)
}
const handleClose = () => {
    handleReset()
    emits('update:modelValue', false)
}
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
    <el-dialog v-bind="$attrs" title="确认已到账" class="dialog-m" append-to-body @open="openHandler" draggable
        destroy-on-close :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="data.formData.remarks" placeholder="请输入备注" :rows="3"
                        maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="上传凭证" prop="reasonImages">
                    <ImgUpload :limit="5" :maxSize="5" v-model="data.formData.reasonImages" :isArray="false"
                        @verify="verifyHandler" :acceptList="['bmp', 'png', 'jpg', 'jpeg']"></ImgUpload>
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