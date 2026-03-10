<script setup lang="ts">
defineOptions({ name: 'GoodTable' })
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import MyRender from './expand'
import { cloneDeep } from 'lodash-es'
interface IColumn {
    label: string
    prop: string
    width?: string
    minWidth?: string
    maxWidth?: string
    align?: 'left' | 'center' | 'right'
    marginAttr?: string
    openMarginCell?: boolean
    showOverflowTooltip?: boolean
    marginProp?: string
    marginLabel?: boolean
    colspan?: number
    marginLabelProp?: string
    render?: Function
    fixed?: 'left' | 'right',
    isErp?: boolean
    hidden?: boolean
    renderLabel?: Function
}

interface IProp {
    columns: Array<IColumn>
    dataList: Array<any>
    orderChildAttr: string
    useCustomRow: boolean
    openFoldingRow: boolean
    isCheck: boolean
    isErpAccount: boolean
    isChildCheck: boolean
    multipleList: Array<any>
    foldingLength: number
    moreTitle: string
}

const props = withDefaults(defineProps<IProp>(), {
    columns: [] as any,
    dataList: [] as any,
    multipleList: [] as any,
    orderChildAttr: '',
    openFoldingRow: true,
    foldingLength: 4,
    useCustomRow: true,
    isCheck: false,
    moreTitle: '商品规格',
    isChildCheck: false
})

const emits = defineEmits(['multipleHandler', 'update:multipleList'])

const columnList = computed(() => {
    return props.columns.filter((item: IColumn) => {
        //1.erp校验
        if (item.hasOwnProperty('isErp') && item.isErp) {
            return props.isErpAccount
        } else {  //2.非erp校验
            if (item.hasOwnProperty('hidden')) {
                return !item.hidden
            } else {
                return true
            }
        }
    })
})
/***
 * 合并单
 */
const manageTableColumns = computed(() => {
    return columnList.value.filter((item: IColumn) => {
        return item.marginLabel
    })
})

/**
 * 合并单列宽度
 */
const manageTableColumnsSpan = computed(() => {
    let arr: any = []
    columnList.value.forEach((item: IColumn) => {
        let obj = cloneDeep(item)
        obj.colspan = 1
        if (item.marginLabel) {
            let marginLabelProp = item.marginLabelProp
            //取第一个，第二不取
            let colspan = props.columns.filter((item1: IColumn) => {
                return item1.marginLabelProp === marginLabelProp
            }).length
            if (arr.filter((item1: any) => item1.marginLabelProp === marginLabelProp).length <= 0) {
                obj.colspan = colspan
                obj.align = 'center'
                obj.label = item.marginLabelProp || item.label
                arr.push(obj)
            }
        } else {
            arr.push(obj)
        }
    })
    return arr
})
//折叠展开
const handleFolding = (row: any, rowIndex: number) => {
    row.folding = !row.folding
}
const foldingRow = computed(() => {
    return function (row: any) {
        let arr = props.orderChildAttr ? row[props.orderChildAttr] : [row]
        if (!row.folding) {
            return arr?.slice(0, props.foldingLength)
        } else {
            return arr
        }
    }
})

/**
 * 全选逻辑
 */
const checkInfo = reactive({
    allChecked: false,
})
/**
 * 全选切换
 * @param val 
 */
const handleCheckAllChange = (val: boolean) => {
    checkInfo.allChecked = val
    listUpdateHandler(val)
    selectStateUpdateHandler()
}

/**
 * 列表切换
 */
const rowCheckChangeHandler = (val: boolean, row: any) => {
    row.checked = val
    listChildUpdateHandler(val, row)
    parentUpdateHandler()
    selectStateUpdateHandler()
}
/**
 * 子列表切换
 */

const rowChildrenCheckChangeHandler = (val: boolean, row: any) => {

    rowUpdateHandler(val, row)
    parentUpdateHandler()
    selectStateUpdateHandler()
}

/**
 * 更新列表状态
 */
const listUpdateHandler = (val: boolean) => {
    props.dataList.forEach((item: any) => {
        item.checked = val
        listChildUpdateHandler(val, item)
    })
}
const listChildUpdateHandler = (val: boolean, row: any) => {
    row[props.orderChildAttr].forEach((item: any) => {
        item.checked = val
    })
}

/** */
const parentUpdateHandler = () => {
    if (props.dataList.every((el: any) => el.checked)) {
        checkInfo.allChecked = true
    } else
        checkInfo.allChecked = false
}

