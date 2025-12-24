declare namespace API {
  interface SaveCateInfoParams {
    id?: number
    level: 1 | 2 | 3 | ''
    categoryName: string
    parentCode?: string
    stateEnum?: 1 | 2
    sort?: number
    remarks?: string
  }
  interface GetTreeCateInfoData {
    categoryCode: string
    categoryName: string
    childrenInfo: GetTreeCateInfoData[]
    id: number
    level: 1 | 2 | 3
    parentCategoryName: null | ''
    parentCode: string
    sort: number
  }
  interface GetCateInfoDetailData {
    id: number
    categoryCode: string
    categoryName: string
    parentCode: string
    parentCategoryName: string
    level: 1 | 2 | 3
    stateEnum: 1 | 2
    sort: number
    remarks?: string
    flag: boolean
  }
  interface GetCateGoryInfoByLevelData {
    categoryCode: string
    categoryName: string
    id: number
    level: 1 | 2
  }
  interface ProductTableItem {
    id: number
    categoryCode: string
    categoryName: string
    parentCode: number
    parentCategoryName: number
    level: number
    stateEnum: 0 | 1
    sort: number
    remarks?: string
  }
  interface GetCateGoryInfoParams {
    categoryCode: string
    level: 1 | 2 | 3
    searchParentFlag: boolean
    searchMappingFlag: boolean
  }
  interface GetMappingChannelData {
    categoryIds: string[]
    categoryName: string
    source: 1 | 5
  }
  interface GetCateGoryInfoData {
    categoryCode: string
    categoryName: string
    id: number
    level: 1 | 2 | 3
    mappingChannelList?: GetMappingChannelData[]
    parentCategoryName?: string
    parentCode: string
    remarks: string
    sort: number
    stateEnum: 1 | 2
  }
  interface SaveChannelRelationParams {
    id: number
    jdArr: string[]
    qxArr: string[]
  }
  interface GetLevelCategoryData {
    categoryCode: string
    categoryName: string
  }
}
