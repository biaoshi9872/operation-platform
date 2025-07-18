<script setup lang="ts">
interface IProp {
    row: any,
    prop: string,
    type: string
}
const props = withDefaults(defineProps<IProp>(), {
    row: {},
    prop: '',
    type: 'string'
})

const clickEditHandler = () => {
    props.row[props.prop + 'edit'] = true
}
const blurHandler = () => {
    props.row[props.prop + 'edit'] = false
}
const changeValue = () => {
    props.row[props.prop + 'edit'] = false
}
const typeList = ref([
    {
        label: 'string',
        value: 'string'
    },
    {
        label: 'object',
        value: 'object'
    },
    {
        label: 'array',
        value: 'array'
    },
    {
        label: 'number',
        value: 'number'
    },
    {
        label: 'boolean',
        value: 'boolean'
    }, {
        label: 'date',
        value: 'date'
    },
    {
        label: 'datetime',
        value: 'datetime'
    },
    {
        label: 'file',
        value: 'file'
    }
])
const columnRequiredList = ref([
    {
        label: '是',
        value: true
    },
    {
        label: '否',
        value: false
    }
])
//下拉编辑
const selectList = computed(() => {
    switch (props.prop) {
        case 'columnType':
            return typeList.value
        case 'columnRequired':
            return columnRequiredList.value
    }
})

</script>
<template>
    <span v-if="!row[props.prop + 'edit']" @click="clickEditHandler">
        {{ row[prop] }}
    </span>
    <span v-else>
        <el-input v-if="type === 'string'" v-model="row[prop]" class="w-[100px]" type="" maxlength="100" show-word-limit
            @blur="blurHandler"></el-input>
        <el-select v-else-if="type === 'select'" v-model="row[prop]" placeholder="请选择" @change="changeValue">
            <el-option v-for="item in selectList" :label="item.label" :value="item.value" />
        </el-select>
    </span>
</template>
<style lang="scss" scoped></style>