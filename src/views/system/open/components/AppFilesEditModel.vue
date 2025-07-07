<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid';
import { EditorView, basicSetup } from "codemirror"
import { json } from "@codemirror/lang-json"
interface IProps {
    curryInfo: any,
}
const labels = withDefaults(defineProps<IProps>(), {
    curryInfo: {}
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any

const data = reactive<any>({
    formData: {
        stockNum: '',
        paramList: [],
        reqParamList: []
    },
    formDataBK: {},
    formRules: {
        stockNum: [{ required: true, message: '请输入商品数量', trigger: ['change', 'blur'] }],
    },
    curryRow: null,
    type: null,
    tableFromData: {},
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
}
const handleSubmit = () => {
    formRef.value.validate().then(() => {
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
    data.formData[type].push({
        id: uuidv4(),
        name: '',
        type: 'string',
        required: false,
        description: '',
        children: []
    })
}
const handleRowClick = (row: any, type: string) => {
    data.curryRow = row
    data.type = type
}
const addChildrenParam = (type: string) => {
    if (!data.curryRow) {
        return ElMessage.error('请选择行')
    }
    data.curryRow.children.push({
        name: '',
        id: uuidv4(),
        type: 'string',
        required: false,
        description: '',
        children: []
    })
}
const handleDelete = (row: any, type: string) => {
    if (!row) {
        return ElMessage.error('请选择行')
    }
    data.formData[type].splice(data.formData[type].indexOf(row), 1)
}

const cellMouseLeave = (row: any) => {
    if (row) {
        row.edit = false
    }
}
const cellMouseEnter = (row: any) => {
    if (row) {
        row.edit = true
    }
}
const tableRowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
    if (row.hasOwnProperty('id')) {
        //@ts-ignore
        if (data.curryRow?.id == row?.id) return 'success-row'
    } else {
        //@ts-ignore
        if (data.curryRow['customerId_index'] == rowIndex) return 'success-row'
    }
}




const view = new EditorView({
    parent: document.body,
    doc: `{"version": "9.99.99", "data": [1, 2, 3]}`,
    extensions: [basicSetup, json()]
})

</script>
<template>
    <el-drawer v-bind="$attrs" :close-on-click-modal="false" title="API文档编辑" size="60%" @closed="handleReset">
        <div class="api_container">
            <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules"
                label-position="right" label-width="100px">
                <el-card title="基础信息" class="mb-8">
                    <template #header>基础信息</template>
                    <el-form-item label="接口" prop="stockNum">
                        <el-input v-model="data.formData.stockNum" placeholder="请输入接口" maxlength="100"
                            show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="接口名称" prop="stockNum" maxlength="100" show-word-limit>
                        <el-input v-model="data.formData.stockNum"></el-input>
                    </el-form-item>
                    <el-form-item label="API说明" prop="stockNum">
                        <MyTinymce v-model="data.formData.description"></MyTinymce>
                    </el-form-item>
                </el-card>

                <el-card class="mb-8">
                    <template #header>请求参数说明</template>
                    <div class="flex justify-end mb-8">
                        <el-button type="primary" link @click="addParam('paramList')">添加参数</el-button>
                        <el-button type="primary" link @click="addChildrenParam('paramList')">添加下级参数</el-button>
                    </div>
                    <el-table style="width: 100%" row-key="id" :tree-props="{ children: 'children' }"
                        :row-class-name="tableRowClassName" @row-click="(row: any) => {
                            handleRowClick(row, 'paramList')
                        }" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter"
                        :data="data.formData.paramList">
                        <el-table-column label="" width="55"></el-table-column>
                        <el-table-column type="index" label="序号" width="55"></el-table-column>
                        <el-table-column label="名称">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-input v-else v-model="scope.row.name" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="130px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-select v-else v-model="scope.row.type" placeholder="请选择">
                                    <el-option v-for="item in typeList" :label="item.label" :value="item.value" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否必填" width="120px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-select v-else v-model="scope.row.type" placeholder="请选择">
                                    <el-option label="是" :value="1" />
                                    <el-option label="否" :value="0" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="示例值">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-input v-else v-model="scope.row.name" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-input v-else v-model="scope.row.name" maxlength="500" show-word-limit
                                    :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80px">
                            <template #default="scope">
                                <el-button type="primary" link
                                    @click="handleDelete(scope.row, 'paramList')">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="mb-8">
                    <template #header>返回参数说明</template>
                    <div class="flex justify-end mb-8">
                        <el-button type="primary" link @click="addParam('reqParamList')">添加参数</el-button>
                        <el-button type="primary" link @click="addChildrenParam('reqParamList')">添加下级参数</el-button>
                    </div>
                    <el-table style="width: 100%" row-key="id" :tree-props="{ children: 'children' }"
                        :row-class-name="tableRowClassName" @row-click="(row: any) => {
                            handleRowClick(row, 'reqParamList')
                        }" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter"
                        :data="data.formData.reqParamList">
                        <el-table-column label="" width="55"></el-table-column>
                        <el-table-column type="index" label="序号" width="55"></el-table-column>
                        <el-table-column label="名称">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-input v-else v-model="scope.row.name" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="类型" width="130px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-select v-else v-model="scope.row.type" placeholder="请选择">
                                    <el-option v-for="item in typeList" :label="item.label" :value="item.value" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否必填" width="120px">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-select v-else v-model="scope.row.type" placeholder="请选择">
                                    <el-option label="是" :value="1" />
                                    <el-option label="否" :value="0" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="示例值">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-input v-else v-model="scope.row.name" type="" maxlength="100"
                                    show-word-limit></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述">
                            <template #default="scope">
                                <div v-if="!scope.row.edit">
                                    {{ scope.row.name }}
                                </div>
                                <el-input v-else v-model="scope.row.name" maxlength="500" show-word-limit
                                    :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80px">
                            <template #default="scope">
                                <el-button type="primary" link
                                    @click="handleDelete(scope.row, 'reqParamList')">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="mb-8">
                    <template #header>请求示例</template>
                    <JsonEditor v-model="data.requestExample" @error="(err) => data.requestError = err" />
                    <div v-if="data.requestError" class="text-red-500 mt-2 text-sm">
                        {{ data.requestError }}
                    </div>
                </el-card>

                <el-card class="mb-8">
                    <template #header>响应示例</template>
                </el-card>
                <el-card class="mb-8">
                    <template #header>公共参数</template>
                    <h5>请求地址:</h5>
                    <el-table style="width: 100%">
                        <el-table-column label="环境" />
                        <el-table-column label="HTTP地址" prop="Name" />
                        <el-table-column label="HTTPS地址" prop="Address" />
                    </el-table>
                    <h5>公共请求参数:</h5>
                    <el-table style="width: 100%">
                        <el-table-column label="名称" />
                        <el-table-column label="类型" />
                        <el-table-column label="是否必填" />
                        <el-table-column label="描述" />
                    </el-table>
                    <h5>公共响应参数:</h5>
                    <el-table style="width: 100%">
                        <el-table-column label="名称" />
                        <el-table-column label="类型" />
                        <el-table-column label="描述" />
                    </el-table>
                    <h5>异常示例</h5>

                    <h5>错误说明</h5>
                    <el-table style="width: 100%">
                        <el-table-column label="错误码" prop="Date" />
                        <el-table-column label="错误信息" prop="Name" />
                        <el-table-column label="排查方法" prop="示例值" />
                    </el-table>
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
}
</style>