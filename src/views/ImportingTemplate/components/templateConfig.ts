import order_api from '@/api/order'
import { cloneDeep } from 'lodash-es'

//节点显示模版
const nodeConfig: any = {
  orderExport: [
    {
      title: '上传物流信息'
    },
    {
      title: '导入物流信息'
    },
    {
      title: '导入完成'
    }
  ]
}

//导入文案模版
const exportNodeDecListConfig: any = {
  orderExport: {
    nextTitle: '下一步',
    maxSize: 10,
    type: 'orderExport',
    upLoadingDesc: {
      title: '填写发货的订单信息',
      desc: '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除'
    },
    downLoadingDesc: {
      title: '上传填好的物流信息表',
      nextTitle: '下一步',
      desc: '文件后缀名必须为xls 或xlsx （即Excel格式），商品信息不能大于1000行，文件大小不得大于10M'
    }
  }
}

//导入响应文案模版
const exportNodeResultDecListConfig: any = {
  orderExport: {
    title: '物流信息',
    downTitle: '下载失败数据',
    soreTile: '返回订单列表'
  }
}

//导入模版
const exportConfig: any = {
  orderExport: {
    url: '',
    exportName: '批量导入物流模板.xlsx',
    getExportTemple: () => {
      return 'https://ycbsaas-bucket.oss-cn-hangzhou.aliyuncs.com/images/20241128/23c19db5dded47f8aa1ba9aa66c321d9.xlsx'
    }
  }
}

//导入模版接口
const exportApiConfig: any = {
  orderExport: {
    api: order_api.A_deliverImport
  }
}

//导入异常下载模本接口
const exportErrorApiConfig: any = {
  orderExport: {
    api: order_api.A_deliverFailData,
    isToCenter: false,
    exportName: '批量导入物流模板失败详情.xlsx'
  }
}

//返回直接路由
const exportReturnRouteConfig: any = {
  orderExport: {
    path: '/orderManagement/order/index'
  }
}

//获取模版
export default async function getConfigInfo(source: string) {
  let obj = cloneDeep(exportConfig[source])
  const info = await obj.getExportTemple()
  obj.url = info.ossUrl

  return {
    nodeConfig: nodeConfig[source],
    exportConfig: obj,
    exportApiConfig: exportApiConfig[source],
    exportNodeDecListConfig: exportNodeDecListConfig[source],
    exportNodeResultDecListConfig: exportNodeResultDecListConfig[source],
    exportErrorApiConfig: exportErrorApiConfig[source],
    exportReturnRouteConfig: exportReturnRouteConfig[source]
  }
}
