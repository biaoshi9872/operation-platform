<!--
 * @Descripttion:订单组件-- 针对类似订单功能的列表组件
 * @version: 
 * @Author: biao.shi
 * @Date: 2022-06-13 18:54:45
 * @LastEditors: biao.shi
 * @LastEditTime: 2023-06-21 09:25:27
-->

<script setup lang="ts">
defineOptions({ name: 'OrderCustomTable' })
import CellContentModule from './CellContentModule.vue'
import CheckCell from './CheckCell.vue'
import ColumnConfig from '../ColumnConfig/index.vue'
import MyRender from './expand'
import { useRoute } from 'vue-router'
import isErpUserHooks from '@/hooks/isStateCheckHooks'
import filedConfigHooks from '@/hooks/filedConfigHooks'
const { filedConfigData, saveFiledConfigData, getConfigData, isFieldShow } = filedConfigHooks()
const route = useRoute()
const tabsInfo = inject(
  'tabsInfo',
  computed(() => {
    return true
  })
) as any
watch(
  () => tabsInfo.value,
  () => {
    console.log(tabsInfo.value, 'tabsInfo.value')
    getFiledConfigData()
  },
  { deep: true }
)
provide('isFieldShow', isFieldShow)
//是否开启字段配置
const getFiledConfigData = async () => {
  if (props.openFiledConfig) {
    let filedSubStr = ''
    if (props.dataPage?.facadeKz) {
      Object.keys(props.dataPage.facadeKz).forEach(key => {
        filedSubStr += `${key}_${props.dataPage.facadeKz[key]}`
      })
    }
    let filedMainKey = props.filedMainKey || route.path
    let filedSubKey = props.filedSubKey || filedSubStr
    let res = await getConfigData(filedMainKey, filedSubKey)
  }
}
const { isErpAccount, isCombinationGoods } = isErpUserHooks()

interface IColumn {
  label: string
  prop: string
  width?: string
  minWidth?: string
  align?: 'left' | 'center' | 'right'
  marginAttr?: string
  openMarginCell?: boolean
  showOverflowTooltip?: boolean
  marginProp?: string
  render?: Function
  isErp?: boolean
  renderLabel?: Function
}

interface IProp {
  columns: Array<IColumn>
  dataList: Array<any>
  openFiledConfig?: boolean
  filedMainKey?: string
  filedSubKey?: string
  filedConfig?: any
  dataPage?: any
  orderChildAttr: string
  useCustomRow: boolean
  minHeight: string
  maxHeight: string
  pageMap: any
  page: Page
  isShowPagination: boolean
  isCheck: boolean
  isChildCheck: boolean
  isMarginCheck: boolean
  openFold: boolean
  border: boolean
  openERP?: boolean
  multipleList: any
  rowKey: string
}

const props = withDefaults(defineProps<IProp>(), {
  openFiledConfig: true,
  dataPage: {},
  useCustomRow: true,
  isCheck: false,
  isChildCheck: false,
  border: false,
  openFold: true,
  multipleList: [],
  rowKey: 'id'
})

const emits = defineEmits(['multipleHandler', 'update:multipleList'])

const data = reactive({
  isIndeterminate: false,
  checkedAllState: false
})

watch(
  () => data.checkedAllState,
  (newValue, oldValue) => {
    selectAllState()
  }
)

watch(
  () => props.multipleList,
  (newValue, oldValue) => {
    if (newValue.length === 0) {
      data.checkedAllState = false
    }
  }
)

const rowCheckedHandler = (e: any, item: any) => {
  if (e) {
    let arr = props.multipleList
    arr.push(item)
    emits('update:multipleList', arr)
  } else {
    let index = props.multipleList.findIndex((el: any) => el[props.rowKey] === props.rowKey)
    let arr = props.multipleList
    arr.splice(index, 1)
    emits('update:multipleList', arr)
  }
  //触发
  emits('multipleHandler', props.multipleList)
}

//子复选
const rowChildCheckedHandler = (event: any, value: any, item: any) => {
  if (event) {
    let arr = props.multipleList
    arr.push(item)
    emits('update:multipleList', arr)
  } else {
    let index = props.multipleList.findIndex((el: any) => el.id === item.id)
    let arr = props.multipleList
    arr.splice(index, 1)
    emits('update:multipleList', arr)
  }
  //触发
  emits('multipleHandler', props.multipleList)
}

