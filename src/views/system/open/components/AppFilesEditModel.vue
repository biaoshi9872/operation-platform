<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid';
import apiFiles from '@/api/apiFiles/index'

interface IProps {
    nodeCurryInfo: any,
    curryInfo: any
}
const props = withDefaults(defineProps<IProps>(), {
    nodeCurryInfo: {},
    curryInfo: {}
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any
const deFaultColumn = {
    columnName: '',
    columnId: null,
    columnType: '',
    columnRequired: false,
    columnExample: '',
    columnDescription: '',
    child: []
}
const data = reactive<any>({
    formData: {
        "id": "",
        "cateId": "",
        apiUrl: '',
        "apiName": "",
        "description": "",
        "reqExample": "",
        "resExample": "",
        "req": [],
        "res": [],
        "sort": 0
    },
    formDataBK: {},
    formRules: {
        apiName: [{ required: true, message: '请输入接口名称', trigger: ['change', 'blur'] }],
        apiUrl: [{ required: true, message: '请输入接口路径', trigger: ['change', 'blur'] }],
    },
    publicParam: {
        address: [],
        commonReq: [],
        commonRes: [],
        errDescriptionList: [],
        errExample: {}
    },
    curryRow: null,
    type: null,
    tableFromData: {},
    resError: '',
    requestError: '',
    submitLoading: false,
})
const handleReset = () => {
    if (formRef.value) {
        formRef.value.resetFields()
    }
    emits('update:modelValue', false)
}
const handleClose = () => {
    handleReset()
    emits('refresh')
    searchQueryHandler()
    emits('update:modelValue', false)
}
const searchQueryHandler = inject('searchQueryHandler', () => { })
onMounted(() => {
    data.formDataBK = cloneDeep(data.formData)
})
const openHandler = () => {
    data.formData = {
        ...data.formDataBK
    }
    if (props.curryInfo?.id) {
        apiFiles.A_apiInterfaceDetail(props.curryInfo.id).then((res) => {
            data.formData = res
        })
    }
    getPublicParam()
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
        const cateId = props.nodeCurryInfo.id
        apiFiles.A_apiInterfaceSave({
            ...data.formData,
            cateId
        }).then((res: any) => {
            ElMessage.success('保存成功')
            emits('refresh')
            handleClose()
        })
    })
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

const addParam = (type: string) => {
    let obj: any = cloneDeep(deFaultColumn)
    obj.columnId = uuidv4()
    obj.columnParentId = 0
    if (!data.formData[type]) {
        data.formData[type] = []
    }
    data.formData[type].push({
        ...obj
    })
}
const handleRowClick = (row: any, type: string) => {
    data.curryRow = row
    data.type = type
}
const addChildrenParam = (row: any, type: string) => {
    let obj: any = cloneDeep(deFaultColumn)
    obj.columnId = uuidv4()
    obj.columnParentId = row.columnId
    row.child.push({
        ...obj
    })
}



const handleDelete = (row: any, type: string) => {
    if (!data.formData[type]) return;

    // 如果是子节点（在child数组中）
    if (row.columnParentId) {
        // 找到父节点
        const parentItem = data.formData[type].find((item: any) => item.columnId === row.columnParentId);
        if (parentItem && parentItem.child) {
            // 从父节点的child数组中删除当前节点
            const childIndex = parentItem.child.findIndex((child: any) => child.columnId === row.columnId);
            if (childIndex !== -1) {
                parentItem.child.splice(childIndex, 1);
            }
        }
    } else {
        // 如果是父节点，删除它及其所有子节点
        const index = data.formData[type].findIndex((item: any) => item.columnId === row.columnId);
        if (index !== -1) {
            data.formData[type].splice(index, 1);
        }
    }
}



const cellMouseEnter = (row: any) => {
    if (row) {
        row.edit = true
    }
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
    if (row.hasOwnProperty('columnId')) {
        //@ts-ignore
        if (data.curryRow?.columnId == row?.columnId) return 'success-row'
    } else {
        //@ts-ignore
        if (data.curryRow?.['customerId_index'] == rowIndex) return 'success-row'
    }
}

const getPublicParam = () => {
    apiFiles.A_getPublicParam().then((res) => {
        try {
            data.publicParam = JSON.parse(res)
        } catch (error) {
            data.publicParam = {
                address: [],
                commonReq: [],
                commonRes: [],
                errDescriptionList: [],
                errExample: {}
            }
        }
    })
}

</script>
<template>
    <el-drawer v-bind="$attrs" :close-on-click-modal="false" title="API文档编辑" size="60%" @closed="handleReset"
        @open="openHandler">
        <div class="api_container">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-card title="基础信息" class="mb-8">
                    <template #header>基础信息</template>
                    <el-form-item label="接口路径" prop="apiUrl">
                        <el-input v-model="data.formData.apiUrl" placeholder="请输入接口路径" maxlength="100"
                            show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="接口名称" prop="apiName">
                        <el-input v-model="data.formData.apiName" maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="API说明" prop="description">
                        <MyTinymce v-model="data.formData.description"></MyTinymce>
                    </el-form-item>
                </el-card>

                <el-card class="mb-8">
                    <template #header>请求参数说明</template>
                    <div class="flex justify-end mb-8">
                        <el-button type="primary" link @click="addParam('req')">添加参数</el-button>
                    </div>
                    <el-table style="width: 100%" row-key="columnId" :tree-props="{ children: 'child' }"
                        :row-class-name="tableRowClassName" @row-click="(row: any) => {
                            handleRowClick(row, 'req')
                        }" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter"
                        :data="data.formData.req" border>
                        <el-table-column label="" width="55"></el-table-column>
                        <el-table-column type="index" label="序号" width="55"></el-table-column>
                        <el-table-column label="名称" show-overflow-tooltip>
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnName }}
                                </div>
                                <el-input v-else v-model="scope.row.columnName" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="130px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnType }}
                                </div>
                                <el-select v-else v-model="scope.row.columnType" placeholder="请选择">
                                    <el-option v-for="item in typeList" :label="item.label" :value="item.value" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否必填" width="120px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnRequired ? '是' : '否' }}
                                </div>
                                <el-select v-else v-model="scope.row.columnRequired" placeholder="请选择">
                                    <el-option label="是" :value="true" />
                                    <el-option label="否" :value="false" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="示例值" show-overflow-tooltip>
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnExample }}
                                </div>
                                <el-input v-else v-model="scope.row.columnExample" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" show-overflow-tooltip>
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnDescription }}
                                </div>
                                <el-input v-else v-model="scope.row.columnDescription" maxlength="500"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80px">
                            <template #default="scope">
                                <div class="flex justify-center gap-2 items-center">
                                    <span @click="addChildrenParam(scope.row, 'req')"><el-icon>
                                            <CirclePlus />
                                        </el-icon></span>
                                    <span @click="handleDelete(scope.row, 'req')"><el-icon>
                                            <Remove />
                                        </el-icon></span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="mb-8">
                    <template #header>返回参数说明</template>
                    <div class="flex justify-end mb-8">
                        <el-button type="primary" link @click="addParam('res')">添加参数</el-button>
                    </div>
                    <el-table style="width: 100%" row-key="columnId" :tree-props="{ children: 'child' }"
                        :row-class-name="tableRowClassName" @row-click="(row: any) => {
                            handleRowClick(row, 'res')
                        }" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter"
                        :data="data.formData.res" border>
                        <el-table-column label="" width="55"></el-table-column>
                        <el-table-column type="index" label="序号" width="55"></el-table-column>
                        <el-table-column label="名称" show-overflow-tooltip>
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnName }}
                                </div>
                                <el-input v-else v-model="scope.row.columnName" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="130px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnType }}
                                </div>
                                <el-select v-else v-model="scope.row.columnType" placeholder="请选择">
                                    <el-option v-for="item in typeList" :label="item.label" :value="item.value" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否必填" width="120px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnRequired ? '是' : '否' }}
                                </div>
                                <el-select v-else v-model="scope.row.columnRequired" placeholder="请选择">
                                    <el-option label="是" :value="true" />
                                    <el-option label="否" :value="false" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="示例值" show-overflow-tooltip>
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnExample }}
                                </div>
                                <el-input v-else v-model="scope.row.columnExample" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" show-overflow-tooltip>
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.columnDescription }}
                                </div>
                                <el-input v-else v-model="scope.row.columnDescription" maxlength="500"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80px">
                            <template #default="scope">
                                <div class="flex justify-center gap-2 items-center">
                                    <span @click="addChildrenParam(scope.row, 'res')"><el-icon>
                                            <CirclePlus />
                                        </el-icon></span>
                                    <span @click="handleDelete(scope.row, 'res')"><el-icon>
                                            <Remove />
                                        </el-icon></span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="mb-8">
                    <template #header>请求示例</template>
                    <JsonEditor v-model="data.formData.reqExample" @error="(err) => data.requestError = err" />
                    <div v-if="data.requestError" class="text-red-500 mt-2 text-sm">
                        {{ data.requestError }}
                    </div>
                </el-card>
                <el-card class="mb-8">
                    <template #header>响应示例</template>
                    <JsonEditor v-model="data.formData.resExample" @error="(err) => data.resError = err" />
                    <div v-if="data.resError" class="text-red-500 mt-2 text-sm">
                        {{ data.resError }}
                    </div>
                </el-card>
                <el-card class="mb-8">
                    <template #header>公共参数</template>
                    <h5>请求地址:</h5>
                    <el-table :data="data.publicParam.address" style="width: 100%">
                        <el-table-column prop="environment" label="环境" />
                        <el-table-column label="HTTP地址" prop="url" />
                    </el-table>
                    <h5>公共请求参数:</h5>
                    <el-table :data="data.publicParam.commonReq" style="width: 100%">
                        <el-table-column label="名称" prop="name" show-overflow-tooltip />
                        <el-table-column label="类型" prop="type" />
                        <el-table-column label="是否必填" prop="required">
                            <template v-slot="scope">
                                {{ scope.row.required ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" prop="description" show-overflow-tooltip />
                    </el-table>
                    <h5>公共响应参数:</h5>
                    <el-table :data="data.publicParam.commonRes" style="width: 100%">
                        <el-table-column label="名称" prop="name" show-overflow-tooltip />
                        <el-table-column label="类型" prop="type" />
                        <el-table-column label="是否必填" prop="required">
                            <template v-slot="scope">
                                {{ scope.row.required ? '是' : '否' }}
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" prop="description" show-overflow-tooltip />
                    </el-table>
                    <h5>错误说明</h5>
                    <el-table :data="data.publicParam.errDescriptionList" style="width: 100%">
                        <el-table-column label="错误码" prop="errCode" />
                        <el-table-column label="错误信息" prop="errDescription" show-overflow-tooltip />
                    </el-table>
                    <h5>异常示例</h5>
                    <json-viewer :value="data.publicParam.errExample" :expand-depth="5" copyable boxed sort
                        class="w-100% bg-#999"></json-viewer>
                </el-card>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>
<style lang="scss" scoped>
.api_container {
    ::v-deep(.el-card__header) {
        color: var(--el-color-primary);
    }

    ::v-deep(.el-table .success-row) {
        --el-table-tr-bg-color: var(--el-color-success-light-9);
    }

    ::v-deep(.el-table__cell) {
        height: 65px !important;
    }
}
</style>