<script setup lang="ts">
defineOptions({ name: 'ExpressSheet' })
</script>
<template>
  <el-popover placement="top" title="面单脱敏" :width="200">
    <template #reference>
      <div>
        面单是否脱敏
        <el-icon>
          <QuestionFilled />
        </el-icon>
      </div>
    </template>
    <div>
      <div>
        面单脱敏指在快递面单上隐藏或模糊关键信息，
        如姓名、电话号码、地址等，从而减少个人信
        息泄露的风险。
      </div>
      <div>
        <img src="@/assets/images/expressSheet.png" />
      </div>
    </div>
  </el-popover>
</template>
<style lang="scss" scoped></style>