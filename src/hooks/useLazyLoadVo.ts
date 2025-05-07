//定义参数类
interface UseLazyLoadQo<T> {
  className: string,
  calcBottomCount: number,
  data: T[],
  getData: () => void | Promise<void>
}
//