const isIndeterminate = computed(() => {
  if (props.isCheck) {
    return !props.dataList.every((el: any) => el.check) && props.dataList.some((el: any) => el.check)
  }
  if (props.isChildCheck)
    return (
      !props.dataList.every((el: any) => {
        return el[props.orderChildAttr].every((item: any) => item.check)
      }) &&
      props.dataList.some((el: any) => {
        return el[props.orderChildAttr].some((item: any) => item.check)
      })
    )
})

const selectAllState = () => {
  if (data.checkedAllState) {
    if (props.isCheck) {
      let arr = [...props.dataList]
      emits('update:multipleList', arr)
      props.dataList.forEach(item => {
        item.check = true
      })
    }
    if (props.isChildCheck) {
      let arr: any[] = []
      props.dataList.forEach((item: any) => {
        item[props.orderChildAttr].forEach((el: any) => {
          arr.push(el)
        })
      })
      emits('update:multipleList', arr)
      props.dataList.forEach(item => {
        item[props.orderChildAttr].forEach((el: any) => {
          el.check = true
        })
      })
    }
  } else {
    if (props.isCheck) {
      props.dataList.forEach(item => {
        item.check = false
      })
    }
    if (props.isChildCheck) {
      props.dataList.forEach(item => {
        item[props.orderChildAttr].forEach((el: any) => {
          el.check = false
        })
      })
    }
    emits('update:multipleList', [])
  }
}

const foldHandler = (type: any, row: any) => {
  row.fold = !row.fold
}

const width = computed(() => {
  const showColumnsLength = props.columns.length - (filedConfigData?.filedConfigList.filter((el: any) => el.isShow == 0).length || 0)

  return showColumnsLength <= 12 ? '100%' : `${showColumnsLength * 140}px`
})

const moreFoldNum = computed(() => {
  return function (row: any) {
    return row[props.orderChildAttr]?.length >= 3 ? row[props.orderChildAttr]?.length - 3 : 0
  }
})

const slot = useSlots()
const pageInfo: any = inject('pageInfo', () => {
  return null
})
//高度适配
const tableHight = computed(() => {
  let height = 'auto'
  if (pageInfo) {
    if (slot.hasOwnProperty('option')) {
      pageInfo.optionHight = 40
    }
    if (!props.isShowPagination) {
      pageInfo.paginationHeight = 0
    }
    let totalHeight =
      pageInfo?.searchHight + pageInfo?.tabsHight + pageInfo?.optionHight + pageInfo?.layoutHight + pageInfo?.tabHeaderHeight + pageInfo?.paginationHeight
    height = `calc(100vh - ${totalHeight}px )`
  }
  return height
})

const isOpenFold = computed(() => {
  return function (row: any) {
    return !isCombinationGoods(row)
  }
})

const filedShow = computed(() => {
  return function (column: any) {
    // let isShow = true
    // if (column.hasOwnProperty('isShowFun')) {
    //   isShow = column.isShowFun()
    // }
    // if (!isShow) return false
    if (column.isErp) {
      return isErpAccount
    } else if (column.isNoErp) {
      return !isErpAccount
    } else {
      return isFieldShow.value(column.prop || column.marginAttr)
    }
  }
})

onMounted(() => {
  getFiledConfigData()
})
</script>

