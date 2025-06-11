<script setup lang="ts">
import goods_api from '@/api/goods'
import restrictedSalesArea_api from '@/api/restrictedSalesArea'
import { tabsStore } from '@/stores'
import MyDecimal from '@/utils/decimal'
import { ElMessage } from 'element-plus'
import TaxCodeCell from './TaxCodeCell.vue'

const $useRote = useRoute()
const tabsStoreInfo: any = tabsStore()
const $route = useRoute()
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
    saveLoading: false,
    saveUpLoading: false,
    templateList: [],
    form: {
        submitType: 1,
        "id": null,
        "goodsType": null,
        "categoryCode": "",
        "skuCode": "",
        "skuName": "",
        "brand": "",
        "unit": "",
        "images": [],
        imagesList: [],
        firstCateId: '',
        secondCateId: '',
        thirdCateId: '',
        "refundStatus": 1,
        "description": "",
        "markPrice": null,
        "taxPurchaseCost": null,
        "noTaxPurchaseCost": null,
        "stock": null,
        "invoiceType": null,
        "taxCode": "",
        "taxRate": null,
        "taxPrice": null,
        "limitSaleFlag": 0,
        "limitTemplateId": null
    }
})

const rules = {
    skuCode: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
    skuName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
    unit: [{ required: true, message: '请输入销售单位', trigger: 'blur' }],
    images: [{ required: true, message: '请上传商品图片', trigger: 'change' }],
    description: [{ required: true, message: '请输入商品详情', trigger: 'blur' }],
    markPrice: [{ required: true, message: '请输入市场价', trigger: 'blur' }],
    taxPurchaseCost: [{ required: true, message: '请输入含税供货价', trigger: 'blur' }],
    noTaxPurchaseCost: [{ required: true, message: '请输入不含税供货价', trigger: 'blur' }],
    stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
    refundStatus: [{ required: true, message: '请选择退货状态', trigger: 'change' }],
    invoiceType: [{ required: true, message: '请选择发票类型', trigger: 'change' }],
    taxCode: [{ required: true, message: '请输入税收编码', trigger: 'blur' }],
    taxRate: [{ required: true, message: '请选择税率', trigger: 'change' }],
    limitSaleFlag: [{ required: true, message: '请选择商品是否限售', trigger: 'change' }],
    limitTemplateId: [{ required: true, message: '请选择限售模板', trigger: 'change' }]
}
const formRef = ref()
const route = useRoute()
const router = useRouter()

// 判断是否为编辑模式
const isEdit = computed(() => {
    return props.type == 'add'
})

// 保存数据
const saveDataHandler = async () => {
    formRef.value.validate().then(async () => {
        dataInfo.saveLoading = true
        const obj = dataInfo.form
        obj.submitType = 1
        const api = dataInfo.form.id ? goods_api.A_update : goods_api.A_save
        api({ ...obj }).then((res) => {
            ElMessage.success('保存成功')
            toListHandler()
        }).finally(() => {
            dataInfo.saveLoading = false
        })
    })
}
const saveDataHandlerUp = async () => {
    formRef.value.validate().then(async () => {
        dataInfo.saveUpLoading = true
        const obj = dataInfo.form
        obj.submitType = 2
        const api = dataInfo.form.id ? goods_api.A_update : goods_api.A_save
        api({ ...obj }).then((res) => {
            ElMessage.success('保存成功')
            toListHandler()
        }).finally(() => {
            dataInfo.saveUpLoading = false
        })
    })
}


onMounted(() => {
    initData()
})

const initData = () => {
    getTemplateList()
    getDetailInfo()
}

const getDetailInfo = () => {
    const skuCode = route.query.skuCode
    if (skuCode) {
        goods_api.A_getDetail(skuCode).then((res: any) => {
            dataInfo.form = res
        })
    }
}
const getTemplateList = () => {
    restrictedSalesArea_api.A_allList().then((res: any) => {
        dataInfo.templateList = res?.page?.records || [] as any
    })
}
const verifyHandler = async (field: string) => {
    if (!formRef.value) return
}

const addTemplateHandler = () => {
    router.push({
        path: '/system/restrictedSalesArea/index',
        query: {
            type: 'edit'
        }
    })
}

// 监听含税供货价和税率变化，计算不含税供货价
watch(
    [() => dataInfo.form.taxPurchaseCost, () => dataInfo.form.taxRate],
    (newValue) => {
        if (newValue) {
            const computedTax = (dataInfo.form.taxRate === -1 ? 0 : dataInfo.form.taxRate) || 0
            const taxPrice = new MyDecimal(newValue[0])
            const taxRateNum = new MyDecimal(1).add((new MyDecimal(computedTax).div(new MyDecimal(100))))
            const noTaxPurchaseCost = taxPrice.mul(taxRateNum).toFixed(2) as any
            dataInfo.form.noTaxPurchaseCost = noTaxPurchaseCost
        }
    }
)
const toListHandler = () => {
    tabsStoreInfo.close($useRote, {
        path: '/supplierManagement/commodity/list'
    })
}

</script>

