<!--
 * @Descripttion: 所属供应商组件--多页面复用 
 * @version: 
 * @Author: biao.shi
 * @Date: 2023-03-28 17:09:15
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-03-28 17:11:47
-->
<script setup lang="ts">
defineOptions({
    name: 'ApplicationSelect'
})
import application_api from '@/api/system/application/index'
interface IProp {
    modelValue: string
    modelName: string
    multiple: boolean
    valueKey: string
    valueLabel: string
}
const props = withDefaults(defineProps<IProp>(), {
    modelValue: '',
    modelName: '',
    multiple: true,
    valueKey: 'appCode',
    valueLabel: 'appName',
    supplyType: '1'
})

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'update:modelName', value: any): void
    (e: 'change', value: any): void
}>()

const value = computed({
    get() {
        if (props.multiple) {
            return props.modelValue || []
        } else return props.modelValue || null
    },
    set(val: any) {
        emits('update:modelValue', val)
        let name = data.branchList.find((item: any) => item[props.valueKey] == val)?.[props.valueLabel] || ''
        emits('update:modelName', name)
    }
})

const data = reactive({
    branchList: [] as any
})

onMounted(() => {
    init()
})

const init = () => {
    getAllDictionaries()
}

const getAllDictionaries = () => {
    application_api.A_getZjnxBankMap().then((res: any) => {
        let arr = Object.keys(res || {})
        data.branchList = arr.map((item: any) => {
            return {
                [props.valueKey]: Number(item),
                [props.valueLabel]: res[item]
            }
        })
    })
}
const changeHandler = (value: any) => {
    emits('change', value)
}
</script>
<template>
    <el-select v-model="value" placeholder="请选择分行名称" filterable clearable :multiple="props.multiple"
        :collapse-tags="props.multiple" :collapse-tags-tooltip="props.multiple" @change="changeHandler">
        <el-option v-for="(item, index) in data.branchList" :key="index" :value="item[props.valueKey]"
            :label="item[props.valueLabel]"></el-option>
    </el-select>
</template>

<style lang="scss" scoped></style>
