<script setup lang="ts" name="AuthItem">
import type { ElTree } from 'element-plus'
import { ref } from 'vue'

const props = defineProps({
  tree: {
    type: Array,
    default: () => []
  },
  initialChecked: {
    type: Array,
    default: () => []
  }
})

const checkedList = ref([])

watch(
  () => props.initialChecked,
  newValue => {
    if (props.initialChecked) {
      //@ts-ignore
      checkedList.value = newValue
      //@ts-ignore
      leftTree.value.setCheckedKeys(checkedList.value)
    }
  }
)

const leftTree = ref<InstanceType<typeof ElTree>>()

// 获取所有选中 id 包含全选半选
function getAllChecked() {
  //@ts-ignore
  const keys = leftTree.value.getCheckedKeys()
  //@ts-ignore
  const halfKeys = leftTree.value.getHalfCheckedKeys()
  return [...keys, ...halfKeys]
}

defineExpose({
  getAllChecked
})
</script>

<template>
  <div class="permission-tree">
    <ModalContent title="权限设置">
      <el-tree
        ref="leftTree"
        :data="tree"
        show-checkbox
        highlight-current
        node-key="id"
        :props="{ children: 'children', label: 'name' }"
        :default-checked-keys="checkedList"
        default-expand-all="true"
      />
    </ModalContent>
    <!-- 模块-->
    <div class="tree-half left-half">
      <div class="tree-wrap"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-color-lighter: #dcdfe6;

.permission-tree {
  display: flex;
  flex: 1;
  overflow: hidden;

  .tree-half {
    flex: 1;
    display: flex;
    flex-direction: column;

    &.left-half {
    }

    .tree-title {
      padding-left: 16px;
      height: 56px;
      font-size: 16px;
      line-height: 56px;
      background: #f6f6f6;
    }
  }

  .tree-wrap {
    flex: 1;
    padding: 10px;
    overflow: auto;
  }
}
</style>

<style lang="scss">
.permission-tree {
  width: 100%;
  height: 100%;

  .left-tree > .el-tree-node > .el-tree-node__children > .el-tree-node__children > .el-tree-node {
    & .el-tree-node__expand-icon {
      visibility: hidden;
    }

    & .el-tree-node__children {
      display: none;
    }
  }
}
</style>