const rowUpdateHandler = (val: boolean, row: any) => {

    //子订单状态回显
    if (row[props.orderChildAttr]) {
        if (row[props.orderChildAttr].every((item: any) => item.checked)) {
            row.checked = val
        } else {
            row.checked = false
        }
    }
}

const selectStateUpdateHandler = () => {
    /**
     * 是否聚合复选
     */
    if (props.isCheck) {
        let arr = props.dataList.filter((item: any) => item.checked)
        emits('update:multipleList', arr)
    } else {
        let arr = props.dataList.reduce((pre: any, cur: any) => {
            let arr = cur[props.orderChildAttr].filter((item: any) => item.checked)
            pre = pre.concat(arr)
            return pre
        }, [])
        emits('update:multipleList', arr)
    }
}
/**
 * 父项是否选中
 */
const parentRowIsIndeterminate = computed(() => {
    if (props.dataList) {
        if (props.dataList.length === 1) {
            return false
        } else {
            return (!props.dataList.every((item: any) => item.checked) && props.dataList.some((item: any) => item.checked))
        }
    }
    return false
})
/**
 * 子项是否选中
 */
const rowIsIndeterminate = computed(() => {
    return function (row: any) {
        if (row[props.orderChildAttr]) {
            if (row[props.orderChildAttr].length === 1) {
                return false
            } else {
                return (!row[props.orderChildAttr].every((item: any) => item.checked) && row[props.orderChildAttr].some((item: any) => item.checked))
            }
        }
        return false
    }
})

// 新增：重置选中状态（方案A）
const resetCheckedState = (list: any[]) => {
    // 清空父级全选
    checkInfo.allChecked = false
    if (!Array.isArray(list)) return
    list.forEach((row: any) => {
        row.checked = false
        // 子级重置
        const key = props.orderChildAttr
        if (key && Array.isArray(row[key])) {
            row[key].forEach((item: any) => {
                item.checked = false
            })
        }
    })
    // 同步清空选择集合
    emits('update:multipleList', [])
}

// 监听数据变化与首次挂载，自动重置勾选（避免刷新后保留上次状态）
watch(() => props.dataList, (newVal) => {
    resetCheckedState(newVal as any[])
}, { immediate: true })


</script>

