<template>
    <div class="app-cell-card group" @click="$emit('manage', row)">
        <div class="card-content">
            <div class="card-header">
                <div class="icon-wrapper" :class="projectTypeClass.bg">
                    <SvgIcon class="material-icons-outlined" :class="projectTypeClass.text"
                        :icon="projectTypeClass.icon" :name="projectTypeClass.icon" />
                </div>
                <span class="tag" :class="projectTypeClass.tagBg">
                    {{ system_enum.getProjectType(row.projectType) }}
                </span>
            </div>
            <h3 class="app-title" :title="row.appName" @dblclick="handleDblClick">
                {{ row.appName }}
            </h3>
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
                <el-button v-auth="'APP_ADD'" type="primary" class="manage-btn" @click.stop="$emit('manage', row)">
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

// Map project types to styles/icons based on the enum text or value
// Since we don't know the exact enum values mapping to "Financial", "Gift", etc., 
// we'll use a deterministic hash or just default to one style, 
// but try to mimic the demo's variety if possible.
const projectTypeClass = computed(() => {
    const projectType = props.row.projectType || ''

    // Default style (Purple/Financial)
    let style = {
        bg: 'bg-secondary',
        text: 'text-primary',
        icon: 'layers',
        tagBg: 'tag-blue'
    }

    if (projectType == '1') {
        style = {
            bg: 'bg-green-100',
            text: 'text-green-600',
            icon: 'yingxiao',
            tagBg: 'tag-green'
        }
    } else if (projectType == '2') {
        style = {
            bg: 'bg-pink-100',
            text: 'text-pink-600',
            icon: 'fulizhongxin',
            tagBg: 'tag-blue'
        }
    } else {
        style = {
            bg: 'bg-indigo-100',
            text: 'text-indigo-600',
            icon: 'fuli',
            tagBg: 'tag-purple'
        }
    }

    return style
})
</script>

<style lang="scss" scoped>
/* Define colors based on demo.html */
$primary: #8B5CF6;
$primary-hover: #7C3AED;
$secondary: #EDE9FE;
$text-main: #1F2937;
$text-sub: #6B7280;
$border: #E5E7EB;
$bg-card: #FFFFFF;
$bg-footer: #F9FAFB;

.app-cell-card {
    background-color: $bg-card;
    border-radius: 0.75rem;
    /* rounded-xl */
    border: 1px solid $border;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    /* shadow-soft */
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
        /* shadow-hover */
        transform: translateY(-2px);
    }

    .card-content {
        padding: 1.25rem;
        /* p-5 */
        flex: 1;
    }

    .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 1rem;
        /* mb-4 */
    }

    .icon-wrapper {
        width: 2rem;
        /* w-12 */
        height: 2rem;
        /* h-12 */
        border-radius: 0.5rem;
        /* rounded-lg */
        display: flex;
        align-items: center;
        justify-content: center;

        .material-icons-outlined {
            font-size: 1.4rem;
            /* text-2xl */
        }
    }

    /* Color variants for icon wrapper */
    .bg-secondary {
        background-color: $secondary;
    }

    .bg-green-100 {
        background-color: #dcfce7;
    }

    .bg-pink-100 {
        background-color: #fce7f3;
    }

    .bg-indigo-100 {
        background-color: #e0e7ff;
    }

    .bg-orange-100 {
        background-color: #ffedd5;
    }

    .bg-teal-100 {
        background-color: #ccfbf1;
    }

    /* Text color variants */
    .text-primary {
        color: $primary;
    }

    .text-green-600 {
        color: #16a34a;
    }

    .text-pink-600 {
        color: #db2777;
    }

    .text-indigo-600 {
        color: #4f46e5;
    }

    .text-orange-600 {
        color: #ea580c;
    }

    .text-teal-600 {
        color: #0d9488;
    }

    .tag {
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.625rem;
        /* px-2.5 py-0.5 */
        border-radius: 9999px;
        /* rounded-full */
        font-size: 0.75rem;
        /* text-xs */
        font-weight: 500;
        border-width: 1px;
        border-style: solid;
    }

    .tag-blue {
        background-color: #dbeafe;
        color: #1e40af;
        border-color: #bfdbfe;
    }

    .tag-green {
        background-color: #dcfce7;
        color: #166534;
        border-color: #bbf7d0;
    }

    .tag-purple {
        background-color: #f3e8ff;
        color: #6b21a8;
        border-color: #e9d5ff;
    }

    .app-title {
        font-size: 1.125rem;
        min-height: 2.5rem;
        /* text-lg */
        font-weight: 700;
        color: #111827;
        /* gray-900 */
        margin-bottom: 0.25rem;
        /* mb-1 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
    }

    .org-name {
        font-size: 0.75rem;
        /* text-xs */
        color: $text-sub;
        margin-bottom: 1rem;
        /* mb-4 */
        height: 2.5rem;
        /* h-10 */
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.25rem;
    }

    .info-block {
        margin-top: 1rem;
        /* mt-4 */
        padding-top: 1rem;
        /* pt-4 */
        border-top: 1px dashed $border;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        /* space-y-2 */
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        /* text-xs */

        .label {
            color: $text-sub;
        }

        .value {
            font-weight: 500;
            color: #374151;
            /* gray-700 */
        }
    }

    .card-footer {
        padding: 1rem;
        /* p-4 */
        background-color: $bg-footer;
        border-top: 1px solid $border;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        /* gap-3 */
        border-bottom-left-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
    }

    .manage-btn {
        width: 100%;
        background-color: $primary;
        border-color: $primary;
        color: white;
        font-weight: 500;
        border-radius: 0.5rem;
        /* rounded-lg */
        transition: background-color 0.2s;

        &:hover {
            background-color: $primary-hover;
            border-color: $primary-hover;
            transform: scale(1.02);
        }

        .icon {
            font-size: 0.75rem;
            /* text-xs */
            margin-right: 0.5rem;
        }
    }

    .edit-btn {
        width: 100%;
        background-color: transparent;
        color: $primary;
        border: 1px solid $primary;
        font-weight: 500;
        border-radius: 0.5rem;
        /* rounded-lg */
        transition: background-color 0.2s;

        &:hover {
            background-color: #f3f4f6;
            transform: scale(1.02);
            /* hover:bg-gray-100 */
        }

        .icon {
            font-size: 0.75rem;
            /* text-xs */
            margin-right: 0.5rem;
        }
    }
}
</style>