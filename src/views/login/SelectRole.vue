<script setup lang="ts">
interface IProp {
    roleList: any,
    userInfo: any
}
const props = withDefaults(defineProps<IProp>(), {
    roleList: [],
    userInfo: {}
})
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void
    (e: 'submitSuccess', userInfo: any, roleId: any): void
}>()
const handleClose = () => {
    emits('update:modelValue', false)
}
let curryRoleId = ref('')
const handleSubmit = () => {
    emits('update:modelValue', false)
    emits('submitSuccess', props.userInfo, curryRoleId.value)
}
const openHandler = () => {
    curryRoleId.value = props.roleList[0]?.id || ''
}

</script>
<template>
    <el-dialog v-bind="$attrs" title="提醒" width="400px" append-to-body @open="openHandler" draggable destroy-on-close
        :close-on-click-modal="false" @closed="handleClose">
        <div class="select-container">
            <div class="title">您的账号有以下权限，请选择其一进行登录</div>
            <el-radio-group v-model="curryRoleId" class="radio-group-container">
                <el-radio v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
            </el-radio-group>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose" class="mr-10">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped>
.select-container {
    padding: 8px;

    .radio-group-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 12px;

        ::v-deep(.el-radio) {
            width: 100%;
            margin-left: 24px;
            margin-bottom: 12px;
        }
    }
}
</style>