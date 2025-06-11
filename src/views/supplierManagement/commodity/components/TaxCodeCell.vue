<template>
    <div class="tax-code-container">
        <el-form-item label="发票类型" prop="invoiceType" required>
            <el-select v-model="form.invoiceType" @change="changeHandler">
                <el-option v-for="item in order_enum.C_invoiceTypeList" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="税率" prop="taxRate" required>
            <el-select v-model="form.taxRate">
                <el-option v-for="item in dataInfo.taxRateList" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="税收编码" prop="taxCode" required>
            <el-input v-model="form.taxCode" maxlength="19" show-word-limit />
        </el-form-item>
    </div>
</template>
<script setup lang="ts">
import order_enum from '@/utils/constant/order';
interface IProp {
    form: any
}
const props = withDefaults(defineProps<IProp>(), {
    form: {

    }
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()
const dataInfo = reactive({
    taxRateList: []
})
//发票类型
watch(() => props.form.invoiceType, (newVal) => {
    dataInfo.taxRateList = order_enum.getInvoiceListByType(newVal)
})
const changeHandler = () => {
    props.form.taxRate = null
}

</script>

<style lang="scss" scoped>
.tax-code-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    .el-form-item {
        width: 300px;
    }
}
</style>
