<script setup lang="ts">
import supplier_api from '@/api/supplier';
import application_api from '@/api/system/application';
import { hasNumberAndWord, validatePhone } from '@/utils/validator';
import { ElMessage, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';
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

function passwordValidator(rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error('请输入登录密码'))
    } else if (!hasNumberAndWord.test(value)) {
        callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
    } else {
        if (data.formData.rePassword !== '') {
            formRef.value.validateField('rePassword')
        }
        callback()
    }
}
function rePasswordValidator(rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error('请再次输入登录密码'))
    } else if (!hasNumberAndWord.test(value)) {
        callback(new Error('密码必须包含字母加数字，且处于6-20位之间!'))
    } else if (String(value) !== data.formData.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

const formRef = ref<FormInstance>() as any
interface IData {
    formData: any,
    formDataBK: any,
    formRules: any,
    supplerList: any,
    applicationList: any,
    submitLoading: boolean,
}
const data = reactive<IData>({
    formData: {
        orgId: '',
        supplierId: '',
        username: '',
        contractName: '',
        contractTel: '',
        accountValidStart: '',
        accountValidEnd: '',
        enableEnum: 1,
        password: '',
        rePassword: '',
        application: ''
    },
    formDataBK: {},
    formRules: {
        orgId: [{ required: true, message: '请选择所属分支机构', trigger: 'change' }],
        supplierId: [{ required: true, message: '请选择所属供应商', trigger: 'change' }],
        username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
        contractName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contractTel: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { validator: passwordValidator, trigger: 'blur' },
            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ],
        rePassword: [
            { required: true, message: '请再次输入登录密码', trigger: 'blur' },
            { validator: rePasswordValidator, trigger: 'blur' },
            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ],
        accountValidStart: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        accountValidEnd: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        application: [{ required: true, message: '请选择可用应用', trigger: 'change' }],
        enableEnum: [{ required: true, message: '请选择用户状态', trigger: 'change' }]
    },
    applicationList: [],
    supplerList: [],
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
    if (!isAdd.value) {
        data.formData = {
            ...data.formData,
            ...props.curryInfo,
            enableEnum: props.curryInfo.status,
            supplierId: props.curryInfo.supplyId,
        }
    }
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
        data.submitLoading = true
        const userId = props?.curryInfo?.userId
        supplier_api.A_addOrUpdate({ ...data.formData, userId }).then(() => {
            handleClose()
            ElMessage.success('操作成功！')
        }).finally(() => {
            data.submitLoading = false
        })
    })
}

onMounted(() => {
    getApplicationList()
})


watch(() => data.formData.orgId, (val) => {
    if (val) {
        getSupplierList()
    }
})

const changeHandler = () => {
    data.formData.supplierId = ''
}
const getSupplierList = () => {
    const orgId = data.formData.orgId
    supplier_api.A_supplierManageGetByOrgId({ orgId }).then((res) => {
        data.supplerList = res
    })
}
const getApplicationList = () => {
    application_api.A_list({}).then((res) => {
        data.applicationList = res
    })
}

const title = computed(() => {
    return props.curryInfo?.userId ? '编辑供应商账号' : '新增供应商账号'
})
const isAdd = computed(() => {
    return props.curryInfo?.userId ? false : true
})

</script>
<template>
    <el-dialog v-bind="$attrs" :title="title" width="500px" append-to-body @open="openHandler" draggable
        destroy-on-close :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="120px">
                <el-form-item label="所属分支机构" prop="orgId">
                    <OrgSelect v-model="data.formData.orgId" @change="changeHandler"></OrgSelect>
                </el-form-item>
                <el-form-item label="所属供应商" prop="supplierId">
                    <el-select v-model="data.formData.supplierId" placeholder="请选择供应商">
                        <el-option v-for="item in data.supplerList" :key="item.supplyId" :label="item.supplyName"
                            :value="item.supplyId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管理员账号" prop="username">
                    <el-input v-model="data.formData.username" maxlength="50" placeholder="请输入管理员账号" />
                </el-form-item>
                <el-form-item label="联系人" prop="contractName">
                    <el-input v-model="data.formData.contractName" maxlength="50" placeholder="请输入联系人" />
                </el-form-item>
                <el-form-item label="手机号" prop="contractTel">
                    <el-input v-model="data.formData.contractTel" maxlength="11" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item v-if="isAdd" label="登录密码" prop="password">
                    <el-input v-model.trim="data.formData.password" maxlength="50" class="w-300"
                        placeholder="请输入6位数以上字母+数字密码" clearable />
                </el-form-item>
                <el-form-item v-if="isAdd" label="确认密码" prop="rePassword">
                    <el-input v-model.trim="data.formData.rePassword" maxlength="50" class="w-300"
                        placeholder="请输入6位数以上字母+数字密码" clearable />
                </el-form-item>
                <el-form-item label="账号有效期" prop="accountValidStart">
                    <DatePickerRange v-model:start="data.formData.accountValidStart"
                        v-model:end="data.formData.accountValidEnd">
                    </DatePickerRange>
                </el-form-item>
                <el-form-item label="用户状态" prop="enableEnum">
                    <el-radio-group v-model="data.formData.enableEnum">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
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
