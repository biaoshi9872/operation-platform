<template>
    <div>
        <el-card shadow="never" style="height: 100%">
            <el-form :model="dataInfo.form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="模版名称" prop="templateName">
                    <el-input v-model="dataInfo.form.templateName" style="width: 480px" placeholder="请输入名称，最长20个字符"
                        maxlength="20" />
                </el-form-item>
                <el-form-item label="限售地区" prop="areaDetail">
                    <div>
                        <div>
                            {{ dataInfo.form.address }}
                        </div>
                        <div>
                            <el-button type="primary" link @click="handleSetArea">设置限售地区</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="dataInfo.submitLoading" @click="handleSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog v-model="dataInfo.dialogVisible" title="设置区域" width="600px" destroy-on-close
            @close="handleDialogClose">
            <div class="area-dialog-content">
                <el-cascader-panel v-model="dataInfo.areaCheckList" :options="dataInfo.areaList" :props="{
                    label: 'labelName',
                    value: 'labelId',
                    children: 'children',
                    multiple: true,
                }" :checkable="true" :check-strictly="true" ref="treeRef" show-checkbox>
                </el-cascader-panel>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dataInfo.dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleConfirmAreas">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import restrictedSalesArea_api from '@/api/restrictedSalesArea/index'
import { tabsStore } from '@/stores'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const $useRote = useRoute()
const tabsStoreInfo: any = tabsStore()
const $route = useRoute()
const dataInfo = reactive({
    dialogVisible: false,
    areaList: [],
    submitLoading: false,
    areaCheckList: [],
    form: {
        address: '',
        "templateName": "",
        "areaDetail": [

        ]
    }
})
onMounted(() => {
    getAreaList()
})
const handleSetArea = () => {
    dataInfo.areaCheckList = dataInfo.form.areaDetail?.map((item: any) => {
        return [item.areaId, item.provinceId, item.cityId]
    }) as any
    dataInfo.dialogVisible = true
}
const getAreaList = async () => {
    restrictedSalesArea_api.A_areaTree({}).then(res => {
        dataInfo.areaList = res as any
    })
}
const id = computed(() => {
    return $route.query.id
})
const handleDialogClose = () => {
    dataInfo.dialogVisible = false
    // TODO: 实现关闭对话框的逻辑
}
const treeRef: any = ref(null)
const handleConfirmAreas = () => {
    // TODO: 实现确定按钮的逻辑
    dataInfo.form.areaDetail = dataInfo.areaCheckList.map((item: any) => {
        return {
            "areaId": item[0],
            "provinceId": item[1],
            "cityId": item[2]
        }
    }) as any
    const arr = treeRef.value.getCheckedNodes()
    dataInfo.form.address = arr.filter((item: any) => item.level === 3).map((item: any) => item.label).join(',')
    dataInfo.dialogVisible = false
}
// 表单实例
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    moduleName: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    areaDetail: [
        { type: 'array', required: true, message: '请选择区域', trigger: 'change' }
    ]
})

// 提交表单
const handleSubmit = () => {
    // TODO: 实现表单提交逻辑
    formRef.value?.validate((valid, fields) => {
        if (valid) {
            dataInfo.submitLoading = true
            const api = id.value ? restrictedSalesArea_api.A_updTemplate : restrictedSalesArea_api.A_addTemplate
            api({ ...dataInfo.form, id: id.value || null }).then(res => {
                ElMessage.success('操作成功')
                getDetail()
                tabsStoreInfo.close($useRote, {
                    path: '/system/restrictedSalesArea/list'
                })
            }).finally(() => {
                dataInfo.submitLoading = false
            })
        }
    })
}

onMounted(() => {
    getDetail()
})
const getDetail = () => {
    if (id.value) {
        restrictedSalesArea_api.A_getDetail(id.value).then(res => {
            let areaDetail = res.address as any
            let address = areaDetail.map(item => item.labelName).join(',')
            dataInfo.form = {
                ...dataInfo.form,
                ...res
            }
            dataInfo.form.address = address
            dataInfo.form.areaDetail = areaDetail
        })
    }
}

</script>

<style lang="scss" scoped>
.el-form {
    padding: 20px;
}
</style>