<template>
    <div class="order-table-container el-table">
        <div class="option_container">
            <slot name="option"></slot>
        </div>
    </div>
    <div class="table-container">
        <table>
            <thead>
                <!-- 合并表头 -->
                <tr>
                    <!--开启合并 -->
                    <th rowspan="2" v-if="isCheck || isChildCheck">
                        <el-checkbox v-model="checkInfo.allChecked" :indeterminate="parentRowIsIndeterminate"
                            @change="handleCheckAllChange"></el-checkbox>
                    </th>
                    <th v-for="(column, index) in manageTableColumnsSpan" :key="column.prop"
                        :rowspan="column.marginLabel ? 1 : 2" :colspan="column?.colspan || 1"
                        :style="{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth || '300px', textAlign: column.align }"
                        :class="{ 'fixed-right-th': column.fixed === 'right', 'fixed-left-th': column.fixed === 'left', 'fixed': column.fixed }">
                        <div class="header-cell">
                            <!--自定义列表头-->
                            <template v-if="column.renderLabel" class="cell-content"
                                :style="{ textAlign: column.align }">
                                <MyRender :column="column" :row="{ label: column.label }" :render="column.renderLabel"
                                    :index="index">
                                </MyRender>
                            </template>
                            <template v-else class="cell-content" :style="{ textAlign: column.align }">{{
                                column.label }}</template>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th v-for="(column, index) in manageTableColumns" :key="column.prop"
                        :style="{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth || '300px', textAlign: column.align }"
                        :class="{ 'fixed-right-th': column.fixed === 'right', 'fixed-left-th': column.fixed === 'left', 'fixed': column.fixed }">
                        <div class="header-cell" :style="{ textAlign: column.align }">
                            {{ column.label }}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(row, rowIndex) in dataList">
                    <!-- 特殊行--->
                    <tr class="order-row" v-if="useCustomRow">
                        <td :colspan="columnList.length + 1">
                            <div class="order-row-content">
                                <el-checkbox v-if="isChildCheck" v-model="row.checked"
                                    :indeterminate="rowIsIndeterminate(row)"
                                    @change="rowCheckChangeHandler($event, row)"></el-checkbox>
                                <slot name="customRow" :row="row" :index="rowIndex"></slot>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(goods, goodsIndex) in foldingRow(row)">
                        <!-- 行复选-->
                        <template v-if="isCheck">
                            <td v-if="goodsIndex === 0"
                                :rowspan="foldingRow(row)?.length + (openFoldingRow && row[props.orderChildAttr]?.length > foldingLength ? 1 : 0) || 1">
                                <el-checkbox class="pl-8" v-model="goods.checked" :true-value="1" :false-value="0"
                                    @change="rowCheckChangeHandler($event, row)"></el-checkbox>
                            </td>
                        </template>
                        <template v-if="isChildCheck">
                            <td>
                                <el-checkbox class="pl-8" v-model="goods.checked"
                                    @change="rowChildrenCheckChangeHandler($event, row)"></el-checkbox>
                            </td>
                        </template>
                        <template v-for="column in columnList" :key="column.prop">
                            <!-- 合并行-->
                            <template v-if="!column.openMarginCell">
                                <td :class="{ 'fixed-right-td': column.fixed === 'right', 'fixed-left-td': column.fixed === 'left', 'fixed': column.fixed }"
                                    v-if="goodsIndex === 0"
                                    :rowspan="foldingRow(row)?.length + (openFoldingRow && row[props.orderChildAttr]?.length > foldingLength ? 1 : 0) || 1">
                                    <div class="cell"
                                        :style="{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth || '300px', textAlign: column.align }">
                                        <template v-if="column.render" :style="{ textAlign: column.align }">
                                            <MyRender :column="column" :row="goods" :render="column.render"
                                                :index="goodsIndex" :parentRow="row">
                                            </MyRender>
                                        </template>
                                        <template v-else :style="{ textAlign: column.align }">
                                            <el-tooltip effect="dark" placement="top"
                                                :disabled="!column.showOverflowTooltip" :content="row[column.prop]">
                                                <div :class="column.showOverflowTooltip ? 'overflow1' : ''">{{
                                                    row[column.prop] ??
                                                    '-' }}</div>
                                            </el-tooltip>
                                        </template>
                                    </div>
                                </td>
                            </template>
                            <!-- 非合并行-->
                            <td :style="{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth || '300px', textAlign: column.align }"
                                :class="{ 'fixed-right-td': column.fixed === 'right', 'fixed-left-td': column.fixed === 'left', 'fixed': column.fixed }"
                                v-else>
                                <div class="cell"
                                    :style="{ width: column.width, minWidth: column.minWidth, textAlign: column.align }">
                                    <template v-if="column.render" :style="{ textAlign: column.align }">
                                        <MyRender :column="column" :row="goods" :render="column.render"
                                            :index="goodsIndex" :parentRow="row">
                                        </MyRender>
                                    </template>
                                    <template v-else :style="{ textAlign: column.align }">
                                        <el-tooltip effect="dark" placement="top"
                                            :disabled="!column.showOverflowTooltip" :content="goods[column.prop]">
                                            <div :class="column.showOverflowTooltip ? 'overflow1' : ''">{{
                                                goods[column.prop] ??
                                                '-' }}</div>
                                        </el-tooltip>
                                    </template>
                                </div>
                            </td>
                        </template>
                    </tr>
                    <!-- 折叠行--->
                    <tr v-if="row[orderChildAttr] && row[orderChildAttr].length > foldingLength && openFoldingRow"
                        class="folding-row">
                        <td v-if="isChildCheck"></td>
                        <td :colspan="columnList.length" @click="handleFolding(row, rowIndex)">
                            <div class="folding-row-content">
                                <div class="folding-row-content-list">
                                    <div class="folding-row-title">
                                        {{ !row.folding ? `更多(${row[orderChildAttr].length -
                                            foldingLength})${moreTitle}` :
                                            '收起' }}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <!-- 空白数据时 -->
        <div class="my-table_empty-wrapper" v-if="!dataList.length">
            <el-empty description="暂无数据" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.overflow1 {
    @include overflow(1);
}

.order-table-container {
    background: #ffff;
    padding: 8px;
    padding-bottom: 0;
    flex-shrink: 0;

    .option_container {
        margin-bottom: 8px;
    }
}

