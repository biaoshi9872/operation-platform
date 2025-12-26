<script setup lang="ts">
import virtualCardPackProduct_api from '@/api/virtualCardPackProduct'
import virtualCardPackProductEnum from '@/utils/constant/virtualCardPackProduct'
import SelectVirtualProductModel from './SelectVirtualProductModel.vue'
import supplier_enum from '@/utils/constant/supplier'
import { cloneDeep } from 'lodash-es'
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
    showSelectVirtualProductModel: false,
    form: {
        packageName: '',
        categoryCode: '',
        images: [],
        supplyPrice: null,
        expireDateMin: '',
        expireDateMax: '',
        receiveTimes: 1,
        remarks: '',
        markPrice: null,
        packageType: null,
        couponDetail: []
    }
})

const rules = {
    packageName: [{ required: true, message: '请输入礼包名称', trigger: 'blur' }],
    categoryCode: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
    images: [{ required: true, message: '请上传封面图', trigger: ['change', 'blur'] }],
    supplyPrice: [{ required: true, message: '请输入礼包价格', trigger: 'change' }],
    expireDateMin: [{ required: true, message: '请选择有效期开始', trigger: 'change' }],
    remarks: [{ required: true, message: '请输入礼包描述', trigger: 'change' }],
    packageType: [{ required: true, message: '请选择礼包类型', trigger: 'change' }],
    markPrice: [{ required: true, message: '请输入礼包市场价', trigger: 'change' }],
    expireDateMax: [{ required: true, message: '请选择有效期结束', trigger: 'change' }],
    receiveTimes: [{ required: true, message: '请输入兑换规则', trigger: 'change' }]
}
const formRef = ref()
const route = useRoute()
const router = useRouter()

// 判断是否为编辑模式
const isEdit = computed(() => {
    return route.query.id !== undefined
})

