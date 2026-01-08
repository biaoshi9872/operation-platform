<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid';
import apiFiles from '@/api/apiFiles/index'
import { oneDark } from '@codemirror/theme-one-dark'
import EditCell from './EditCell.vue'
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
        reqSdk: '',
        "req": [],
        "res": [],
        "isShow": 1,
        "sort": 0
    },
    json: '',
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
    optionType: 1
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
        ...cloneDeep(data.formDataBK)
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
            cateId,
            type: data.optionType
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

    // 递归查找并删除节点
    const deleteNode = (items: any[]) => {
        for (let i = 0; i < items.length; i++) {
            // 检查当前项
            if (items[i].columnId === row.columnId) {
                items.splice(i, 1);
                return true;
            }
            // 检查子项
            if (items[i].child && items[i].child.length) {
                if (deleteNode(items[i].child)) {
                    return true;
                }
            }
        }
        return false;
    };

    deleteNode(data.formData[type]);
}

const upMove = (row: any, type: string) => {
    if (!data.formData[type]) return;
    // 递归查找节点及其父节点
    const findNodeAndParent = (items: any[]): any => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].columnId === row.columnId) {
                return { array: items, index: i };
            }
            if (items[i].child && items[i].child.length) {
                const result = findNodeAndParent(items[i].child);
                if (result) return result;
            }
        }
        return null;
    };

    const result = findNodeAndParent(data.formData[type]);
    if (!result) return;

    const { array, index } = result;
    if (index > 0) {
        // 交换当前节点与前一个节点的位置
        [array[index], array[index - 1]] = [array[index - 1], array[index]];
    }
}

const downMove = (row: any, type: string) => {
    if (!data.formData[type]) return;

    // 递归查找节点及其父节点
    const findNodeAndParent = (items: any[], parentArray: any[] | null = null): any => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].columnId === row.columnId) {
                return { node: items[i], index: i, parent: parentArray || items };
            }
            if (items[i].child && items[i].child.length) {
                const result = findNodeAndParent(items[i].child, items[i].child);
                if (result) return result;
            }
        }
        return null;
    };

    const result = findNodeAndParent(data.formData[type]);
    if (!result) return;
    const { index, parent } = result;
    if (index === parent.length - 1) return;
    [parent[index], parent[index + 1]] = [parent[index + 1], parent[index]];
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
const handleCellClick = (row: any, column: any, cell: any, type: string) => {
    row[column.property + 'edit'] = true
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
                    <el-form-item label="功能描述" prop="description">
                        <MyTinymce v-model="data.formData.description"></MyTinymce>
                    </el-form-item>
                    <el-form-item label="是否显示" prop="isShow">
                        <el-radio-group v-model="data.formData.isShow">
                            <!-- works when >=2.6.0, recommended ✔️ not work when <2.6.0 ❌ -->
                            <el-radio :value="1">是</el-radio>
                            <!-- works when <2.6.0, deprecated act as value when >=3.0.0 -->
                            <el-radio :value="0">否</el-radio>
                        </el-radio-group>
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
                        }" @cell-click="(row: any, column: any, cell: any) => {
                            handleCellClick(row, column, cell, 'req')
                        }" :data="data.formData.req" border>
                        <el-table-column type="index" label="序号" width="55"></el-table-column>
                        <el-table-column label="字段" min-width="140px" prop="columnName" show-overflow-tooltip>
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnName" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="名称" show-overflow-tooltip prop="columnDescription">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnDescription" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="120px" prop="columnType">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnType" type="select" :options="typeList">
                                </EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否必填" width="120px" prop="columnRequired">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnRequired" type="select"
                                    :options="[{ label: '是', value: true }, { label: '否', value: false }]"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="示例值" show-overflow-tooltip width="140px" prop="columnExample">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnExample" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" show-overflow-tooltip prop="columnRemark">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnRemark" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140px" align="right">
                            <template #default="scope">
                                <div class="flex justify-center gap-2 items-center">
                                    <div @click="upMove(scope.row, 'req')"><el-icon>
                                            <Upload />
                                        </el-icon></div>
                                    <div @click="downMove(scope.row, 'req')"><el-icon>
                                            <Download />
                                        </el-icon></div>
                                    <div @click="addChildrenParam(scope.row, 'req')"><el-icon>
                                            <CirclePlus />
                                        </el-icon></div>
                                    <div @click="handleDelete(scope.row, 'req')"><el-icon>
                                            <Remove />
                                        </el-icon></div>
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
                        }" @cell-click="(row: any, column: any, cell: any) => {
                            handleCellClick(row, column, cell, 'req')
                        }" :data="data.formData.res" border>
                        <el-table-column type="index" label="序号" width="55"></el-table-column>
                        <el-table-column label="字段" min-width="140px" prop="columnName" show-overflow-tooltip>
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnName" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="名称" show-overflow-tooltip prop="columnDescription">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnDescription" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="120px" prop="columnType">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnType" type="select" :options="typeList">
                                </EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否必填" width="120px" prop="columnRequired">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnRequired" type="select"
                                    :options="[{ label: '是', value: true }, { label: '否', value: false }]"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="示例值" show-overflow-tooltip width="140px" prop="columnExample">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnExample" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" show-overflow-tooltip prop="columnRemark">
                            <template #default="scope">
                                <EditCell :row="scope.row" prop="columnRemark" type="string"></EditCell>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140px" align="right">
                            <template #default="scope">
                                <div class="flex justify-center gap-2 items-center">
                                    <div @click="upMove(scope.row, 'res')"><el-icon>
                                            <Upload />
                                        </el-icon></div>
                                    <div @click="downMove(scope.row, 'res')"><el-icon>
                                            <Download />
                                        </el-icon></div>
                                    <div @click="addChildrenParam(scope.row, 'res')"><el-icon>
                                            <CirclePlus />
                                        </el-icon></div>
                                    <div @click="handleDelete(scope.row, 'res')"><el-icon>
                                            <Remove />
                                        </el-icon></div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="mb-8">
                    <template #header>请求示例</template>
                    <!-- <json-editor-vue class="editor" v-model="reqExample" /> -->
                    <codemirror v-model="data.formData.reqExample" placeholder="" :autofocus="true"
                        :indent-with-tab="true" :tab-size="2" :extensions="[]" />
                    <div v-if="data.requestError" class="text-red-500 mt-2 text-sm">
                        {{ data.requestError }}
                    </div>
                </el-card>
                <el-card class="mb-8">
                    <template #header>响应示例</template>
                    <codemirror v-model="data.formData.resExample" placeholder="" :autofocus="true"
                        :indent-with-tab="true" :tab-size="2" :extensions="[]" />
                    <div v-if="data.resError" class="text-red-500 mt-2 text-sm">
                        {{ data.resError }}
                    </div>
                </el-card>
                <el-card class="mb-8">
                    <template #header>SDK示例</template>
                    <codemirror v-model="data.formData.reqSdk" placeholder="" :autofocus="true" :indent-with-tab="true"
                        :tab-size="2" :extensions="[]" />
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

    ::v-deep(.cm-scroller) {
        border: 1px solid var(--el-border-color-light);
        min-height: 100px;
    }

}
</style>