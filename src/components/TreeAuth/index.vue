<template>
    <div class="treeAuth_container">
        <!--第一级--->
        <div class="header">
            <div class="item1 cell">一级</div>
            <div class="item2_header_box">
                <div class="item2_box_item1 cell">二级</div>
                <div class="item2_box_item2 cell">功能</div>
            </div>
        </div>
        <div class="treeAuth_content">
            <div class="content_item" v-for="(item, index) in treeList" :key="index">
                <div class="item1 cell">
                    <el-checkbox v-model="item.isChecked" @change="changeFistHandler($event, item)"
                        :indeterminate="item.isIndeterminate" :label="item.name" :value="item.id" />
                </div>
                <div class="item2_content_item2">
                    <div v-if="treeList?.[index]?.children?.length"
                        v-for="(item1, index1) in treeList?.[index]?.children" class="content_item_child1">
                        <div class="item2_box_item1 cell">
                            <el-checkbox v-model="item1.isChecked" @change="changeTowHandler($event, item1)"
                                :indeterminate="item1.isIndeterminate" :label="item1.name" :value="item1.id" />
                        </div>
                        <div class="item2_box_item2">
                            <div class="item-box cell" v-for="(item2, index2) in item1.children" :key="index2">
                                <el-checkbox v-model="item2.isChecked" @change="changeThreeHandler($event, item2)"
                                    :label="item2.name" :value="item2.id" />
                            </div>
                        </div>
                    </div>
                    <div v-else class="content_item_child1">
                        <div class="item2_box_item1 cell"></div>
                        <div class="item2_box_item2 cell"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'TreeAuth'
})
interface IProp {
    treeList: any
    selectedIds: any
}
const props = withDefaults(defineProps<IProp>(), {
    treeList: [],
    selectedIds: []
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()
const changeFistHandler = ($event: any, item: any) => {
    // 一级选中状态改变时，同步更新二级和三级的选中状态
    if (item.children) {
        item.children.forEach((child: any) => {
            child.isChecked = item.isChecked
            child.isIndeterminate = false // 清除半选状态
            if (child.children) {
                child.children.forEach((grandChild: any) => {
                    grandChild.isChecked = item.isChecked
                })
            }
        })
    }
    item.isIndeterminate = false // 清除当前节点的半选状态
    // 触发更新事件
    emits('update:modelValue', props.treeList)
}

const changeTowHandler = ($event: any, item: any) => {
    // 二级选中状态改变时，同步更新三级的选中状态
    if (item.children) {
        item.children.forEach((child: any) => {
            child.isChecked = item.isChecked
        })
    }
    item.isIndeterminate = false // 清除当前节点的半选状态
    // 找到当前项目所属的一级节点
    const parentItem = props.treeList.find((firstLevel: any) =>
        firstLevel.children?.some((secondLevel: any) => secondLevel === item)
    )
    if (parentItem) {
        updateFirstLevelStatus(parentItem)
    }
}

const changeThreeHandler = ($event: any, item: any) => {
    // 找到当前项目所属的一级和二级节点
    props.treeList.forEach((firstLevel: any) => {
        firstLevel.children?.forEach((secondLevel: any) => {
            if (secondLevel.children?.includes(item)) {
                // 更新二级节点状态
                updateSecondLevelStatus(secondLevel)
                // 更新一级节点状态
                updateFirstLevelStatus(firstLevel)
            }
        })
    })
}

// 更新二级节点的状态
const updateSecondLevelStatus = (secondLevel: any) => {
    if (secondLevel.children) {
        const childCheckedCount = secondLevel.children.filter((child: any) => child.isChecked).length
        secondLevel.isIndeterminate = childCheckedCount > 0 && childCheckedCount < secondLevel.children.length
        secondLevel.isChecked = childCheckedCount === secondLevel.children.length
    }
}

// 更新一级节点的状态
const updateFirstLevelStatus = (firstLevel: any) => {
    if (firstLevel.children) {
        const secondLevelCheckedCount = firstLevel.children.filter((child: any) => child.isChecked).length
        const secondLevelIndeterminateCount = firstLevel.children.filter((child: any) => child.isIndeterminate).length
        firstLevel.isIndeterminate = (secondLevelCheckedCount > 0 && secondLevelCheckedCount < firstLevel.children.length) || secondLevelIndeterminateCount > 0
        firstLevel.isChecked = secondLevelCheckedCount === firstLevel.children.length && secondLevelIndeterminateCount === 0
    }
}

// 更新所有父级复选框的状态
const updateParentCheckStatus = () => {
    props.treeList.forEach((firstLevel: any) => {
        if (firstLevel.children) {
            // 更新二级复选框状态
            firstLevel.children.forEach((secondLevel: any) => {
                updateSecondLevelStatus(secondLevel)
            })
            // 更新一级复选框状态
            updateFirstLevelStatus(firstLevel)
        }
    })

    // 触发更新事件
    emits('update:modelValue', props.treeList)
}

// 获取所有选中的节点
const getCheckedNodes = () => {
    const selectedNodes: any[] = []

    props.treeList.forEach((firstLevel: any) => {
        // 收集选中或半选的一级节点
        if (firstLevel.isChecked || firstLevel.isIndeterminate) {
            selectedNodes.push({
                id: firstLevel.id,
                name: firstLevel.name,
                level: 1
            })
        }
        // 收集选中或半选的二级节点
        firstLevel.children?.forEach((secondLevel: any) => {
            if (secondLevel.isChecked || secondLevel.isIndeterminate) {
                selectedNodes.push({
                    id: secondLevel.id,
                    name: secondLevel.name,
                    level: 2,
                    parentId: firstLevel.id
                })
            }

            // 收集选中的三级节点（三级节点没有半选状态）
            secondLevel.children?.forEach((thirdLevel: any) => {
                if (thirdLevel.isChecked) {
                    selectedNodes.push({
                        id: thirdLevel.id,
                        name: thirdLevel.name,
                        level: 3,
                        parentId: secondLevel.id
                    })
                }
            })
        })
    })

    return selectedNodes
}
watch(() => props.selectedIds, (newVal, oldVal) => {
    if (newVal) {
        setSelectedByIds(newVal)
    }
})
// 根据ID数组设置选中状态
const setSelectedByIds = (selectedIds: string[] | number[]) => {
    // 重置所有节点的选中状态
    const resetCheckStatus = (nodes: any[]) => {
        nodes.forEach(node => {
            node.isChecked = false
            node.isIndeterminate = false
            if (node.children) {
                resetCheckStatus(node.children)
            }
        })
    }

    // 设置选中状态并返回是否找到节点
    const setNodeChecked = (nodes: any[], id: string | number): boolean => {
        for (const node of nodes) {
            // 检查当前节点
            if (node.id === id) {
                node.isChecked = true
                return true
            }

            // 检查子节点
            if (node.children && node.children.length > 0) {
                const found = setNodeChecked(node.children, id)
                if (found) {
                    // 只在找到目标节点的路径上更新父节点状态
                    const checkedChildren = node.children.filter((child: any) => child.isChecked).length
                    const hasIndeterminateChild = node.children.some((child: any) => child.isIndeterminate)
                    node.isIndeterminate = hasIndeterminateChild || (checkedChildren > 0 && checkedChildren < node.children.length)
                    node.isChecked = !node.isIndeterminate && checkedChildren === node.children.length
                    return true
                }
            }
        }
        return false
    }

    // 先重置所有节点状态
    resetCheckStatus(props.treeList)

    // 设置选中的节点
    selectedIds.forEach(id => {
        setNodeChecked(props.treeList, id)
    })
}

defineExpose({
    getCheckedNodes,
    setSelectedByIds
})

</script>

<style lang="scss" scoped>
.treeAuth_container {
    .header {
        display: flex;
        width: 100%;
        background-color: var(--el-color-primary-light-9);

        .item1:first-child {
            border-top: 1px solid #ccc;
        }
    }

    .content_item {
        display: flex;
        width: 100%;
    }

    .item1 {
        flex: 1;
        max-width: 200px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        display: flex;
        align-items: center;
    }

    .item1:first-child {
        border-left: 1px solid #ccc;
    }

    .item2_header_box {
        flex: 2;
        display: flex;
        border-top: 1px solid #ccc;
    }

    .item2_content_item2 {
        flex: 2;
    }

    .item2_box_item1 {
        flex: 1;
        max-width: 250px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }

    .item2_box_item2 {
        display: flex;
        flex: 1;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        gap: 12px;
    }

    .content_item_child1 {
        display: flex;
    }

    .cell {
        padding: 8px;
        min-height: 50px;
    }
}
</style>
