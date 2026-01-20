<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import apiLinkProduct from '@/api/apiLinkProduct/index'
import application_api from '@/api/system/application/index'
import org_api from '@/api/system/org'
import ycb_enum from '@/utils/constant/apiLinkProduct'
import goodPool from '@/api/goodPool'
import isStateCheckHooks from '@/hooks/isStateCheckHooks'
const { isFromOrgLast, orgInfo, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()

interface IProp {
  curryInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
  curryInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()
const formRef = ref<FormInstance>() as any

interface IData {
  formData: Partial<API.T_APIShangPinGuanLianXinZengRequest & API.T_APIShangPinGuanLianXiuGaiRequest>
  formDataBK: Partial<API.T_APIShangPinGuanLianXinZengRequest & API.T_APIShangPinGuanLianXiuGaiRequest>
  formRules: any
  submitLoading: boolean
  page: any,
  orgList: any[]
  appList: any[]
  goodTypeList: any[]
  goodsList: any[],
  loading: Boolean
}
const data = reactive<IData>({
  formData: {
    orgId: undefined,
    goodsSourceId: undefined,
    appId: undefined,
    skuCode: '',
    skuName: '',
    outSkuCode: '',
    outSkuName: '',
    stockNum: null,
    branchName: '',
    jfRate: undefined,
    saleAttr: ''
  },
  formDataBK: {},
  formRules: {
    orgId: [{ required: true, message: '请选择项目', trigger: ['change', 'blur'] }],
    goodsSourceId: [{ required: true, message: '请选择商品类型', trigger: ['change', 'blur'] }],
    appId: [{ required: true, message: '请选择应用', trigger: ['change', 'blur'] }],
    skuName: [{ required: true, message: '请输入驿宝通商品名称', trigger: ['change', 'blur'] }],
    skuCode: [{ required: true, message: '请输入驿宝通商品编码', trigger: ['change', 'blur'] }],
    outSkuCode: [{ required: true, message: '请输入外部商品编码', trigger: ['change', 'blur'] }],
    branchName: [{ required: true, message: '请输入分行名称', trigger: ['change', 'blur'] }],
    stockNum: [{ required: true, message: '请输入库存数量', trigger: ['change', 'blur'] }],
    outSkuName: [{ required: true, message: '请输入外部商品名称', trigger: ['change', 'blur'] }],
    jfRate: [{ required: true, message: '请输入积分比例或费率', trigger: ['change', 'blur'] }]
  },
  page: {
    page: 1,
    limit: 1000,
    totalCount: 0
  },
  submitLoading: false,
  orgList: [],
  appList: [],
  goodTypeList: [],
  goodsList: [],
  loading: false
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
  emits('update:modelValue', false)
}

onMounted(() => {
  data.formDataBK = cloneDeep(data.formData)
})

const openHandler = () => {
  data.formData = {
    ...data.formDataBK
  }
  if (props.curryInfo?.id) {
    data.formData = {
      ...data.formData,
      ...props.curryInfo,
      saleAttr: props.curryInfo?.originalSaleAttr || ''
    }
    const keys = Object.keys(data.formData)
    nextTick(() => {
      formRef.value.clearValidate(keys)
    })
  }
  // 初始化数据
  initData()
}

const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    const api = props.curryInfo?.id ? apiLinkProduct.A_update : apiLinkProduct.A_save
    const payload: any = props.curryInfo?.id ? { ...data.formData, id: props.curryInfo.id } : { ...data.formData }
    api(payload)
      .then(() => {
        ElMessage.success('操作成功')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}

const initData = () => {
  //编辑
  if (props.curryInfo?.id) {
    getOrgList()
    orgChangeHandler(true)
    appChangeHandler(true)
    goodTypeChangeHandler(true)
  } else {
    getOrgList()
  }
}
const systemOrgId = computed(() => {
  return ['201'].includes(getSystemOptionType.value) ? orgInfo.value?.orgId : data.formData.orgId
})
/**
 * 机构详情列表
 */
const getOrgList = () => {
  org_api.A_selectList({}).then((res: any) => {
    data.orgList = res
    if (['201'].includes(getSystemOptionType.value)) {
      data.formData.orgId = systemOrgId.value
      orgChangeHandler(true)
    }
  })
}
/**
 * 机构变化
 * @param val 
 */
const orgChangeHandler = (isInit: Boolean = false) => {
  if (!isInit) {
    data.formData.appId = undefined
    data.formData.goodsSourceId = undefined
    data.formData.skuCode = null

  }
  let orgId = systemOrgId.value
  getApplicationList(orgId)
}

/**
 * 应用变化
 */
const appChangeHandler = (isInit: Boolean = false) => {
  if (!isInit) {
    data.formData.goodsSourceId = undefined
    data.formData.skuCode = null
  }
  let appId = data.formData.appId
  getApplication(appId)
}

/**
 * 
 * @param val 
 */
const changeGoods = (val: any) => {
  let item = data.goodsList.find((el: any) => el.skuCode === val)
  data.formData.skuName = item?.skuName || ''
  debugger
  data.formData.saleAttr = item?.originalSaleAttr || ''
}

const goodTypeSizeChangeHandler = (val: any) => {
  data.page.page = 1
  goodTypeChangeHandler(false)
}
/**
 * 商品类型变化
 */
const goodTypeChangeHandler = (isInit: Boolean = false) => {
  if (!isInit) {
    data.formData.skuCode = null
  }
  let goodType = data.formData.goodsSourceId
  let appId = data.formData.appId
  let orgId = systemOrgId.value
  getGoodsList(appId, orgId, goodType)
}

/**
 * 应用列表
 */
const getApplicationList = (orgId: any) => {
  let orgIdList = [orgId]
  application_api.A_list({
    orgIdList
  } as any).then((res: any) => {
    data.appList = res || []
  })
}

/**
 * 获取应用详情->商品类型
 */
const getApplication = (appId: any) => {
  application_api.A_applicationDetail({ appId }).then((res: any) => {
    data.goodTypeList = (res?.goodsSourceTypeNameList.map((el: any) => ({
      label: el.sourceName,
      value: el.id
    })) || []) //.filter((el: any) => el.value != 105)
  })
}
/**
 * 商品列表
 */
const getGoodsList = (appId: any, orgId: any, productSource: any) => {
  let obj: any = {
    appId,
    orgId,
    channelGoodsStatus: 1,
    productSource,
    goodsStatus: 1,
    limit: data.page.limit,
    page: data.page.page
  }
  data.goodsList = []
  data.loading = true
  goodPool.A_myGoodsPoolPage(obj).then((res: any) => {
    data.goodsList = res.page.records || []
    data.page.totalCount = res.page.totalRow
  }).finally(() => {
    data.loading = false
  })
}
/**
 * 项目类型
 */
const customType = computed(() => {
  debugger
  return data.appList.find((el: any) => el.id == data.formData.appId)?.customType || '0'
})

</script>
<template>
  <el-dialog v-bind="$attrs" :title="curryInfo?.id ? '编辑API商品关联' : '新增API商品关联'" class="dialog-m" append-to-body
    @open="openHandler" draggable destroy-on-close :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="120px">
        <el-form-item v-if="['101'].includes(getSystemOptionType)" label="分支机构" prop="orgId">
          <el-select v-model="data.formData.orgId" filterable clearable @change="orgChangeHandler(false)"
            placeholder="请选择分支机构">
            <el-option v-for="item in data.orgList" :key="item.id" :label="`${item.name}`" :value="item.id"
              :title="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="appId">
          <el-select v-model="data.formData.appId" @change="appChangeHandler(false)" filterable clearable
            placeholder="请选择应用">
            <el-option v-for="item in data.appList" :key="item.id" :label="`${item.appName}`" :value="item.id"
              :title="item.appName" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsSourceId">
          <el-select v-model="data.formData.goodsSourceId" @change="goodTypeChangeHandler(false)" filterable clearable
            placeholder="请选择商品类型">
            <el-option v-for="item in data.goodTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品" prop="skuCode">
          <el-select v-model="data.formData.skuCode" filterable clearable placeholder="请选择商品" @change="changeGoods">
            <el-option v-for="item in data.goodsList" :key="item.skuCode"
              :label="`${item.skuName}` + `(${item.skuCode})`" :value="item.skuCode" :title="item.skuName" />
            <template #footer v-if="data.page.totalCount >= 1000">
              <el-pagination v-model:current-page="data.page.page" :page-size="[50, 100, 200, 500]"
                v-model:page-size="data.page.limit" :size="data.page.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="data.page.totalCount"
                @size-change="goodTypeSizeChangeHandler" @current-change="goodTypeChangeHandler(false)" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="外部商品名称" prop="outSkuName">
          <el-input v-model.trim="data.formData.outSkuName" placeholder="请输入外部商品名称" maxlength="100" show-word-limit
            clearable />
        </el-form-item>
        <el-form-item label="外部商品编码" prop="outSkuCode">
          <el-input v-model.trim="data.formData.outSkuCode" placeholder="请输入外部商品编码" maxlength="100" show-word-limit
            clearable />
        </el-form-item>
        <el-form-item label="积分比例">
          <template #label>
            <Tooltip content="请填写具体的数字，在第三方平台1元等于多少积分。">积分比例</Tooltip>
          </template>
          <el-input-number v-model="data.formData.jfRate" :min="0" :max="99999999" :precision="2" :step="0.01"
            placeholder="请输入积分比例" />
        </el-form-item>
        <!-- 定制类型 0:不定制 1:库存+分行名称-->
        <template v-if="customType == 1">
          <el-form-item label="分行名称" prop="branchName">
            <el-input v-model.trim="data.formData.branchName" placeholder="请输入分行名称" maxlength="100" show-word-limit
              clearable />
          </el-form-item>
          <el-form-item label="库存" prop="stockNum">
            <el-input-number v-model="data.formData.stockNum" :min="0" :max="99999999" :precision="0" :step="1"
              placeholder="请输入库存" />
          </el-form-item>
        </template>
        <Auxiliary type="error">注意：填写外部商品名称和商品编码时，请务必填写客户平台真实准备的信息。填写错误，将影响业务正常运行！！</Auxiliary>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>