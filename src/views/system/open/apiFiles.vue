<script setup lang="ts">
defineOptions({
    name: 'xxxx'
})
import { IPage } from '@/types/from-types'
import pageHooks from '@/hooks/pageListHooks'
import { ElMessageBox, ElMessage } from 'element-plus'
import AppFilesEditModel from './components/AppFilesEditModel.vue'
import AppFadeModel from './components/AppFadeModel.vue'
import { ElButton } from 'element-plus'
const router = useRouter()
const dataPage = reactive({
    curryInfo: {},
    showAddModel: true,
})
const addHandler = () => {
    dataPage.curryInfo = {}
    dataPage.showAddModel = true
}

const tableData1 = ref([])
</script>
<template>
    <div class="api_box_box">
        <div class="main_box_left">
            <div>
                <el-button type="primary" @click="addHandler">新增</el-button>
            </div>
        </div>
        <div class="main_box_right">
            1
        </div>
    </div>
    <!-- <AppFadeModel v-model="dataPage.showAddModel" :curryInfo="dataPage.curryInfo"></AppFadeModel> -->
    <AppFilesEditModel v-model="dataPage.showAddModel" :curryInfo="dataPage.curryInfo"></AppFilesEditModel>
</template>
<style lang="scss" scoped>
.api_box_box {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: calc(100vh - 120px);
    width: 100%;

    .main_box_left {
        height: 100%;
        min-width: 250px;
        max-width: 450px;
        overflow: hidden;
        background-color: #fff;
        margin-right: 12px;
    }

    .main_box_right {
        flex: 1;
        height: 100%;
        background-color: #fff;
    }
}
</style>