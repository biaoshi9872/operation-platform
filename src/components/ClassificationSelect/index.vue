<script setup lang="ts">
defineOptions({
    name: 'ClassificationSelect'
})
import systemUtils_api from '@/api/system/systemUtils'
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:modelValue', 'change'])
const options = {
    value: 'id',
    label: 'name',
    children: 'children'
}
const value = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
const handleChange = (val: any) => {
    console.log(val)
    emit('change', val)
}
const dataInfo = reactive({
    categoryList: []
})


onMounted(() => {
    systemUtils_api.A_category({}).then(res => {
        dataInfo.categoryList = res.categoryList
    })
})
</script>

<template>
    <el-cascader v-bind="$attrs" v-model="value" :options="options" @change="handleChange" />
</template>


<style lang="scss" scoped></style>
