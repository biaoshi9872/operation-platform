/*
 * @Descripttion:
 * @version:
 * @Author: biao.shi
 * @Date: 2023-03-03 16:28:51
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-03-06 10:21:45
 */
// @ts-nocheck
export default {
  props: {
    row: Object,
    parentRow: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: function () {
    return this.render(this.row, this.column, this.index, this.parentRow)
  }
}
