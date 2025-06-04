<script setup lang="ts" name="AddressSelect">
import systemUtils_api from '@/api/system/systemUtils'

defineOptions({
  name: 'AddressSelect'
})

interface IProp {
  provinceId: string
  provinceName: string
  cityId: string
  cityName: string
  countyId: string
  countyName: string
  townId: string
  townName: string
  openStreet: boolean,

}

const props = withDefaults(defineProps<IProp>(), {
  provinceId: '',
  cityId: '',
  countyId: '',
  townId: '',
  openStreet: false
})

interface IDictInfo {
  districtId: string
  name: string
}

const data = reactive({
  provinceList: [] as IDictInfo[],
  cityList: [] as IDictInfo[],
  areaList: [] as IDictInfo[],
  streeList: [] as IDictInfo[]
})

const emits = defineEmits([
  'update:provinceId',
  'update:provinceName',
  'update:cityId',
  'update:cityName',
  'update:countyId',
  'update:countyName',
  'update:townId',
  'update:townName'
])

//省
const provinceValue = computed({
  get() {
    return props.provinceId
  },
  set(val) {
    emits('update:cityId', '')
    emits('update:countyId', '')
    emits('update:townId', '')
    emits('update:provinceId', val)
  }
})

//市
const cityValue = computed({
  get() {
    return props.cityId
  },
  set(val) {
    emits('update:countyId', '')
    emits('update:townId', '')
    emits('update:cityId', val)
  }
})

//区
const areaValue = computed({
  get() {
    return props.countyId
  },
  set(val) {
    emits('update:townId', '')
    emits('update:countyId', val)
  }
})

//街道
const streetValue = computed({
  get() {
    return props.townId
  },
  set(val) {
    emits('update:townId', val)
  }
})

onMounted(() => {
  getProvinceList()
})

//省
const getProvinceList = () => {
  systemUtils_api.A_address({ source: 1, channelId: '', type: 1 }).then(({ districtList }: any) => {
    data.provinceList = districtList.map((el => {
      return {
        ...el,
        districtId: Number.parseInt(el.districtId),
        name: el.name
      }
    })) as any
  })
}

//市
const getCityList = () => {
  const { provinceId } = props
  provinceId &&
    systemUtils_api.A_address({ source: 1, channelId: provinceId, type: 2 }).then(({ districtList }: any) => {
      data.cityList = districtList.map((el => {
        return {
          ...el,
          districtId: Number.parseInt(el.districtId),
          name: el.name
        }
      })) as any
    })
}

//区
const getAreaList = () => {
  const { cityId } = props
  cityId &&
    systemUtils_api.A_address({ source: 1, channelId: cityId, type: 3 }).then(({ districtList }: any) => {
      data.areaList = districtList.map((el => {
        return {
          ...el,
          districtId: Number.parseInt(el.districtId),
          name: el.name
        }
      })) as any
    })
}

const getStreetList = () => {
  const { countyId } = props
  countyId &&
    systemUtils_api.A_address({ source: 1, channelId: countyId, type: 4 }).then(({ districtList }: any) => {
      data.streeList = districtList as any
    })
}

watch(provinceValue, (newValue, oldValue) => {
  if (newValue) {
    getCityList()
  }
})

watch(cityValue, (newValue, oldValue) => {
  if (newValue) {
    getAreaList()
  }
})

watch(areaValue, (newValue, oldValue) => {
  if (newValue) {
    getStreetList()
  }
})

const validate = () => {
  return new Promise((resolve, reject) => {
    if (provinceValue.value && cityValue.value && areaValue.value) {
      const checkStreetValue = data.streeList.length ? streetValue.value : true
      if (!checkStreetValue) {
        return reject('请选择街道')
      }
      return resolve(true)
    } else {
      return reject('请选择省市区!')
    }
  })
}

const initData = () => {
  getCityList()
  getAreaList()
  getStreetList()
}

defineExpose({
  validate,
  initData
})

const getLabelName = (val: any, dataListName: any, type: string) => {
  let event = ('update:' + type) as any
  let name = data?.[dataListName]?.find((item: any) => item.districtId === val).name
  emits(event, name)
}
</script>
<template>
  <el-select v-model="provinceValue" placeholder="省" class="w-150"
    @change="($event: any) => getLabelName($event, 'provinceList', 'provinceName')">
    <el-option v-for="item in data.provinceList" :key="item.districtId" :label="item.name"
      :value="item.districtId"></el-option>
  </el-select>

  <el-select v-if="provinceValue" v-model="cityValue" class="w-150" placeholder="市"
    @change="($event: any) => getLabelName($event, 'cityList', 'cityName')">
    <el-option v-for="item in data.cityList" :key="item.districtId" :label="item.name"
      :value="item.districtId"></el-option>
  </el-select>
  <el-select v-if="cityValue" v-model="areaValue" class="w-150" placeholder="区"
    @change="($event: any) => getLabelName($event, 'areaList', 'countyName')">
    <el-option v-for="item in data.areaList" :key="item.districtId" :label="item.name"
      :value="item.districtId"></el-option>
  </el-select>
  <el-select v-if="areaValue && openStreet" v-model="streetValue" placeholder="街道" class="w-150"
    @change="($event: any) => getLabelName($event, 'streeList', 'townName')">
    <el-option v-for="item in data.streeList" :key="item.districtId" :label="item.name"
      :value="item.districtId"></el-option>
  </el-select>
</template>
<style lang="scss" scoped></style>
