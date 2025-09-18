<script setup lang="ts">
import goods_api from '@/api/goods'
import application_api from '@/api/system/application'
import system_enum from '@/utils/constant/system'
import { validateEmail, validatePhone } from '@/utils/validator'
import { ElMessage, FormInstance } from 'element-plus'
import { isNullOrUnDefOrisEmpty } from '@/utils/is'
import systemUtils_api from '@/api/system/systemUtils'
import { cloneDeep } from 'lodash-es'
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
  formData: any
  formDataBK: any
  formRules: any
  goodsTypeList: any[]
  tableFromData: any
  submitLoading: boolean
}
const data = reactive<IData>({
  formData: {
    appName: '',
    goodsSourceTypeCodeList: [],
    appProfitModelDTOList: [],
    orgId: '',
    projectNo: '',
    projectType: '',
    isSupportMask: false,
    vpOderCallBackUrl: '',
    developerEmail: '',
    developerPhone: ''
  },
  goodsTypeList: [],
  formDataBK: {},
  formRules: {
    appName: [{ required: true, message: '请输入应用名称', trigger: ['change', 'blur'] }],
    goodsSourceTypeCodeList: [{ required: true, message: '请选择可见商品类型', trigger: ['change', 'blur'] }],
    orgId: [{ required: true, message: '请选择分支机构', trigger: ['change', 'blur'] }],
    projectNo: [{ required: true, message: '请输入综管项目编号', trigger: ['change', 'blur'] }],
    projectType: [{ required: true, message: '请选择项目类型', trigger: ['change', 'blur'] }],
    isSupportMask: [{ required: true, message: '请选择是否支持脱敏', trigger: ['change', 'blur'] }],
    developerEmail: [
      { required: true, message: '请输入开发者邮箱', trigger: ['change', 'blur'] },
      {
        validator: validateEmail,
        trigger: 'blur'
      }
    ],
    developerPhone: [
      { required: true, message: '请输入开发者手机', trigger: ['change', 'blur'] },
      {
        validator: validatePhone,
        trigger: 'blur'
      }
    ]
  },
  tableFromData: {},
  submitLoading: false
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
  data.goodsTypeList = []
  if (props.curryInfo?.id) {
    getDetail()
  }
}

const getDetail = () => {
  let appId = props.curryInfo?.id
  application_api.A_applicationDetail({ appId }).then((res: any) => {
    data.formData = {
      ...data.formDataBK,
      ...res,
      goodsSourceTypeCodeList: res?.goodsSourceTypeCodeList?.split(',').map((el: any) => Number(el))
    }
  })
}
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    data.submitLoading = true
    let goodsSourceTypeCodeList = data.formData.goodsSourceTypeCodeList.join(',')
    let appProfitModelDTOList = data.formData.goodsSourceTypeCodeList.map((el: any) => {
      let objInfo = data.goodsTypeList.find((item: any) => item.source == el) || {}
      return {
        source: el,
        profitModel: objInfo.profitModel,
        discountRate: objInfo.discountRate,
      }
    })
    application_api
      .A_save({ ...data.formData, goodsSourceTypeCodeList, appProfitModelDTOList, id: props.curryInfo?.id || null })
      .then(() => {
        ElMessage.success('操作成功!')
        handleClose()
      })
      .finally(() => {
        data.submitLoading = false
      })
  })
}
const title = computed(() => {
  return props.curryInfo?.id ? '编辑应用' : '新增应用'
})