<template>
  <div class="main_box">
    <div class="option-box">
      <div class="option_container">
        <slot name="option"></slot>
      </div>
      <div class="mr-16">
        <ColumnConfig
          v-if="filedConfigData.filedConfigList.length && openFiledConfig "
          :columnConfigs="filedConfigData.filedConfigList"
          :saveFiledConfigData="saveFiledConfigData"
        ></ColumnConfig>
      </div>
    </div>
    <div class="table-container" :style="{ 'max-height': tableHight }">
      <div class="my-table" :style="{ width }">
        <!-- 表头 -->
        <div class="my-table_header-wrapper">
          <!-- 复选 -->
          <div v-if="isCheck || isChildCheck" class="checkBox">
            <el-checkbox :indeterminate="isIndeterminate" v-model="data.checkedAllState" name="1" size="large" />
          </div>
          <template v-for="(column, index) in columns" :key="index">
            <div
              class="my-table_header-column"
              v-if="filedShow(column)"
              :style="{ flex: column.width ? 'none' : 'auto', width: column.width, 'min-width': column.minWidth }"
            >
              <!--- 单元格-->
              <div class="cell">
                <!-- -->
                <div v-if="column.renderLabel" class="cell-content" :style="{ 'text-align': column.align ? column.align : 'center' }">
                  <MyRender :column="column" :row="{ label: column.label }" :render="column.renderLabel" :index="index"></MyRender>
                </div>
                <div v-else class="cell-content" :style="{ 'text-align': column.align ? column.align : 'center' }">{{ column.label }}</div>
              </div>
            </div>
          </template>
        </div>
        <!--  body -->
        <div class="my-table_body-wrapper" v-if="dataList.length">
          <div
            class="my-table_body-wrapper-inner"
            :style="{ 'margin-top': useCustomRow ? '16px' : '0' }"
            v-for="(row, index) in  dataList "
            :key="index"
          >
            <!-- 特殊行 -->
            <div class="my-table_body-special-row" v-if="useCustomRow">
              <!-- 自定义行显示内容-->
              <slot name="customRow" :row="row" :index="index"></slot>
            </div>
            <!-- 列-->
            <div class="my-table_body-wrapper-row">
              <!-- 复选 -->
              <div v-if="isCheck || isChildCheck" :key="row" class="check_container">
                <el-checkbox
                  v-if="isCheck"
                  v-model="row.check"
                  :true-label="true"
                  :false-label="false"
                  size="large"
                  @change="rowCheckedHandler($event, row)"
                />
                <div v-if="isChildCheck" class="margin-cell-box">
                  <CheckCell
                    :foldState="row.fold"
                    :openFold="openFold"
                    :key="row"
                    @rowCheckedHandler="rowChildCheckedHandler"
                    type="no_margin"
                    :dataList="row[orderChildAttr]"
                    :index="index"
                    :parentRow="row"
                  ></CheckCell>
                </div>
              </div>
              <template v-for="(column, index) in columns" :key="index">
                <div
                  class="my-table_body-column"
                  v-if="filedShow(column)"
                  :style="{ flex: column.width ? 'none' : 'auto', width: column.width, 'min-width': column.minWidth, 'border-right': props.border ? '1px solid #e5e5e5' : '' }"
                >
                  <!-- 多行 -->
                  <div class="margin-cell-box" v-if="column.marginAttr || column.openMarginCell">
                    <CellContentModule
                      :column="column"
                      :foldState="row.fold"
                      :openFold="openFold"
                      type="no_margin"
                      :dataList="row[orderChildAttr]"
                      :index="index"
                      :parentRow="row"
                    ></CellContentModule>
                  </div>
                  <!-- 单行 -->
                  <div class="margin-cell-box" v-else>
                    <CellContentModule
                      :column="column"
                      :foldState="row.fold"
                      :openFold="openFold"
                      type="margin"
                      :dataList="[row]"
                      :parentRow="row"
                      :index="index"
                    ></CellContentModule>
                  </div>
                </div>
              </template>
            </div>
            <div v-if="openFold &&  isOpenFold(row) " class="my_table_fold-container">
              <div class="my_table_fold-row">
                <div v-if="isCheck" class="checkBox"></div>
                <template v-for="(column, index) in columns" :key="index">
                  <div
                    class="my_table_fold-column"
                    :key="index"
                    v-if="filedShow(column)"
                    :style="{ flex: column.width ? 'none' : 'auto', width: column.width, 'min-width': column.minWidth, 'border-right': props.border ? '1px solid #e5e5e5' : '' }"
                  >
                    <div>
                      <!-- 折叠行 -->
                      <div class="cell">
                        <div :class="(column.marginAttr || column.openMarginCell) ? 'marg-cell-line' : ''"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div class="fold_container">
                <div v-if="!row.fold" class="fold_content" @click="foldHandler(1, row)">
                  更多({{ moreFoldNum(row)
                  }}个商品规格)
                  <el-icon class="ml-8">
                    <ArrowDown />
                  </el-icon>
                </div>
                <div v-else class="fold_content" @click="foldHandler(0, row)">
                  收起
                  <el-icon class="ml-8">
                    <ArrowUp />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 空白数据时 -->
        <div class="my-table_empty-wrapper" v-else>
          <div class="my-table_empty-wrapper-inner">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin clounm {
  display: flex;
}

