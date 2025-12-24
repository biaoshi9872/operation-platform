<script setup lang="ts">
defineOptions({
    name: 'PackageAttributeModel'
})
const props = defineProps({
    couponList: {
        type: Array as PropType<String[]>,
        default: () => ([])
    }
})

</script>
<template>
    <div class="package-attribute-model">
        <div v-for="item in couponList" :key="item">
            {{ item }}
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