watch(
  () => data.formData.orgId,
  val => {
    if (val) {
      getGoodTypeList()
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const goodsSourceChangeHandler = (val: any) => {
  if (!val.includes(104)) {
    data.formData.isSupportMask = null
  }
}
const changeHandler = () => {
  data.formData.goodsSourceTypeCodeList = []
}
const getGoodTypeList = () => {
  goods_api.A_goodsSourceByOrg({ orgId: data.formData.orgId }).then((res: any) => {
    data.goodsTypeList = res.map((item: any) => {
      const info = data.formData.appProfitModelDTOList.find((el: any) => el.source == item.id) || {}
      return {
        ...item,
        source: item.id,
        profitModel: info.profitModel ?? null,
        discountRate: info.discountRate ?? null,
      }
    })
    //自动添加
    if (data.goodsTypeList.find((el: any) => el.source == 105) && !data.formData.goodsSourceTypeCodeList.some((el: any) => el == 105)) {
      data.formData.goodsSourceTypeCodeList.push(105)
    }
  })
}

const profitModelValidate = (rule: any, value: any, callback: any, item: any) => {
  if (data.formData.goodsSourceTypeCodeList.includes(item.source)) {
    if (isNullOrUnDefOrisEmpty(item.profitModel)) {
      return callback(new Error('请填写完整信息'))
    } else {
      if (item.profitModel == '1') {
        if (isNullOrUnDefOrisEmpty(item.discountRate)) {
          return callback(new Error('请填写完整信息'))
        }
        return callback()
      }
    }
    return callback()
  } else {
    return callback()
  }
}

const blurHandler = () => {
  if (data.formData.projectNo) {
    return systemUtils_api
      .A_getProjectInfo({ projectNo: data.formData.projectNo })
      .then((res: any) => {
        return true
      }).catch(() => {
        data.formData.projectNo = ''
      })
  }
}
</script>
<template>
  <el-dialog v-bind="$attrs" :title="title" width="750px" append-to-body @open="openHandler" draggable destroy-on-close
    :close-on-click-modal="false" @closed="handleReset">
    <div class="option">
      <el-form ref="formRef" :model="data.formData" label-suffix=":" :rules="data.formRules" label-position="right"
        label-width="140px">
        <el-form-item label="分支机构" prop="orgId">
          <OrgSelect :disabled="props.curryInfo?.id" v-model="data.formData.orgId" :multiple="false"
            @change="changeHandler"></OrgSelect>
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="data.formData.appName" placeholder="请输入应用名称" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="综管项目编号" prop="projectNo">
          <el-input v-model="data.formData.projectNo" placeholder="请输入综管项目编号" @blur="blurHandler" maxlength="50"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="data.formData.projectType" placeholder="请选择">
            <el-option v-for="item in system_enum.projectType" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发者邮箱" prop="developerEmail">
          <el-input v-model="data.formData.developerEmail" placeholder="请输入开发者邮箱" maxlength="50"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="开发者手机" prop="developerPhone">
          <el-input v-model="data.formData.developerPhone" placeholder="请输入开发者手机" maxlength="11"
            show-word-limit></el-input>
        </el-form-item>
        <el-form-item v-if="data.goodsTypeList.length" label="可见商品类型" prop="goodsSourceTypeCodeList">
          <el-checkbox-group v-model="data.formData.goodsSourceTypeCodeList" @change="goodsSourceChangeHandler">
            <div class="el-checkbox-group-box">
              <el-checkbox v-for="item in data.goodsTypeList" :disabled="item.displayEnum == 1" :label="item.sourceName"
                :value="item.id">
                <el-form-item :prop="'goodsTypeList' + item.id" :rules="[
                  {
                    required: true, message: '请填写必填选项',
                    validator: (rule, value, callback) => {
                      return profitModelValidate(rule, value, callback, item)
                    },
                    trigger: ['blur', 'change']
                  }
                ]">
                  <div class="content">
                    <span class="title1">{{ item.sourceName }}</span>
                    <span class="title2">盈利模式</span>
                    <div>
                      <el-select class="w-150 title3" v-model="item.profitModel" placeholder="请选择">
                        <el-option key="1" label="扣点" :value="1">
                        </el-option>
                        <el-option v-if="item.source !== 105" key="2" label="赚差价" :value="2">
                        </el-option>
                      </el-select>
                    </div>
                    <div v-if="item.profitModel == '1'">
                      <el-input-number class="w-150 title4" v-model="item.discountRate" :controls="false" :min="0"
                        :max="99999999.99" />
                      <span class="ml-4 color-#999999">%</span>
                    </div>
                  </div>
                </el-form-item>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="data.formData.goodsSourceTypeCodeList?.includes(104)" label="是否支持脱敏" prop="isSupportMask">
          <template #label>
            <Tooltip content="选择“是”，则API商品池仅展示支持脱敏的驿宝通精选商品;反之，则展示全量驿宝通精选商品。">是否支持脱敏</Tooltip>
          </template>
          <el-radio-group v-model="data.formData.isSupportMask">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="虚拟下单回调地址" prop="vpOderCallBackUrl" :rules="data.formData.goodsSourceTypeCodeList?.includes(106) ? [{
          required: true, message: '请输入虚拟下单回调地址', trigger: ['blur', 'change']
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value && !/^https?:\/\/.+/.test(value)) {
              callback(new Error('回调地址必须以http://或https://开头'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change']
        }
        ] : []">
          <el-input v-model="data.formData.vpOderCallBackUrl" placeholder="请输入虚拟下单回调地址">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="mr-10">取消</el-button>
        <el-button type="primary" :loading="data.submitLoading" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
::v-deep(.el-checkbox-group) {
  width: 100%;
}

.el-checkbox-group-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #F7F8FA;
  padding: 24px 8px;
  padding-bottom: 0;

  ::v-deep(.el-checkbox) {
    border-bottom: 1px dashed #E5E5E5;
    padding-bottom: 32px !important;
    margin-bottom: 32px !important;
  }

  ::v-deep(.el-checkbox__label) {
    display: flex;
    flex: 1;

    .content {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 4px;

      .title1 {
        min-width: 100px;
      }

      .title2 {
        width: 70px;
        color: #999999;
      }
    }
  }
}
</style>