import { useUserStore } from '@/stores'
import { decrypted, strDecodeURIComponent } from '@/utils/encrypt'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type TisStateCheckHooks = {
  isErpAccount: boolean
  purchaseCostName: any
  isCombinationGoods: any
  isErpAccountState: any
  isOrgLast: any
  isFromOrgLast: any
  orgInfo: any
  isFromOrgLastNoApp: any
  getSystemOptionType: any
  decryptApplicationSource: any
}
export default function (data: any = {}): TisStateCheckHooks {
  const $useUserStore = useUserStore()
  const { erpUseInfo }: { erpUseInfo: any } = storeToRefs($useUserStore) as any
  const sysTag = import.meta.env.VITE_TAG
  const $route = useRoute()
  /**
   * erp账号判断
   */
  const isErpAccount = computed<boolean>((): boolean => {
    let openErp: boolean = true
    switch (sysTag) {
      case 'vsupplier':
        openErp = erpUseInfo.value?.isOpenErp || false
        break
    }
    return openErp
  })

  /**
   * 组合商品判断
   */
  const isCombinationGoods = computed(() => {
    return function (row: any): boolean {
      if (row) {
        return row?.comboType == '2'
      } else {
        return false
      }
    }
  })

  /**
   * 是否erp state
   */
  const isErpAccountState = computed(() => {
    return function (row: any): boolean {
      if (row) {
        return !!row?.erpType
      } else {
        return false
      }
    }
  })

  /**
   * 不含税V链供应价- 不含税采购成本
   */

  const purchaseCostName = computed(() => {
    switch (sysTag) {
      case 'vsupplier':
        return '供应价'
      case 'voperate':
        return '采购成本'
    }
  })

  /**
   * 是否分支机构，顶级机构 【差异1】
   */
  const isOrgLast = computed(() => {
    return $useUserStore.userInfo.orgType != 1
  })

  /**
   * 解密当前应用数据
   */
  const decryptApplicationSource: any = computed(() => {
    let projectId = $route.query.projectId as string
    let deProjectId = strDecodeURIComponent(projectId)
    let projectIStr = decrypted(deProjectId)
    let projectInfo = {}
    try {
      projectInfo = JSON.parse(projectIStr)
    } catch (error) {}
    return projectInfo
  })
  /**
   * 当前机构类型
   */
  const isFromOrgLast = computed(() => {
    return $useUserStore.userInfo?.orgType != 1
  })

  /**
   * 顶级机构非应用显示
   */
  const isFromOrgLastNoApp = computed(() => {
    return $useUserStore.userInfo?.orgType == 1 && import.meta.env.VITE_APP_TYPE != 'app'
  })

  /**
   * 当前用户分支机构信息
   */
  const orgInfo = computed(() => {
    return {
      id: $useUserStore.userInfo.orgId,
      name: $useUserStore.userInfo.orgName
    }
  })

  /**
   * 系统类型角色
   */
  const getSystemOptionType = computed(() => {
    if (import.meta.env.VITE_APP_TYPE == 'app') {
      if ($useUserStore.userInfo?.orgType == 1) {
        return '10' //顶级机构应用
      } else {
        return '20' //分支机构应用
      }
    } else {
      if ($useUserStore.userInfo?.orgType == 1) {
        return '101' //顶级机构
      } else {
        return '201' //分支机构
      }
    }
  })

  return {
    isErpAccount: isErpAccount.value,
    isCombinationGoods: isCombinationGoods.value,
    isErpAccountState: isErpAccountState.value,
    purchaseCostName: purchaseCostName.value,
    isOrgLast: isOrgLast,
    isFromOrgLast: isFromOrgLast,
    isFromOrgLastNoApp: isFromOrgLastNoApp,
    getSystemOptionType: getSystemOptionType,
    orgInfo: orgInfo,
    decryptApplicationSource
  }
}
