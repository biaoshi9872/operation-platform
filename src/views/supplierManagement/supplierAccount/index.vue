<script setup lang="ts">

const dataInfo = reactive({
    form: {
        "supplyName": "渠道自有供应商001",
        "companyName": "渠道自有供应商001",
        "orgId": 20,
        "taxpayerType": 1,
        "provinceId": "17",
        "cityId": "1381",
        "countyId": "50718",
        "townId": "52129",
        "address": "融创智谷C2-17",
        "contractName": "张三",
        "contractTel": "13333333333",
        "bankName": "",
        "bankBranchName": "",
        "bankAccount": "",
        "remarks": "",
        "businessScopeStart": "2022-01-01",
        businessScopeEnd: "2022-01-01",
        "qualificationAttachment": [],
        "businessScope": [1],
        "settlementType": 1,
        "invoiceType": 1,
        "supplementRemarks": ""
    }
})

const rules = {
    branchId: [{ required: true, message: '请选择所属分支机构', trigger: 'change' }],
    supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    provinceId: [{ required: true, message: '请选择省份', trigger: 'change' }],
    cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
    countyId: [{ required: true, message: '请选择区级', trigger: 'change' }],
    cooperationTime: [{ required: true, message: '请选择合作时间', trigger: 'change' }]
}
</script>
<template>
    <div>
        <el-form :model="dataInfo.form" label-width="180px" :rules="rules">
            <el-card shadow="never">
                <el-form-item label="所属分支机构" prop="orgId">
                    <OrgSelect></OrgSelect>
                </el-form-item>
                <el-form-item label="供应商名称" prop="supplyName">
                    <el-input placeholder="请输入供应商名称" v-model="dataInfo.form.supplyName" maxlength="50"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="公司名">
                    <el-input placeholder="请输入公司名" v-model="dataInfo.form.companyName" maxlength="50"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="纳税人规模" prop="supplyName">
                    <el-radio-group v-model="dataInfo.form.taxpayerType">
                        <el-radio :value="0">一般纳税人</el-radio>
                        <el-radio :value="1">小规模纳税人</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="公司地址">
                    <AddressSelect v-model:provinceId="dataInfo.form.provinceId" v-model:cityId="dataInfo.form.cityId"
                        v-model="dataInfo.form.address"></AddressSelect>
                    <el-input placeholder="请输入详细地址" type="textarea" v-model="dataInfo.form.companyName" maxlength="100"
                        show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="dataInfo.form.contractName" placeholder="请输入联系人" maxlength="50"
                        show-word-limit />
                </el-form-item>

                <el-form-item label="联系方式">
                    <el-input v-model="dataInfo.form.contractTel" placeholder="请输入11位手机号" />
                </el-form-item>

                <el-form-item label="开户银行">
                    <el-input v-model="dataInfo.form.bankName" placeholder="请输入开户银行" maxlength="50" show-word-limit />
                </el-form-item>
                <el-form-item label="所在支行">
                    <el-input v-model="dataInfo.form.bankBranchName" placeholder="请输入所在支行" maxlength="50"
                        show-word-limit />
                </el-form-item>
                <el-form-item label="银行账号">
                    <el-input v-model="dataInfo.form.bankAccount" placeholder="请输入银行账号" maxlength="30"
                        show-word-limit />
                </el-form-item>
                <el-form-item label="合作时间" required prop="cooperationTime">
                    <DatePickerRange v-model:start="dataInfo.form.businessScopeStart"
                        v-model:end="dataInfo.form.businessScopeEnd"></DatePickerRange>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="dataInfo.form.remarks" type="textarea" placeholder="请输入备注" maxlength="200"
                        show-word-limit />
                </el-form-item>
            </el-card>
            <el-card shadow="never">
                <el-form-item label="资质附件">
                    <ImgUpload v-model="dataInfo.form.qualificationAttachment" :max="1"></ImgUpload>
                </el-form-item>
            </el-card>
            <el-card shadow="never">
                <el-form-item label="经营范围">
                    <el-checkbox-group v-model="dataInfo.form.businessScope">
                        <el-checkbox label="1">1</el-checkbox>
                        <el-checkbox label="2">2</el-checkbox>
                        <el-checkbox label="3">3</el-checkbox>
                    </el-checkbox-group></el-form-item>
            </el-card>
            <el-card shadow="never">
                <el-form-item label="结算方式">
                    <el-radio-group v-model="dataInfo.form.settlementType">
                        <el-radio :value="1">1</el-radio>
                        <el-radio :value="2">2</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="发票类型">
                    <el-radio-group v-model="dataInfo.form.invoiceType">
                        <el-radio :value="1">1</el-radio>
                        <el-radio :value="2">2</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="补充说明"></el-form-item>
            </el-card>
        </el-form>
    </div>
</template>
<style lang="scss" scoped></style>
