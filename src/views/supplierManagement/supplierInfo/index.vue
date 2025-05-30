<script setup lang="ts">
import supplierApi from '@/api/supplier'
import supplierEnum from '@/utils/constant/supplier'
import { ElMessage } from 'element-plus'

const dataInfo = reactive({
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
        "settlementRemark": ""
    }
})

const rules = {
    branchId: [{ required: true, message: '请选择所属分支机构', trigger: 'change' }],
    supplyName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    businessScope: [{ required: true, message: '请选择经营范围', trigger: 'change' }],
    cooperationStartDate: [{ required: true, message: '请选择合作开始时间', trigger: 'change' }],
    cooperationEndDate: [{ required: true, message: '请选择合作结束时间', trigger: 'change' }],
    settlementType: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
    invoiceType: [{ required: true, message: '请选择开票类型', trigger: 'change' }],
    contractTel: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
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

        const params = {
            ...dataInfo.form
        }

        // 根据是否有id判断是新增还是编辑
        const api = isEdit.value ? supplierApi.A_update : supplierApi.A_save
        await api(params)

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
        const res = await supplierApi.A_getInfo({ id })
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
const isDetail = computed(() => {
    return route.query.type === 'detail'
})
</script>
<template>
    <div class="supplier-page">
        <div class="content">
            <el-form :model="dataInfo.form" ref="formRef" label-width="120px" :rules="rules" :disabled="isDetail">
                <el-card shadow="never">
                    <template #header>
                        <div class="el-card__title">基础信息</div>
                    </template>
                    <el-form-item label="所属分支机构">
                        <OrgSelect v-model="dataInfo.form.orgId"></OrgSelect>
                    </el-form-item>
                    <el-form-item label="供应商名称" prop="supplyName">
                        <el-input placeholder="请输入供应商名称" v-model="dataInfo.form.supplyName" maxlength="50"
                            show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="公司名">
                        <el-input placeholder="请输入公司名" v-model="dataInfo.form.companyName" maxlength="50"
                            show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="纳税人规模" prop="taxpayerType">
                        <el-radio-group v-model="dataInfo.form.taxpayerType">
                            <el-radio v-for="item in supplierEnum.taxpayerScale" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="公司地址">
                        <AddressSelect v-model:provinceId="dataInfo.form.provinceId"
                            v-model:cityId="dataInfo.form.cityId" v-model:countyId="dataInfo.form.countyId"
                            v-model:townId="dataInfo.form.townId">
                        </AddressSelect>
                        <el-input class="mt-12" placeholder="请输入详细地址" type="textarea" v-model="dataInfo.form.address"
                            maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input v-model="dataInfo.form.contractName" placeholder="请输入联系人" maxlength="50"
                            show-word-limit />
                    </el-form-item>

                    <el-form-item label="联系方式" prop="contractTel">
                        <el-input v-model="dataInfo.form.contractTel" placeholder="请输入11位手机号" />
                    </el-form-item>

                    <el-form-item label="开户银行">
                        <el-input v-model="dataInfo.form.bankName" placeholder="请输入开户银行" maxlength="50"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item label="所在支行">
                        <el-input v-model="dataInfo.form.bankBranchName" placeholder="请输入所在支行" maxlength="50"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item label="银行账号">
                        <el-input v-model="dataInfo.form.bankAccount" placeholder="请输入银行账号" maxlength="30"
                            show-word-limit />
                    </el-form-item>
                    <el-form-item label="合作时间" prop="cooperationStartDate">
                        <DatePickerRange v-model:start="dataInfo.form.cooperationStartDate"
                            v-model:end="dataInfo.form.cooperationEndDate">
                        </DatePickerRange>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="dataInfo.form.remarks" type="textarea" placeholder="请输入备注" maxlength="200"
                            show-word-limit />
                    </el-form-item>
                </el-card>
                <el-card shadow="never">
                    <template #header>
                        <div class="el-card__title">资质管理</div>
                    </template>
                    <el-form-item label="资质附件">
                        <ImgUpload v-model="dataInfo.form.qualificationAttachment"
                            :fileList="dataInfo.form.qualificationAttachment"
                            :acceptList="['jpg', 'jpeg', 'png', 'bmp', 'pdf']" :limit="10" :maxSize="5"
                            tip="文件不能超过5MB,支持扩展名：bmp,png,jpg,jpeg,pdf(最多可上传10个"></ImgUpload>
                    </el-form-item>
                </el-card>
                <el-card shadow="never">
                    <template #header>
                        <div class="el-card__title">经营信息</div>
                    </template>
                    <el-form-item label="经营范围">
                        <el-checkbox-group v-model="dataInfo.form.businessScope">
                            <el-checkbox v-for="item in supplierEnum.businessScope" :key="item.value"
                                :value="item.value">
                                {{ item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-card>
                <el-card shadow="never">
                    <template #header>
                        <div class="el-card__title">结算信息</div>
                    </template>
                    <el-form-item label="结算方式" prop="settlementType">
                        <el-select v-model="dataInfo.form.settlementType" placeholder="请选择结算方式">
                            <el-option v-for="item in supplierEnum.settlementType" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发票类型" prop="invoiceType">
                        <el-checkbox-group v-model="dataInfo.form.invoiceType">
                            <el-checkbox v-for="item in supplierEnum.invoiceType" :key="item.value" :value="item.value">
                                {{ item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="补充说明">
                        <el-input v-model="dataInfo.form.settlementRemark" type="textarea" placeholder="请输入补充说明"
                            maxlength="200" show-word-limit />
                    </el-form-item>
                </el-card>
            </el-form>
        </div>
        <div class="footer" v-if="!isDetail">
            <el-button @click="router.back()">取消</el-button>
            <el-button type="primary" @click="saveDataHandler">保存</el-button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.supplier-page {
    // background: #fff;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    position: relative;

    .el-form-item {
        width: 600px;
    }

    .footer {

        text-align: center;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);

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
