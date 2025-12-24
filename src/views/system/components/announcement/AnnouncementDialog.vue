<script setup lang="ts">
import AnnouncementPage from './AnnouncementPage.vue'
interface IProp {
  curryInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
  curryInfo: null
})
const visible = defineModel<boolean>('visible', { default: false })

const announcementPageRef: any = ref(null)
const openHandler = () => {
  announcementPageRef.value.init()
}
const handleClose = () => {
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" title="版本迭代通知" width="1400" :close-on-click-modal="false" destroy-on-close
    @open="openHandler">
    <AnnouncementPage :curryInfo="curryInfo" ref="announcementPageRef" type="2"></AnnouncementPage>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