.table-container {
    width: 100%;
    background: #ffff;
    height: calc(100% - 30px);
    overflow: auto;
    position: relative;
    /* 添加相对定位 */
    font-weight: 600px;
    font-size: 14px;
    color: #606266;
    border-bottom: 1px solid var(--el-border-color);

    table {
        margin: 8px;
        margin-top: 0;
        box-sizing: border-box;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;
        /* 使用固定表格布局 */
        width: max-content;
        // /* 根据内容自动调整宽度 */
        min-width: calc(100% - 16px);
        /* 至少占满容器宽度 */
        border: 1px solid var(--el-border-color);

        tbody {
            background-color: #fff;


        }

        thead {
            position: sticky;
            top: 0px;
            z-index: 10;
            border: 1px solid #e6e6e6;
            border-collapse: separate;
            border-spacing: 0;
            background-color: var(--el-color-primary-light-9);
            /* 增加z-index确保在最上层 */
        }

        thead th {
            // font-weight: bold;
            // font-size: 14px;
            // color: #333333;
            /* 固定在顶部 */
            background-color: var(--el-color-primary-light-9);
            /* 表头背景色 */
            z-index: 10;
            /* 确保表头在最上层 */
            white-space: nowrap;
            /* 防止表头文字换行 */
            position: relative;
            /* 为拖拽把手定位 */
            // box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
            /* 添加底部阴影增强视觉效果 */
            // border: 1px solid #e6e6e6;
            z-index: 2;
            height: 40px !important;

        }

        thead th::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 3;
        }

        .fixed-left-th {
            position: sticky;
            left: 0;
            z-index: 5;
            /* 确保固定列在普通表头之上 */
            background-color: var(--el-color-primary-light-9) !important;
        }

        .fixed-left-td {
            position: sticky;
            left: 0;
            z-index: 5;
            /* 确保固定列在普通表头之上 */
            background-color: #fff !important;
            /* 继承父元素背景色 */
        }

        /* 操作列固定在右侧 */
        .fixed-right-th {
            position: sticky;
            right: 0;
            /* 确保固定列在普通表头之上 */
            background-color: var(--el-color-primary-light-9) !important;
            z-index: 5;
        }

        .fixed-right-td {
            position: sticky;
            right: 0;
            z-index: 2;
            /* 确保固定列在普通表头之上 */
            background-color: #fff !important;
        }

        .fixed-right-th ::after,
        .fixed-right-td ::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            /* 边框样式 */
            pointer-events: none;
            /* 避免遮挡点击 */
        }

        th,
        td {
            border-top: 1px solid var(--el-border-color);
            border-left: 1px solid var(--el-border-color);
            border-bottom: 1px solid var(--el-border-color);
            padding: 8px;
            white-space: nowrap;
            /* 防止单元格内容换行 */
            overflow: hidden;
            text-overflow: ellipsis;
            /* 超出部分显示省略号 */
        }

        td:last-child {
            border-right: 1px solid var(--el-border-color);
            // background-color: red !important;
        }

        /* 拖拽把手样式 */
        .resize-handle {
            position: absolute;
            top: 0;
            right: 0;
            width: 5px;
            height: 100%;
            background-color: transparent;
            cursor: col-resize;
            user-select: none;

            &:hover {
                background-color: var(--el-color-primary-light-9);
            }
        }

        tr:last-child {
            td {
                border-bottom: none !important;
            }
        }
    }

    /* 拖拽时的样式 */
    &.resizing {
        cursor: col-resize;
        user-select: none;
    }

    .order-row {
        border: none !important;

        td {
            border-bottom: none !important;
            border-top: none !important;
            padding: 0;
            padding-top: 12px;
        }

        .order-row-content {
            border-top: 1px solid var(--el-border-color);
            border-bottom: 0;
            padding: 12px 10px;
            box-sizing: border-box;
            background-color: rgba(64, 158, 255, 0.0705882353);
            display: flex;
            align-items: center;
            gap: 8px;
        }
    }

    .folding-row {
        background-color: var(--el-color-primary-light-9);
        padding: 12px 10px;
        height: 40px;

        .folding-row-content-list {
            height: 1px;
            // width: 100%;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;

            .folding-row-title {
                min-width: 100px;
                background: var(--el-color-primary-light-9);
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: var(--el-color-primary);
            }
        }
    }

    .my-table_empty-wrapper {
        width: 100%;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: 1px solid var(--el-color-border);
    }
}
</style>