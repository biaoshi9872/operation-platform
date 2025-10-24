<script setup lang="ts">
defineOptions({
  name: 'KeySelect'
})
interface IProp {
  keySelectList: any
}
const props = withDefaults(defineProps<IProp>(), {
  keySelectList: []
})
const emits = defineEmits<{
  (e: 'keySelectChange', key: any, select: any): void
}>()

const data = reactive({
  key: '',
  select: ''
})
onMounted(() => {
  reSetHandler()
})
watch(
  () => [data.key, data.select],
  val => {
    emits('keySelectChange', data.key, data.select)
  },
  {
    deep: true,
    immediate: true
  }
)
const reSetHandler = () => {
  data.key = ''
  data.select = props.keySelectList[0].value
}

defineExpose({
  reSetHandler
})
</script>
<template>
  <div class="key-select">
    <el-input v-model="data.key" placeholder="请输入关键字">
      <template #prepend>
        <el-select v-model="data.select" class="select-container">
          <el-option v-for="(item, index) in props.keySelectList" :label="item.label" :value="item.value"
            :key="index" />
        </el-select>
      </template>
    </el-input>
  </div>
</template>
<style lang="scss" scoped>
.key-select {
  ::v-deep(.el-input-group__prepend) {
    width: 130px !important;

    .el-select {}
  }

  ::v-deep(.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper) {
    box-shadow: none !important;
  }

  .select-container {
    width: 80px !important;
    margin: 0 !important
  }
}
</style>