<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pick } from 'lodash-es'
import { A_saveCateInfo, A_getCateGoryInfoByLevel, A_getCateInfoDetail } from '@/api/productCategory'

interface FormData {
    id?: number
    level: 1 | 2 | 3 | ''
    categoryName: string
    parentCode?: string
    categoryCode?: ''
    categoryPicUrl: string[]
    stateEnum?: 1 | 2
    sort?: number
    remarks?: string
}

defineOptions({ name: 'ProductModal' })

const emits = defineEmits(['update:modelValue', 'update'])

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})

const validateRemarks = (rule: any, value: any, callback: any) => {
    if (value && value.length > 200) {
        callback(new Error('最大限制200个字符'))
    } else {
        callback()
    }
}

const formRef = ref<FormInstance>()

const loading = ref(false)
const submitLoading = ref(false)

const levelList = ref<API.GetCateGoryInfoByLevelData[]>([])
const formData = reactive<FormData>({
    id: undefined,
    level: '',
    categoryName: '',
    parentCode: '',
    categoryCode: '',
    categoryPicUrl: [],
    stateEnum: undefined,
    sort: undefined,
    remarks: ''
})

const flag = ref(false) //是否关联
const backendCategoryName = ref('') //关联的类目编辑时暂存的的类目名

const rules = reactive<FormRules>({
    level: [{ required: true, message: '请选择类目层级', trigger: 'change' }],
    parentCode: [{ required: true, message: '请选择父级类目', trigger: 'change' }],
    categoryName: [{ required: true, message: '请输入类目名称', trigger: 'blur' }],
    categoryCode: [{ required: true, message: '请输入类目编号', trigger: 'blur' }],
    categoryPicUrl: [{ required: true, message: '请上传类目图片', trigger: 'change' }],
    stateEnum: [{ required: true, message: '请选择状态', trigger: 'change' }],
    sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    remarks: [{ validator: validateRemarks, trigger: 'blur' }]
})

function handleOpen() {
    if (props.id) {
        getCateInfoDetail(props.id)
    }
}

function handleClose() {
    emits('update:modelValue', false)
}

async function getCateInfoDetail(id: number) {
    try {
        loading.value = true
        const res = await A_getCateInfoDetail({ id })
        backendCategoryName.value = res.categoryName
        flag.value = res.flag
        const obj = pick(res, Object.keys(formData))
        obj.categoryPicUrl = obj.categoryPicUrl ? obj.categoryPicUrl.split(',') : []
        Object.assign(formData, obj)
    } finally {
        loading.value = false
    }
}

async function fetchLevelList(level: number) {
    levelList.value = await A_getCateGoryInfoByLevel({ level })
}

function onLevelChange(val: 1 | 2 | 3) {
    formData.parentCode = undefined
    if (val === 1) {
        return
    }
    fetchLevelList(val - 1)
}

function handleSubmit() {
    const { id, categoryName } = formData
    if (flag.value && id && categoryName !== backendCategoryName.value) {
        ElMessageBox.confirm('该类目已有关联的商品，修改类目名称将会影响商品展示，请确认是否修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                saveCateInfo()
            })
            .catch(() => { })
    } else {
        saveCateInfo()
    }
}

async function saveCateInfo() {
    try {
        await formRef.value?.validate()
        const { id, categoryCode, categoryPicUrl, parentCode, ...restFrom } = formData
        const payload: API.SaveCateInfoParams = {
            ...restFrom,
            categoryPicUrl: categoryPicUrl.join()
        }
        id && (payload.id = id)
        parentCode && (payload.parentCode = parentCode)
        submitLoading.value = true
        await A_saveCateInfo(payload)
        ElMessage({
            message: `${!!props.id ? '编辑' : '新增'}成功`,
            type: 'success'
        })
        handleClose()
        emits('update')
    } finally {
        submitLoading.value = false
    }
}

function handleReset() {
    if (formRef) {
        formRef.value?.resetFields()
        Object.assign(formData, {
            id: undefined,
            level: '',
            categoryName: '',
            parentCode: '',
            categoryCode: '',
            categoryPicUrl: [],
            stateEnum: undefined,
            sort: undefined,
            remarks: ''
        })
        backendCategoryName.value = ''
        flag.value = false
    }
    emits('update:modelValue', false)
}
</script>

<template>
    <el-dialog v-bind="$attrs" :title="`${!!props.id ? '编辑' : '新增'}类目`" destroy-on-close :close-on-click-modal="false"
        width="520" draggable @open="handleOpen" @closed="handleReset">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-suffix="："
            v-loading="loading">
            <el-form-item label="类目层级" prop="level">
                <el-select v-model="formData.level" filterable clearable placeholder="请选择类目层级" @change="onLevelChange"
                    :disabled="!!props.id">
                    <el-option :key="1" label="一级分类" :value="1" />
                    <el-option :key="2" label="二级分类" :value="2" />
                    <el-option :key="3" label="三级分类" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="父级类目" prop="parentCode" v-if="![1, ''].includes(formData.level)">
                <el-select v-model="formData.parentCode" filterable clearable placeholder="请选择父级类目层级"
                    :disabled="!!props.id">
                    <el-option v-for="item in levelList" :key="item.id" :label="item.categoryName"
                        :value="item.categoryCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="类目名称" prop="categoryName">
                <el-input v-model.trim="formData.categoryName" placeholder="请输入类目名称" maxlength="10" show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item label="类目编号" prop="categoryCode" v-if="props.id">
                <el-input v-model="formData.categoryCode" :disabled="!!props.id" clearable />
            </el-form-item>
            <el-form-item label="类目图片" prop="categoryPicUrl">
                <ImgUpload v-model="formData.categoryPicUrl" :limit="1" :maxSize="1 * 1024"
                    tip="提示：请保证图片清晰可见，图片大小不超过1M，尺寸为100x100px，格式为png、jpg、jpeg" :acceptList="['png', 'jpg', 'jpeg']" />
            </el-form-item>
            <el-form-item label="状态" prop="stateEnum">
                <el-radio-group v-model="formData.stateEnum">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="2">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="formData.sort" :precision="0" :min="1" placeholder="输入整数，数字越小越靠前" :max="9999"
                    :controls="false" />
                <div class="lh-21 c-#606266">（仅与相同根目录下等同级分类排序）</div>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="formData.remarks" :rows="3" clearable maxlength="200" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="footer-wrap">
                <el-button @click="handleClose">取消</el-button>
                <el-button v-preventReClick="1500" :loading="submitLoading" type="primary"
                    @click="handleSubmit()">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
:deep(.el-input) {
    width: 248px;
}

:deep(.el-input-number) {
    width: 248px;

    .el-input__inner {
        text-align: left;
    }
}

:deep(.el-textarea) {
    width: 250px;
}

:deep(.el-upload__tip) {
    width: 270px;
}
</style>
