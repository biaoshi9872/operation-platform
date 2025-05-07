import { useUserStore, tabsStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
type TComboType = '1' | '2' // 1 常规商品， 2 组合商品
type tUseOrRouteHooks = {
  $route: any
  $router: any
  tabsRouter: any
  userInfo: any
  erpUseInfo: any
  goToCommodity: any
  linkUrlPath: any
  batchLink: any
  toManageList: any
  toBatchOrderAuditDetail: any
}
class LinkUrlPath {
  //非组合商品
  public readonly commodityEdit = '/commodity/edit/index'
  public readonly commodityView = '/commodity/detail/index'
  public readonly commodityPreview = '/commodity/preview/index'
  public readonly commodityAdd = '/commodity/added/index'
  //组合商品相关
  public readonly commodityComboEdit = '/commodity/combinationGoods/edit/index'
  public readonly commodityComboView = '/commodity/combinationGoods/detail/index'
  public readonly commodityComboPreview = '/commodity/combinationGoods/preview/index'
  public readonly commodityComboAdd = '/commodity/combinationGoods/edit/index'
  //批量新增
  public readonly commodityBatchUpload = '/commodity/batchUpload/index'
  //商品列表
  public readonly commodityList = '/commodity/list/index'
  public readonly commodityComboList = '/commodity/combinationGoods/list/index'
  //批量下单审核详情
  public readonly batchOrderAuditDetail = '/orderManagement/orderAudit/orderAuditDetail'
}

export default function (): tUseOrRouteHooks {
  const { userInfo, erpUseInfo } = storeToRefs(useUserStore()) as any
  const tabsRouter: any = tabsStore()
  const $router = useRouter()
  const $route = useRoute()
  const linkUrlPath = new LinkUrlPath()
  //1.商品跳转，
  const goToCommodity = (data: any, optionType: TOption, TComboType: TComboType = '1') => {
    switch (optionType) {
      case 'add':
        addHandler(data, TComboType)
        break
      case 'edit':
        editHandler(data, TComboType)
        break
      case 'view':
        detailHandler(data, TComboType)
        break
      case 'preview':
        viewHandler(data, TComboType)
        break
      default:
        break
    }
  }

  //编辑
  const editHandler = ({ spuCode }: any, TComboType: TComboType = '1') => {
    const url = $router.resolve({
      path: TComboType == '1' ? linkUrlPath.commodityEdit : linkUrlPath.commodityComboEdit,
      query: {
        spuCode
      }
    })
    window.open(url.href)
  }

  //详情
  const detailHandler = ({ spuCode }: any, TComboType: TComboType = '1') => {
    tabsRouter.reload({
      path: TComboType == '1' ? linkUrlPath.commodityView : linkUrlPath.commodityComboView,
      query: {
        spuCode
      }
    })
  }

  //预览
  const viewHandler = (row: any, TComboType: TComboType = '1') => {
    tabsRouter.reload({
      path: TComboType == '1' ? linkUrlPath.commodityPreview : linkUrlPath.commodityComboPreview,
      query: {
        spuCode: row.spuCode
      }
    })
  }

  //新增
  const addHandler = (row: any, TComboType: TComboType = '1') => {
    const url = $router.resolve({
      path: TComboType == '1' ? linkUrlPath.commodityAdd : linkUrlPath.commodityComboAdd
    })
    window.open(url.href)
  }

  //商品批量新增
  const batchLink = () => {
    tabsRouter.reload({
      path: linkUrlPath.commodityBatchUpload
    })
  }

  //跳转到列表
  const toManageList = (TComboType: TComboType = '1') => {
    tabsRouter.reload({
      path: TComboType == '1' ? linkUrlPath.commodityList : linkUrlPath.commodityComboList
    })
  }

  //跳转到列表
  const toBatchOrderAuditDetail = (row: any) => {
    tabsRouter.reload({
      path: linkUrlPath.batchOrderAuditDetail,
      query: {
        orderNo: row.orderNo
      }
    })
  }

  return {
    $route,
    $router,
    tabsRouter,
    userInfo,
    erpUseInfo,
    goToCommodity,
    linkUrlPath,
    batchLink,
    toManageList,
    toBatchOrderAuditDetail
  }
}
