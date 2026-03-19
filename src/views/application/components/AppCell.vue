<template>
    <div class="app-cell-card group">
        <div class="card-content">
            <div class="card-header">
                <div class="hero">
                    <div class="icon-wrapper" :class="projectTypeClass.bg">
                        <div class="icon-shell" :class="projectTypeClass.iconShell">
                            <el-icon class="hero-icon">
                                <component :is="projectTypeClass.icon" />
                            </el-icon>
                        </div>
                    </div>
                    <div class="hero-copy">
                        <h3 class="app-title" :title="row.appName" @dblclick="handleDblClick">
                            {{ row.appName }}
                        </h3>
                    </div>
                </div>
                <span class="tag" :class="projectTypeClass.tagBg">
                    {{ system_enum.getProjectType(row.projectType) }}
                </span>
            </div>
            <div class="info-block">
                <div class="info-item">
                    <span class="label">分支机构</span>
                    <span class="value">{{ row.orgName }}</span>
                </div>
                <div class="info-item">
                    <span class="label">运营</span>
                    <span class="value">{{ row.operatorName || '-' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">创建时间</span>
                    <span class="value">{{ row.createDate }}</span>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div>
                <el-button v-auth="'APP_OPTION'" type="primary" class="manage-btn" @click.stop="$emit('manage', row)">
                    <el-icon class="mr-4">
                        <Tools />
                    </el-icon>应用管理
                </el-button>
            </div>
            <div>
                <el-button v-auth="'APP_EDIT'" class="edit-btn" @click.stop="$emit('edit', row)">
                    <el-icon class="mr-4">
                        <Edit />
                    </el-icon>编辑
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DataBoard, Present, WalletFilled, Tools, Edit } from '@element-plus/icons-vue'
import system_enum from '@/utils/constant/system'

const props = defineProps({
    row: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const emit = defineEmits(['manage', 'edit', 'copyId'])

const handleDblClick = () => {
    emit('copyId', props.row)
}

const projectTypeClass = computed(() => {
    const projectType = props.row.projectType || ''

    let style = {
        bg: 'bg-amber',
        iconShell: 'shell-amber',
        icon: WalletFilled,
        tagBg: 'tag-green'
    }

    if (projectType == '1') {
        style = {
            bg: 'bg-emerald',
            iconShell: 'shell-emerald',
            icon: DataBoard,
            tagBg: 'tag-green'
        }
    } else if (projectType == '2') {
        style = {
            bg: 'bg-violet',
            iconShell: 'shell-violet',
            icon: Present,
            tagBg: 'tag-violet'
        }
    } else {
        style = {
            bg: 'bg-amber',
            iconShell: 'shell-amber',
            icon: WalletFilled,
            tagBg: 'tag-green'
        }
    }

    return style
})
</script>

<style lang="scss" scoped>
$primary: #2f6bff;
$primary-hover: #1f57db;
$text-main: #162033;
$text-sub: #66758f;
$border: #d9e2ef;
$bg-card: #ffffff;
$bg-footer: linear-gradient(180deg, #f8fbff 0%, #f2f7ff 100%);

.app-cell-card {
    background-color: $bg-card;
    border-radius: 18px;
    border: 1px solid $border;
    box-shadow: 0 10px 30px rgba(28, 52, 84, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;

    &:hover {
        box-shadow: 0 18px 38px rgba(28, 52, 84, 0.14);
        transform: translateY(-4px);
        border-color: #c5d5eb;
    }

    .card-content {
        padding: 18px 18px 16px;
        flex: 1;
        background:
            radial-gradient(circle at top right, rgba(47, 107, 255, 0.08), transparent 36%),
            linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    }

    .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
    }

    .hero {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }

    .hero-copy {
        min-width: 0;
    }

    .icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            inset: 5px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.55);
        }
    }

    .icon-shell {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
    }

    .hero-icon {
        font-size: 15px;
        color: #fff;
    }

    .bg-emerald {
        background: linear-gradient(145deg, #dcfff0 0%, #bff1d8 100%);
    }

    .bg-violet {
        background: linear-gradient(145deg, #f4e9ff 0%, #dfd1ff 100%);
    }

    .bg-emerald::before,
    .bg-violet::before,
    .bg-amber::before {
        content: '';
        position: absolute;
        inset: auto -12px -10px auto;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.5);
        filter: blur(2px);
    }

    .bg-amber {
        background: linear-gradient(145deg, #fff3df 0%, #ffe2ae 100%);
    }

    .shell-emerald {
        background: linear-gradient(145deg, #3abf7a 0%, #159a5e 100%);
    }

    .shell-violet {
        background: linear-gradient(145deg, #9460ff 0%, #6f40ea 100%);
    }

    .shell-amber {
        background: linear-gradient(145deg, #f0ad34 0%, #db7e16 100%);
    }

    .tag {
        display: inline-flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        border-width: 1px;
        border-style: solid;
        line-height: 1;
        white-space: nowrap;
    }

    .tag-green {
        background-color: #e5f8ea;
        color: #1f7a45;
        border-color: #bde9c9;
    }

    .tag-violet {
        background-color: #f0e8ff;
        color: #7143d6;
        border-color: #dcc9ff;
    }

    .app-title {
        font-size: 16px;
        line-height: 1.3;
        font-weight: 700;
        color: $text-main;
        margin: 6px 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
    }

    .info-block {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px dashed #d6dfec;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        font-size: 13px;

        .label {
            color: $text-sub;
            flex-shrink: 0;
        }

        .value {
            font-weight: 600;
            color: #33415c;
            text-align: right;
            word-break: break-word;
        }
    }

    .card-footer {
        padding: 14px 16px 16px;
        background: $bg-footer;
        border-top: 1px solid $border;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-bottom-left-radius: 18px;
        border-bottom-right-radius: 18px;
    }

    .manage-btn {
        width: 100%;
        height: 40px;
        background-color: var(--el-color-primary);
        border-color: var(--el-color-primary);
        color: white;
        font-weight: 700;
        border-radius: 12px;
        transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
        box-shadow: none;

        &:hover {
            background-color: var(--el-color-primary-dark-2);
            border-color: var(--el-color-primary-dark-2);
            transform: scale(1.02);
        }
    }

    .edit-btn {
        width: 100%;
        height: 40px;
        background-color: transparent;
        color: var(--el-color-primary);
        border: 1px solid var(--el-color-primary-light-5);
        font-weight: 700;
        border-radius: 12px;
        transition: background-color 0.2s, border-color 0.2s, transform 0.2s;

        &:hover {
            background-color: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary-light-4);
            transform: scale(1.02);
        }
    }
}

@media (max-width: 1600px) {
    .app-cell-card {
        .card-header {
            flex-direction: column;
            align-items: stretch;
        }

        .tag {
            align-self: flex-start;
        }

        .app-title {
            font-size: 15px;
        }
    }
}
</style>
