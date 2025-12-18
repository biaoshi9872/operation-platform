<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AnnouncementPage from '@/views/system/components/announcement/AnnouncementPage.vue'

const curryInfo = ref<any>(null)
const announcementPageRef = ref<InstanceType<typeof AnnouncementPage> & { init: () => void } | null>(null)

onMounted(() => {
    announcementPageRef.value?.init()
})

</script>

<template>
    <AnnouncementPage :curryInfo="curryInfo" ref="announcementPageRef"></AnnouncementPage>
</template>
