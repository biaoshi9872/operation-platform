<script setup lang="ts">
defineOptions({
    name: 'MoreTag'
})
const props = defineProps({
    list: {
        type: String,
        default: ''
    },
    titleKey: {
        type: String,
        default: ''
    },
    maxCount: {
        type: Number,
        default: 3
    }
})
const listData = computed(() => {
    let arr: any = []
    if (Array.isArray(props.list)) {
        arr = props.list
    } else {
        arr = props.list?.split(',') || []
    }
    return arr
})
const showList = computed(() => {
    return listData.value.slice(0, props.maxCount)
})
const isShowMore = computed(() => {
    return listData.value.length > props.maxCount
})
</script>
<template>
    <div class="tag-list">
        <el-tag v-for="item in showList" :key="item" type="primary">
            {{ item[props.titleKey] || item }}
        </el-tag>
        <el-tooltip v-if="isShowMore" :content="listData.map((item: any) => item[props.titleKey] || item).join(',')"
            placement="top">
            <el-tag v-if="isShowMore" type="info">
                +{{ listData.length - showList.length }}
            </el-tag>
        </el-tooltip>
    </div>
</template>

<style lang="scss" scoped>
.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}
</style>
