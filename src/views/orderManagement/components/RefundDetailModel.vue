<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

interface IProp {
  refundInfo: any
}

const props = withDefaults(defineProps<IProp>(), {
  refundInfo: {}
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'refresh'): void
}>()

interface IData {
  activeStep: number
  submitLoading: boolean
}

const data = reactive<IData>({
  activeStep: 2,
  submitLoading: false
})

const handleClose = () => {
  emits('update:modelValue', false)
}

const { activeStep, submitLoading } = toRefs(data)
</script>

<template>
  <el-dialog
    v-bind="$attrs"
    title="退款详情"
    width="900px"
    append-to-body
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @closed="handleClose"
  >
    <div class="refund-detail">
      <!-- 退款进度 -->
      <div class="progress-section mb-24">
        <div class="section-title mb-16">退款进度</div>
        <el-steps :active="activeStep" finish-status="success">
          <el-step title="用户申请退款" :description="refundInfo.applyTime" />
          <el-step title="售后中" :description="refundInfo.processTime" />
          <el-step title="已完成" :description="refundInfo.finishTime" />
        </el-steps>
      </div>

      <!-- 售后信息 -->
      <div class="info-section mb-24">
        <div class="section-title mb-16">售后信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">售后单编号：</span>
            <span>{{ refundInfo.refundCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">申请人：</span>
            <span>{{ refundInfo.applicant }}</span>
          </div>
          <div class="info-item">
            <span class="label">申请时间：</span>
            <span>{{ refundInfo.applyTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系电话：</span>
            <span>{{ refundInfo.mobile }}</span>
          </div>
          <div class="info-item">
            <span class="label">订单编号：</span>
            <span>{{ refundInfo.orderCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">退款原因：</span>
            <span>{{ refundInfo.refundReason }}</span>
          </div>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="goods-section">
        <div class="section-title mb-16">商品信息</div>
        <el-table :data="refundInfo.goodsList" border>
          <el-table-column label="商品信息" min-width="300">
            <template #default="{ row }">
              <div class="goods-info">
                <el-image 
                  :src="row.goodsImg" 
                  :preview-src-list="[row.goodsImg]" 
                  class="goods-img" 
                />
                <div class="goods-detail">
                  <div class="goods-name">{{ row.goodsName }}</div>
                  <div class="goods-spec">规格：{{ row.spec }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="平台供货价" width="120" />
          <el-table-column prop="distributionPrice" label="分销价" width="120" />
          <el-table-column prop="num" label="数量" width="80" align="center" />
          <el-table-column prop="refundAmount" label="退款金额" width="120" />
          <el-table-column prop="runningFee" label="运费" width="120" />
        </el-table>
      </div>

      <!-- 图片信息 -->
      <div class="image-section mt-24" v-if="refundInfo.images?.length">
        <div class="section-title mb-16">图片信息</div>
        <div class="image-list">
          <el-image
            v-for="(img, index) in refundInfo.images"
            :key="index"
            :src="img"
            :preview-src-list="refundInfo.images"
            class="refund-img"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.refund-detail {
  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .info-item {
      .label {
        color: var(--el-text-color-regular);
        margin-right: 8px;
      }
    }
  }

  .goods-info {
    display: flex;
    gap: 12px;
    
    .goods-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
    }

    .goods-detail {
      .goods-name {
        margin-bottom: 8px;
      }
      
      .goods-spec {
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }
    }
  }

  .image-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .refund-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
  }
}

.mb-24 {
  margin-bottom: 24px;
}

.mb-16 {
  margin-bottom: 16px;
}

.mt-24 {
  margin-top: 24px;
}
</style>