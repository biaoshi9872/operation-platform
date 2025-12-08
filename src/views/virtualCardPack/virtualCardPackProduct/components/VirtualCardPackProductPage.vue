<script setup lang="ts">
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import virtualCardPackProductEnum from '@/utils/constant/virtualCardPackProduct'
import SelectVirtualProductModel from './SelectVirtualProductModel.vue'

import { ElMessage } from 'element-plus';
interface IProp {
    type: string
}
const props = withDefaults(defineProps<IProp>(), {
    type: 'add'
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()
const dataInfo = reactive({
    showSelectVirtualProductModel: true,
    form: {
        "supplyName": "",
        "companyName": "",
        "orgId": null,
        "taxpayerType": 1, // 设置默认值为一般纳税人
        "provinceId": "",
        "cityId": "",
        "countyId": "",
        "townId": "",
        "address": "",
        "contractName": "",
        "contractTel": "",
        "bankName": "",
        "bankBranchName": "",
        "bankAccount": "",
        "remarks": "",
        "cooperationStartDate": "",
        "cooperationEndDate": "",
        "qualificationAttachment": [],
        "businessScope": [],
        "settlementType": "", // 修改为空字符串作为初始值
        "invoiceType": [], // 修改为数组类型
        "supplementRemarks": ""
    }
})

const rules = {
    supplyName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
}
const formRef = ref()
const route = useRoute()
const router = useRouter()

// 判断是否为编辑模式
const isEdit = computed(() => {
    return route.query.id !== undefined
})

// 保存数据
const saveDataHandler = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        // const { provinceId, cityId, countyId, townId } = dataInfo.form
        // const params = {
        //     ...dataInfo.form,
        //     provinceId: provinceId || null,
        //     cityId: cityId || null,
        //     countyId: countyId || null,
        //     townId: townId || null
        // }
        // // 根据是否有id判断是新增还是编辑
        // const api = isEdit.value ? supplierApi.A_update : supplierApi.A_save
        // await api(params)

        ElMessage.success('保存成功')
        // 保存成功后返回列表页
        router.back()
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}

// 如果是编辑模式，获取详情数据
const getDetail = async (id: string | number) => {
    try {
        const res = await virtualCardPackProduct_api.A_getInfo({ id })
        Object.assign(dataInfo.form, res)
    } catch (error) {
        console.error('获取详情失败:', error)
        ElMessage.error('获取详情失败')
    }
}

// 在页面加载时，如果是编辑模式则获取详情
onMounted(() => {
    if (isEdit.value && route.query.id) {
        getDetail(route.query.id)
    }
})

// 判断是否为详情模式
const isDisabled = computed(() => {
    return props.type === 'detail'
})



</script>
<template>
    <div class="virtualCardPackProduct-page">
        <div class="content">
            <el-form :model="dataInfo.form" ref="formRef" label-width="120px" :rules="rules" :disabled="isDetail">
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">基本信息</div>
                    </template>
                    <el-form-item label="礼包名称" prop="supplyName">
                        <el-input placeholder="请输入礼包名称" v-model="dataInfo.form.supplyName" maxlength="50"
                            show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <ClassificationSelect class="w-full" v-model:firstCateId="dataInfo.form.firstCateId"
                            v-model:secondCateId="dataInfo.form.secondCateId"
                            v-model:thirdCateId="dataInfo.form.thirdCateId" filterable clearable placeholder="请选择分类"
                            v-model:categoryCode="dataInfo.form.categoryCode">
                        </ClassificationSelect>
                    </el-form-item>
                    <el-form-item label="礼包封面图" prop="taxpayerType">
                        <ImgUpload v-model="dataInfo.form.qualificationAttachment"
                            :fileList="dataInfo.form.qualificationAttachment"
                            :acceptList="['jpg', 'jpeg', 'png', 'bmp']" :limit="1" :maxSize="5"
                            tip="文件不能超过5MB,支持扩展名：bmp,png,jpg,jpeg">
                        </ImgUpload>
                    </el-form-item>
                    <el-form-item label="礼包描述" class="description_box">
                        <MyTinymce v-model="dataInfo.form.description" @verify="() => {
                            verifyHandler('baseInfoDto.description')
                        }
                        " :readonly="isDisabled"></MyTinymce>
                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">子商品配置</div>
                    </template>
                    <div class="mb-24 ">
                        <el-button class="mb-12" type="primary">添加子商品</el-button>
                        <el-table>
                            <el-table-column label="商品编码"></el-table-column>
                            <el-table-column label="商品名称" show-overflow-tooltip></el-table-column>
                            <el-table-column label="面值">
                                <template #default="scope">
                                    {{ scope.row.faceValue }}元
                                </template>
                            </el-table-column>
                            <el-table-column label="产品属性">
                                <template #default="scope">
                                    {{ virtualCardPackProductEnum.virtualCardPackProductType[scope.row.settlementType]
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column label="有效期">
                                <template #default="scope">

                                </template>
                            </el-table-column>
                            <el-table-column label="税点">
                                <template #default="scope">
                                    {{ scope.row.taxRate }}
                                </template>
                            </el-table-column>
                            <el-table-column label="发票种类">
                                <template #default="scope">
                                    {{ scope.row.invoiceType }}
                                </template>
                            </el-table-column>
                            <el-table-column label="平台成本">
                                <template #default="scope">
                                    {{ scope.row.invoiceType }}
                                </template>
                            </el-table-column>
                            <el-table-column label="数量">
                                <template #default="scope">
                                    <el-input-number v-model="scope.row.quantity" :min="0" :max="99999999"
                                        :precision="0" :controls="false" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-button type="danger">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-form-item label="兑换规则:">
                        <span class="mr-8">1选</span>
                        <el-input-number v-model="dataInfo.form.marketPrice" :min="0" :precision="0"
                            :controls="false" />
                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">价格</div>
                    </template>
                    <el-form-item label="礼包价格" prop="settlementType">
                        <el-input-number v-model="dataInfo.form.price" :min="0" :max="99999999.99" :precision="2"
                            :controls="false" />
                        <span class="ml-8">元</span>
                    </el-form-item>
                    <el-form-item label="礼包市场价" prop="invoiceType">
                        <el-input-number v-model="dataInfo.form.marketPrice" :min="0" :max="99999999.99" :precision="2"
                            :controls="false" />
                        <span class="ml-8">元</span>
                    </el-form-item>

                </el-card>
            </el-form>
        </div>
        <div class="footer" v-if="!isDisabled">
            <el-button @click="router.back()">保存草稿</el-button>
            <el-button @click="router.back()">取消</el-button>
            <el-button type="primary" @click="saveDataHandler">创建并可用</el-button>
        </div>
    </div>
    <SelectVirtualProductModel v-model="dataInfo.showSelectVirtualProductModel" />
</template>
<style scoped lang="scss">
.virtualCardPackProduct-page {

    height: calc(100vh - 110px);
    overflow: auto;

    .description_box {
        width: 100% !important;
    }

    .el-form-item {
        width: 600px;
    }

    .footer {
        position: sticky;
        bottom: 0;
        width: 100%;
        z-index: 999;
        background: #fff;
        box-shadow: 0 0 2px #ccc;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;

        .el-button {
            margin: 0 10px;
        }
    }

    .el-card__title {
        font-size: 18px;
        color: var(--el-color-primary);
    }
}
</style>
