<script setup lang="ts">
import Expand from '@/components/OrderCustomTable/expand';
import isStateCheckHooks from '@/hooks/isStateCheckHooks';
import { tabsStore } from '@/stores';
import { ElLink } from 'element-plus';
const { isFromOrgLast, getSystemOptionType, isFromOrgLastNoApp } = isStateCheckHooks()
const tabsStoreInfo: any = tabsStore()

interface IProp {
  orderInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
  orderInfo: {}
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

// const FIELDS = [
//   {
//     label: '售后单编号',
//     prop: 'afterSaleNo'
//   },
//   {
//     label: '申请时间',
//     prop: 'applyTime'
//   },
//   {
//     label: '订单编号',
//     prop: 'orderNo',
//     render: (row: any) => {
//       return h(ElLink, {
//         type: 'primary',
//         innerText: '查看订单详情',
//         onClick: () => {
//           toDetailHandler(row)
//         }
//       })
//     }
//   },
//   {
//     label: '渠道订单编号',
//     prop: 'channelOrderNo'
//   },
//   {
//     label: '渠道售后单编号',
//     prop: 'channelAfterSaleNo'
//   },
//   {
//     label: '第三方售后单号',
//     prop: 'thirdAfterSaleNo'
//   },
//   {
//     label: '申请人',
//     prop: 'applyUserName'
//   },
//   {
//     label: '联系电话',
//     prop: 'applyUserMobile'
//   },
//   {
//     label: '供应商',
//     prop: 'supplyName'
//   }
// ]

const FIELDS = computed(() => {
  let arr = []
  if (getSystemOptionType.value == 401) {
    arr.push({
      label: '售后单编号',
      prop: 'afterSaleNo'
    })
    arr.push({
      label: '申请时间',
      prop: 'applyTime'
    })
    arr.push({
      label: '订单编号',
      prop: 'channelOrderNo',
      render: (row: any) => {
        return h(ElLink, {
          type: 'primary',
          innerText: '查看订单详情',
          onClick: () => {
            toDetailHandler(row)
          }
        })
      }
    })
    arr.push({
      label: '申请人',
      prop: 'applyUserName'
    })
    arr.push({
      label: '联系电话',
      prop: 'applyUserMobile'
    })
  } else {
    arr.push({
      label: '售后单编号',
      prop: 'afterSaleNo'
    })
    arr.push({
      label: '申请时间',
      prop: 'applyTime'
    })
    arr.push({
      label: '订单编号',
      prop: 'orderNo',
      render: (row: any) => {
        return h(ElLink, {
          type: 'primary',
          innerText: '查看订单详情',
          onClick: () => {
            toDetailHandler(row)
          }
        })
      }
    })
    arr.push({
      label: '渠道订单编号',
      prop: 'channelOrderNo'
    })
    arr.push({
      label: '渠道售后单编号',
      prop: 'channelAfterSaleNo'
    })
    arr.push({
      label: '第三方售后单号',
      prop: 'thirdAfterSaleNo'
    })
    arr.push({
      label: '申请人',
      prop: 'applyUserName'
    })
    arr.push({
      label: '联系电话',
      prop: 'applyUserMobile'
    })
    arr.push({
      label: '供应商',
      prop: 'supplyName'
    })
  }
  return arr
})
const toDetailHandler = (row: any) => {
  tabsStoreInfo.reload({
    path: '/orderManagement/order/orderDetail',
    query: {
      channelOrderNo: row.channelOrderNo
    }
  })
}

const getTitle = computed(() => {
  return function (find: any) {
    return props.orderInfo[find.prop]
  }
})
</script>

<template>
  <div class="content_box">
    <div class="item flex" v-for="(item, index) in FIELDS" :key="index">
      <span class="item_title">{{ item.label }}:</span>
      <span class="item_value">
        {{ getTitle(item) || '-' }}
        <Expand v-if="item.render" :row="props.orderInfo" :parentRow="props.orderInfo" :render="item.render"
          :index="index" :column="item"></Expand>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_box {
  @include grid_content_box(3);
}
</style>
