declare namespace API {
  interface PageModel {
    page: number
    limit: number
    totalCount: number
  }
  interface PageDataModel {
    empty: boolean
    pageNumber: number
    pageSize: number
    totalPage: number
    totalRow: number
  }
}