<template>
    <div class="supplier-page">
        <div class="content">
            <el-form :model="dataInfo.form" ref="formRef" label-width="120px" :rules="rules" :disabled="!isEdit">
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">基础信息</div>
                    </template>
                    <el-form-item label="商品编码" prop="skuCode" required>
                        <el-input v-model="dataInfo.form.skuCode" maxlength="20" show-word-limit
                            placeholder="商品编码需由字母+数字组成，至少6个字符，最大20个字符。" />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="skuName" required>
                        <el-input v-model="dataInfo.form.skuName" maxlength="50" placeholder="请输入商品名称"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item label="品牌" prop="brand" required>
                        <el-input v-model="dataInfo.form.brand" maxlength="30" show-word-limit />
                    </el-form-item>
                    <el-form-item label="分类" prop="categoryCode" required>
                        <ClassificationSelect v-model:firstCateId="dataInfo.form.firstCateId"
                            v-model:secondCateId="dataInfo.form.secondCateId"
                            v-model:thirdCateId="dataInfo.form.thirdCateId"
                            v-model:categoryCode="dataInfo.form.categoryCode">
                        </ClassificationSelect>
                    </el-form-item>
                    <el-form-item label="销售单位" prop="unit" required>
                        <el-input v-model="dataInfo.form.unit" maxlength="10" show-word-limit />
                    </el-form-item>
                    <el-form-item label="商品图片" prop="images" required>
                        <ImgUpload v-model="dataInfo.form.images" :fileList="dataInfo.form.imagesList" :isArray="true"
                            :acceptList="['jpg', 'jpeg', 'png', 'bmp', 'pdf']" :limit="5" :maxSize="2"
                            tip="必填，最多上传5张图片，建议尺寸800*800px，单张图片大小不超过2M"></ImgUpload>
                    </el-form-item>
                    <el-form-item label="退货状态" prop="refundStatus" required>
                        <el-radio-group v-model="dataInfo.form.refundStatus">
                            <el-radio :label="1">支持7天退换货</el-radio>
                            <el-radio :label="2">不支持7天退换货</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">商品详情</div>
                    </template>
                    <el-form-item label="详情" prop="description" class="description_box" required>
                        <MyTinymce v-model="dataInfo.form.description" @verify="() => {
                            verifyHandler('baseInfoDto.description')
                        }
                        " :readonly="!isEdit"></MyTinymce>
                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">价格与库存</div>
                    </template>
                    <el-form-item label="市场价" prop="markPrice" required>
                        <el-input-number v-model="dataInfo.form.markPrice" :controls="false" :min="0" :precision="2"
                            :step="0.1" />
                    </el-form-item>
                    <el-form-item label="含税供货价" prop="taxPurchaseCost" required>
                        <el-input-number v-model="dataInfo.form.taxPurchaseCost" :controls="false" :min="0"
                            :precision="2" :step="0.1" />
                    </el-form-item>
                    <el-form-item label="不含税供货价" prop="noTaxPurchaseCost" required>
                        <el-input-number v-model="dataInfo.form.noTaxPurchaseCost" :controls="false" :min="0"
                            :precision="2" :step="0.1" disabled />
                    </el-form-item>
                    <el-form-item label="库存数量" prop="stock" required>
                        <el-input-number v-model="dataInfo.form.stock" :controls="false" :min="0" :precision="0" />
                    </el-form-item>
                </el-card>

                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">财务信息</div>
                    </template>
                    <TaxCodeCell :form="dataInfo.form"></TaxCodeCell>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">限售信息</div>
                    </template>
                    <el-form-item label="商品不可售地区" prop="limitSaleFlag" required>
                        <el-radio-group v-model="dataInfo.form.limitSaleFlag">
                            <el-radio :label="1">限制</el-radio>
                            <el-radio :label="0">不限制</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择模板" prop="limitTemplateId" required v-if="dataInfo.form.limitSaleFlag === 1">
                        <div class="limitTemplate-box">
                            <el-select class="w-200" v-model="dataInfo.form.limitTemplateId">
                                <el-option v-for="item in dataInfo.templateList" :label="item.templateName"
                                    :value="item.id" />
                            </el-select>
                            <el-button type="primary" @click="addTemplateHandler">新建模板</el-button>
                        </div>
                    </el-form-item>
                </el-card>
            </el-form>
        </div>
        <div class="footer">
            <el-card shadow="never" class="mb-8">
                <el-button type="primary" :loading="dataInfo.saveLoading" @click="saveDataHandler">保存草稿</el-button>
                <el-button type="primary" :loading="dataInfo.saveUpLoading" @click="saveDataHandlerUp">提交并上架</el-button>
                <el-button @click="toListHandler">取消</el-button>
            </el-card>
        </div>
    </div>
</template>

<style scoped lang="scss">
.supplier-page {
    //position: relative;
    height: calc(100vh - 120px);
    overflow: auto;

    .el-form-item {
        width: 600px;
    }

    .description_box {
        width: 100% !important;
    }

    .el-input-number {
        position: relative;
        display: inline-flex;
        /* width: 150px; */
        line-height: 30px;
        vertical-align: middle;
        flex: 1;
    }

    .content {
        // margin-bottom: 110px;
    }

    .footer {
        text-align: center;
        position: sticky;
        bottom: 0;
        width: 100%;
        z-index: 999;

        .el-button {
            margin: 0 10px;
        }
    }

    .el-card__title {
        font-size: 18px;
        color: var(--el-color-primary);
    }

    .upload-tip {
        color: #999;
        font-size: 12px;
        margin-top: 8px;
    }

    .limitTemplate-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 12px;
        padding-bottom: 00px;
    }
}
</style>
