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
const data = reactive<any>({
    formData: {
        stockNum: ''
    },
    formDataBK: {},
    formRules: {
        stockNum: [{ required: true, message: '请输入商品数量', trigger: ['change', 'blur'] }],
    },
    facade: {},
    page: {
        page: 1,
        limit: 10,
        totalCount: 0
    },
    tableFromData: [],
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
const searchQueryHarder = () => {

}
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
    <el-dialog v-bind="$attrs" title="商品选择" width="1400px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleReset">
        <div class="option">
            <SearchForm v-model:model="data.facade" v-model:current-page="data.page.page" class="el-search-item"
                @search="searchQueryHarder">
                <el-form-item label="产品属性" prop="stockNum">
                    <el-select v-model="data.formData.stockNum" placeholder="请选择">
                        <el-option label="普通商品" value="1"></el-option>
                        <el-option label="积分商品" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品编码" prop="stockNum">
                    <el-input v-model="data.formData.stockNum" placeholder="请输入商品编码"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="stockNum">
                    <el-input v-model="data.formData.stockNum" placeholder="请输入商品名称"></el-input>
                </el-form-item>
            </SearchForm>
            <div class="content">
                <div class="content-table-left">
                    <h3 class="mb-8 color-red">您已选择5个商品</h3>
                    <el-table :data="data.tableFromData" border>
                        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                        <el-table-column label="商品编码" prop="goodsCode"></el-table-column>
                        <el-table-column label="面值" prop="goodsSpecification"></el-table-column>
                        <el-table-column label="平台成本" prop="goodsSpecification"></el-table-column>
                        <el-table-column label="库存" prop="goodsSpecification"></el-table-column>
                        <el-table-column label="有效期" prop="goodsSpecification"></el-table-column>
                        <el-table-column label="产品属性" prop="goodsSpecification"></el-table-column>
                    </el-table>
                </div>
                <div class="content-table-right">
                    <h3 class="mb-8">已选商品列表</h3>
                    <el-table :data="data.tableFromData" border>
                        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
                        <el-table-column label="商品编码" prop="goodsCode"></el-table-column>
                        <el-table-column label="平台成本" prop="goodsSpecification"></el-table-column>
                        <el-table-column label="库存" prop="goodsSpecification"></el-table-column>
                        <el-table-column label="操作" prop="goodsSpecification">
                            <template #default="scope">
                                <el-button type="primary" link>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认选择</el-button>
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