<script setup lang="ts">
defineOptions({ name: 'ImportingTemplate' })
import { useRoute } from 'vue-router'
import LoadingNode from './LoadingNode.vue'
import ResultNode from './ResultNode.vue'
import getConfigInfo from './templateConfig'
import UploadContent from './UploadContent.vue'
import UploadStateNode from './UploadStateNode.vue'
const $useRoue = useRoute()
const pageInfo: any = ref({})
interface IProp {
    type?: string
}
const props = withDefaults(defineProps<IProp>(), {
    type: ''
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()

onMounted(async () => {
    const type = $useRoue.query?.type || props.type || ''
    switch (type) {
        case 'orderExport': //订单批量发货
            pageInfo.value = (await getConfigInfo('orderExport')) || {}
            break
    }
})

interface IData {
    step: number
    resultDetail: {}
}
const dataPage = reactive<IData>({
    step: 0,
    resultDetail: {
        failNum: '',
        totalNum: '',
        successNum: ''
    }
})

const reloadUpload = () => {
    dataPage.step = 0
}
</script>

<template>
    <PageContainer class="page-container">
        <div>
            <div class="mb-60">
                <UploadStateNode :active="dataPage.step" :nodeConfig="pageInfo.nodeConfig" finish-status="success">
                </UploadStateNode>
            </div>
            <div class="content">
                <div v-show="['0', '1'].includes(String(dataPage.step))">
                    <!--上传 -->
                    <UploadContent :resultDetail="dataPage.resultDetail" :exportApiConfig="pageInfo.exportApiConfig"
                        v-model:step="dataPage.step" :exportConfig="pageInfo.exportConfig"
                        :exportNodeDecListConfig="pageInfo.exportNodeDecListConfig"></UploadContent>
                </div>
                <!--上传中 -->
                <LoadingNode v-show="String(dataPage.step) === '2'"></LoadingNode>
                <!--上传后 -->
                <ResultNode v-show="String(dataPage.step) === '3'" :resultDetail="dataPage.resultDetail"
                    :exportErrorApiConfig="pageInfo.exportErrorApiConfig" @reloadUpload="reloadUpload"
                    :exportNodeResultDecListConfig="pageInfo.exportNodeResultDecListConfig"
                    :exportReturnRouteConfig="pageInfo.exportReturnRouteConfig"></ResultNode>
            </div>
        </div>
    </PageContainer>
</template>

<style lang="scss" scoped>
.page-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: calc(100vh - 120px);
    background-color: var(--el-searchForm-bg-color);

    .content {
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