@mixin cell-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

@mixin cell-content {
  padding: 4px 10px;
  box-sizing: border-box;
}

$border: 1px solid var(--theme-border-color-light);

.flexStCenter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check_container {
  width: 60px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.margin-cell-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main_box {
  width: 100%;
  background-color: var(--el-searchForm-bg-color);
  border-radius: 10px 10px 0 0;
  .option-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .option_container {
      margin: 0 8px;
      padding-top: 8px;

      > :nth-child(1) {
        ::v-deep(.auth_button) {
          margin: 0 !important;
        }
      }
    }
  }
  .table-container {
    width: 100%;
    overflow: auto;
    height: 100%;
    .my-table {
      table-layout: fixed;
      padding: 8px;
      border-radius: 10px;
      position: relative;
      height: 100%;
      //overflow: auto;

      .my-table_header-wrapper {
        width: 100%;
        position: sticky;
        position: -webkit-sticky;
        top: 0px;
        left: 0;
        font-weight: 700;
        background-color: var(--el-color-primary-light-9);
        border: $border;
        z-index: 99;
        color: var(--el-text-color-regular);
        min-height: 40px;
        @include clounm();

        .my-table_header-column {
          @include cell-flex();

          > .cell {
            width: 100%;
            @include cell-content();
          }
        }

        .my-table_header-column:last-child {
          position: sticky;
          right: 0;
          background-color: var(--el-color-primary-light-9);
          /* 首行在左 */
          z-index: 9999;
          box-shadow: -1px 0px 3px rgba(0, 0, 0, 0.1);
        }

        .my-table_header-column:not(:last-child) {
          border-right: $border;
        }
      }

      .my-table_body-wrapper {
        color: rgb(96, 98, 102);
        .my-table_body-wrapper-inner {
          border: $border;

          .my-table_body-special-row {
            position: relative;
            padding: 12px 10px;
            box-sizing: border-box;
            background-color: #409eff12; //var(--el-table-special-bg-color);
            text-overflow: ellipsis;
            vertical-align: middle;
            text-align: left;
            border-bottom: $border;
            transition: background-color 0.25s ease;
          }

          .my-table_body-wrapper-row {
            @include clounm();
            table-layout: fixed;

            .my-table_body-column {
              @include cell-flex();

              .margin-cell-box {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
              }
            }

            .my-table_body-column:last-child {
              position: sticky;
              right: 0;
              /* 首行在左 */
              background-color: var(--el-searchForm-bg-color);
              z-index: 1;
              box-shadow: -1px 0px 3px rgba(0, 0, 0, 0.1);
              // height: var(100% + 120);
            }

            &:hover {
              background: var(--el-table-row-hover-bg-color);
            }
          }

          .my_table_fold-container {
            position: relative;

            .my_table_fold-row {
              @include clounm();
              table-layout: fixed;
              height: 45px;
              align-items: center;

              .cell {
                height: 100%;
                height: 45px;
                display: flex;
                align-items: center;

                .marg-cell-line {
                  border: 1px dashed #e5e5e5;
                  width: 100%;
                }
              }

              .my_table_fold-column:last-child {
                position: sticky;
                right: 0;
                /* 首行在左 */
                background-color: var(--el-searchForm-bg-color);
                z-index: 1;
                box-shadow: -1px 0px 3px rgba(0, 0, 0, 0.1);
                // height: var(100% + 120);
              }
            }

            .fold_container {
              background-color: var(--el-searchForm-bg-color);
              position: absolute;
              width: 200px;
              text-align: center;
              left: 50%;
              top: 12px;

              .fold_content {
                padding: 0 16px;
                color: var(--el-color-primary);

                > .el-icon {
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }

      .my-table_empty-wrapper {
        width: 100%;
        &-inner {
          width: 100%;
          padding: 30px 0;
          text-align: center;
          line-height: 350px;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }
      }
      .checkBox {
        width: 60px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