// 保存数据
const saveDataHandler = async (saveType: string) => {
    if (dataInfo.form.couponDetail.length === 0) {
        ElMessage.error('请至少添加一条子商品')
        return
    }
    const list = (dataInfo.form.couponDetail || []) as any[]
    const invalids = list.filter((item: any) => {
        const num = Number(item?.goodsNum)
        return !Number.isFinite(num) || !Number.isInteger(num) || num < 1
    })
    if (invalids.length) {
        const names = invalids.map((el: any, idx: number) => el?.skuName || `第${idx + 1}行`).join('、')
        ElMessage.error(`请填写子商品数量（必须为整数且≥1）：${names}`)
        return
    }
    if (!formRef.value) return
    try {
        if (saveType === '0') {
            const res = await Promise.all([
                formRef.value.validateField('packageName'),
                formRef.value.validateField('categoryCode'),
            ])
            if (!res.every(item => item === true)) return
        } else {
            await formRef.value.validate()
        }
        const payload: any = {
            ...dataInfo.form,
            saveType
        }
        let packageCode = route.query.packageCode
        if (packageCode) {
            await virtualCardPackProduct_api.A_updatePackage(payload)
        } else {
            await virtualCardPackProduct_api.A_createPackage(payload)
        }
        ElMessage.success('保存成功')
        router.back()
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}

// 如果是编辑模式，获取详情数据
const getDetail = async () => {
    const packageCode = route.query.packageCode as string
    if (!packageCode) return
    try {
        const res: any = await virtualCardPackProduct_api.A_detail({ packageCode: packageCode })
        Object.assign(dataInfo.form, res)
    } catch (error) {
        console.error('获取详情失败:', error)
        ElMessage.error('获取详情失败')
    }
}

// 在页面加载时，如果是编辑模式则获取详情
onMounted(() => {
    getDetail()
})

// 判断是否为详情模式
const isDisabled = computed(() => {
    return props.type === 'detail'
})

const saveSelectData = (val: any) => {
    dataInfo.form.couponDetail = val
    markPriceComputed()
}
const addChildProduct = () => {
    dataInfo.showSelectVirtualProductModel = true
}

const removeChildProduct = (index: number) => {
    dataInfo.form.couponDetail.splice(index, 1)
    markPriceComputed()
}
const markPriceComputed = function () {
    const list = dataInfo.form.couponDetail as any[]
    let totalPrice = list.reduce((acc, cur: any) => {
        acc += (Number(cur?.faceValue) * Number(cur?.goodsNum) || 0)
        return acc
    }, 0)
    dataInfo.form.markPrice = totalPrice.toFixed(2)
}
/**
 * 子商品数量
 */
const selectLength = computed(() => {
    const list = dataInfo.form.couponDetail as any[]
    let totalNum = list.reduce((acc, cur: any) => {
        acc += (Number(cur?.goodsNum) || 0)
        return acc
    }, 0)
    return totalNum || 0
})
const handleChange = (cur: number | undefined, prev: number | undefined) => {
    const val = Number(cur || 0)
    if (val > selectLength.value) {
        ElMessage.error('不能大于主商品数量')
        dataInfo.form.receiveTimes = selectLength.value
        return
    }
}
const radioHandleChange = (val: any) => {
    dataInfo.form.couponDetail = []
}
</script>
<template>
    <div class="virtualCardPackProduct-page">
        <div class="content">
            <el-form :model="dataInfo.form" ref="formRef" label-width="120px" :rules="rules" label-suffix=":"
                :disabled="isDisabled">
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">基本信息</div>
                    </template>
                    <el-form-item label="礼包名称" prop="packageName">
                        <el-input placeholder="请输入礼包名称" v-model="dataInfo.form.packageName" maxlength="50"
                            show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="categoryCode">
                        <ClassificationSelect class="w-full" source="vp" filterable clearable placeholder="请选择分类"
                            v-model:categoryCode="dataInfo.form.categoryCode">
                        </ClassificationSelect>
                    </el-form-item>
                    <el-form-item label="礼包封面图" prop="images">
                        <ImgUpload v-model="dataInfo.form.images" :isArray="false"
                            :acceptList="['jpg', 'jpeg', 'png', 'bmp']" :limit="1" :maxSize="5"
                            tip="文件不能超过5MB,支持扩展名：bmp,png,jpg,jpeg">
                        </ImgUpload>
                    </el-form-item>
                    <el-form-item label="礼包描述" prop="remarks" class="description_box">
                        <MyTinymce v-model="dataInfo.form.remarks" :disabled="isDisabled" :maxLength="500"></MyTinymce>
                    </el-form-item>
                    <el-form-item label="礼包类型" prop="packageName">
                        <el-radio-group v-model="dataInfo.form.packageType" @change="radioHandleChange">
                            <el-radio v-for="item in virtualCardPackProductEnum.packageTypeList" :key="item.value"
                                :label="item.value">{{
                                    item.label }}</el-radio>
                        </el-radio-group>

                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">子商品配置</div>
                    </template>
                    <div class="mb-24 ">
                        <el-button class="mb-12" v-if="!isDisabled" type="primary"
                            @click="addChildProduct">添加子商品</el-button>
                        <el-table :data="dataInfo.form.couponDetail" max-height="500">
                            <el-table-column label="商品编码" prop="skuCode"></el-table-column>
                            <el-table-column label="商品名称" prop="skuName" show-overflow-tooltip></el-table-column>
                            <el-table-column label="面值">
                                <template #default="scope">{{ scope.row.faceValue }}元</template>
                            </el-table-column>
                            <el-table-column label="产品属性">
                                <template #default="scope">{{
                                    virtualCardPackProductEnum.getGoodsAttrTitle(scope.row.rechargeType) }}</template>
                            </el-table-column>
                            <el-table-column label="税点">
                                <template #default="scope">
                                    {{ scope.row.taxRate ?? '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="发票种类">
                                <template #default="scope">
                                    {{ supplier_enum.getInvoiceType(scope.row.invoiceType) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="平台成本">
                                <template #default="scope">{{ scope.row.supplyPrice }}</template>
                            </el-table-column>
                            <el-table-column label="数量">
                                <template #default="scope">
                                    <el-input-number v-model="scope.row.goodsNum" :max="999999999" :min="1"
                                        :disabled="dataInfo.form.packageType == '1'" @change="markPriceComputed"
                                        :precision="0" :controls="false" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="120px" align="right" v-if="!isDisabled">
                                <template #default="scope">
                                    <el-button type="primary" link
                                        @click="removeChildProduct(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-form-item v-if="dataInfo.form.packageType == '0'" label="兑换规则" prop="receiveTimes">
                        <span class="mr-4">{{ selectLength }}选</span>
                        <el-input-number v-model="dataInfo.form.receiveTimes" :min="1" :precision="0" :controls="false"
                            @change="handleChange" />
                    </el-form-item>
                </el-card>
                <el-card shadow="never" class="mb-8">
                    <template #header>
                        <div class="el-card__title">价格</div>
                    </template>
                    <el-form-item label="礼包价格" prop="supplyPrice">
                        <el-input-number v-model="dataInfo.form.supplyPrice" :min="0" :max="99999999.99" :precision="2"
                            placeholder="请输入礼包价格" :controls="false" />
                        <span class="ml-8">元</span>
                    </el-form-item>
                    <el-form-item label=" 礼包市场价" prop="markPrice">
                        <el-input-number v-model="dataInfo.form.markPrice" :min="0" :max="99999999.99" :precision="2"
                            placeholder="面值*数量" :controls="false" />
                        <span class="ml-8">元</span>
                    </el-form-item>
                </el-card>
            </el-form>
        </div>
        <div class="footer" v-if="!isDisabled">
            <el-button @click="saveDataHandler('0')">保存草稿</el-button>
            <el-button @click="router.back()">取消</el-button>
            <el-button type="primary" @click="saveDataHandler('1')">保存并可用</el-button>
        </div>
    </div>
    <SelectVirtualProductModel v-model="dataInfo.showSelectVirtualProductModel" :curryInfo="dataInfo.form.couponDetail"
        :packageType="dataInfo.form.packageType" @saveData="saveSelectData" />
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
