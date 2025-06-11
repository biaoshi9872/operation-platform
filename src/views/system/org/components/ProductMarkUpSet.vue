<script setup lang="ts">
import org_api from '@/api/system/org';
import system_content from '@/utils/constant/system';
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash-es';
const dataInfo: any = reactive({
    goodsOrgMarkupDTOList: [],
    from: {},
    detailArr: []
})
//默认结构
const defaultPriceMark = {
    sourceName: '',
    goodsSourceId: '',
    priceMarkupType: null,
    priceMarkupStrategy: 1,
    priceMarkupStrategyValue: null,
    isDisabled: false,
    isChecked: false
}

//初始化结构
const initProductMarkUpSet = async (goodsOrgMarkupDTOList: any) => {
    dataInfo.goodsOrgMarkupDTOList = goodsOrgMarkupDTOList
    const sourceList = (await org_api.A_goodsSourceAll()).filter((el: any) => {
        return el.displayEnum != 1
    })
    let arr: any = []
    sourceList.forEach((item: any) => {
        let curry = goodsOrgMarkupDTOList.find((el: any) => {
            return el.goodsSourceId == item.id
        })
        dataInfo.from['from' + item.id] = {}
        let obj = cloneDeep(defaultPriceMark)
        obj.sourceName = item.sourceName
        obj.goodsSourceId = item.id
        //存在代表不开编辑
        if (curry && curry.priceMarkupType) {
            obj = Object.assign(obj, curry)
            obj.isDisabled = true
            obj.isChecked = true
        }
        arr.push(obj)
    })
    dataInfo.detailArr = arr
}

//校验必填
const validateInfo = () => {
    return new Promise(async (resolve, reject) => {

        let arr: any = []
        goodFormRef.value.forEach((el: any) => {
            arr.push(el.validate())
        })
        Promise.all(arr).then((res: any) => {
            resolve(true)
        }).catch((err: any) => {
            ElMessage.error('请检查可见商品及加价设置是否填写正确')
            reject(false)
        })

        let selectArr = dataInfo.detailArr.filter((el: any) => {
            return el.isChecked && el.priceMarkupType
        })
        if (!selectArr.length) {
            ElMessage.error('请至少填写一项')
            reject(false)
            return
        }
    })

}
//获取提交数据
const getSubmitData = () => {
    let data: any = []
    //1.选中且非历史
    let arr = dataInfo.detailArr.filter((el: any) => {
        return el.isChecked && !el.isDisabled
    })
    //2.正常设置价格
    arr.forEach((el: any) => {
        if (el.priceMarkupType) {
            data.push(el)
        }
    })
    return data
}


defineExpose({
    initProductMarkUpSet,
    getSubmitData,
    validateInfo
})
//复选重置
const changeHandler = (item: any) => {
    item.priceMarkupType = null
    item.priceMarkupStrategyValue = null
}
//下拉框重置
const priceMarkupTypeChange = (item: any) => {
    item.priceMarkupStrategyValue = null
}

const itemDisabled = computed(() => {
    return function (item: any) {
        if (item.isDisabled) {
            return true
        } else {
            if (item.isChecked) {
                return false
            } else {
                return true
            }
        }
    }
})
const goodFormRef: any = ref(null)
const validate = (rule: any, value: any, callback: any, item: any) => {
    if ([2, 3].includes(item.priceMarkupType) && !item.priceMarkupStrategyValue) {
        callback(new Error('请完整填写加价设置'))
    } else {
        callback()
    }
}

</script>
<template>
    <div class="markup-set-box">
        <template v-for="item in dataInfo.detailArr">
            <el-form :model="dataInfo.from['from' + item.goodsSourceId]" ref="goodFormRef">
                <div class="item">
                    <div class="checkbox-box">
                        <el-checkbox v-model="item.isChecked" @change="changeHandler(item)" :disabled="item.isDisabled">
                            {{ item.sourceName }}
                        </el-checkbox>
                    </div>
                    <div>
                        <el-form-item label="加价设置" prop="priceMarkupInfo" :rules="[
                            { validator: (rule: any, value: any, callback: any) => validate(rule, value, callback, item), trigger: ['blur', 'change'] }
                        ]">
                            <div class="markup-set-price">
                                <el-select class="select-box" v-model="item.priceMarkupType"
                                    :disabled="itemDisabled(item)" placeholder="请选择"
                                    @change="priceMarkupTypeChange(item)">
                                    <el-option v-for="item in system_content.priceMarkupType" :label="item.label"
                                        :key="item.value" :value="item.value"></el-option>
                                </el-select>
                                <div class="input-box" v-if="item.priceMarkupType != 1">
                                    <el-input-number v-model="item.priceMarkupStrategyValue" :controls="false"
                                        max="99999999.999" min="0" :precision="2" :disabled="itemDisabled(item)">
                                    </el-input-number>
                                    <el-select class="w-70" v-model="item.priceMarkupStrategy"
                                        :disabled="itemDisabled(item)" placeholder="请选择">
                                        <el-option v-for="item in system_content.priceMarkupStrategy"
                                            :label="item.label" :key="item.value" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </template>
    </div>
</template>



<style lang="scss" scoped>
.markup-set-box {
    width: 100%;
    background-color: var(--el-bg-color-page);
    padding: 8px 12px;

    .item {
        display: flex;
        margin-bottom: 24px;

        .checkbox-box {
            min-width: 130px;
            margin-right: 12px;
        }

        .markup-set-price {
            display: flex;
        }

        .select-box {
            width: 130px;
            margin-right: 12px;
        }


    }

}
</style>
