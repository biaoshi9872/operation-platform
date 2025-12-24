<script setup lang="ts">
defineOptions({
    name: 'ClassificationSelect'
})
import systemUtils_api from '@/api/system/systemUtils'
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    categoryCode: {
        type: String,
        default: ''
    },
    firstCateId: {
        type: String,
        default: ''
    },
    secondCateId: {
        type: String,
        default: ''
    },
    thirdCateId: {
        type: String,
        default: ''
    },
    source: {
        type: String,
        default: ''
    },
    filedCategory: {
        type: String,
        default: 'categoryList'
    }
})
const emit = defineEmits(['update:modelValue', 'change', 'update:firstCateId', 'update:secondCateId', 'update:thirdCateId', 'update:categoryCode'])
const value = computed({
    get() {
        if (props.categoryCode) {
            return props.categoryCode.split('|')
        }
        return [props.firstCateId, props.secondCateId, props.thirdCateId]
    },
    set(val) {
        let valArr = val || []
        emit('update:firstCateId', valArr[0])
        emit('update:secondCateId', valArr[1])
        emit('update:thirdCateId', valArr[2])
        emit('update:modelValue', valArr)
        emit('update:categoryCode', valArr.join('|'))
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
    systemUtils_api.A_category({
        source: props.source
    }).then(res => {
        dataInfo.categoryList = res[props.filedCategory] || res || []

    })
})
</script>

<template>
    <el-cascader v-bind="$attrs" v-model="value" :options="dataInfo.categoryList" @change="handleChange" />
</template>

<style lang="scss" scoped></style>
