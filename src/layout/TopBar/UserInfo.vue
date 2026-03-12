<script setup lang="ts">
import { useUserStore } from '@/stores/index'
import { ElMessageBox } from 'element-plus'
import ThemeToggle from './ThemeToggle.vue'
import UpdatePwd from './UpdatePwd.vue'
import login_api from '@/api/system/login'
const { userInfo, reSetUserInfo } = useUserStore()
const $router = useRouter()

async function handleLogout() {
  try {
    await ElMessageBox.confirm(`确定进行[退出]操作，是否继续?`, '提示', { type: 'warning' })
    reSetUserInfo().then(() => {
      $router.push('/login')
    })
    // location.reload()
  } catch (e) { }
}

const selectChangeHandler = async (item: any) => {
  await login_api.A_saveRoleInfo({
    userId: userInfo.id,
    roleId: item.id
  })
  setTimeout(() => {
    location.reload()
  }, 1000)
}

let showPwd = ref(false)
const updatePassword = () => {
  showPwd.value = true
}
</script>

<template>
  <div class="user-info-warp flex">
    <ThemeToggle />
    <el-divider direction="vertical"></el-divider>
    <el-dropdown popper-class="userInfo-popper" trigger="click">
      <div class="user-info">
        <!-- <img src="@/assets/images/default-avatar.png" class="user-avatar" /> -->
        <svg-icon name="userinfo" class="user-icon" />
        <div class="user-name">{{ userInfo?.name }}</div>
        <el-icon>
          <ArrowDown class="user-arrow-down" />
        </el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled class="block pb-0">
            <p class="lh-27">
              <span class="dropdown-item-label inline-block">姓名</span>
              ：{{ userInfo?.name }}
            </p>
          </el-dropdown-item>
          <div class="role-container" v-if="userInfo?.roleInfoList?.length">
            <p class="title">切换角色
            </p>
            <div class="role-list">
              <div @click="selectChangeHandler(item)" :class="userInfo.roleIdList.includes(item.id) ? 'active' : ''"
                class="role-item" v-for="item in userInfo?.roleInfoList || []" :key="item.id">
                <span>{{ item.name }}</span>
                <el-icon v-if="userInfo.roleIdList.includes(item.id)"><Select /></el-icon>
              </div>
            </div>
          </div>
          <el-dropdown-item v-else disabled class="block pb-0">
            <p class="lh-27">
              <span class="dropdown-item-label inline-block">角色</span>
              ：{{ userInfo?.roleName }}
            </p>
          </el-dropdown-item>
          <el-dropdown-item divided @click="updatePassword" class="block pb-0">
            <span class="back_btn">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">
            <span class="back_btn">
              <svg-icon name="logout" class="mr-3" />退出
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <UpdatePwd v-model="showPwd"></UpdatePwd>
  </div>
</template>

<style lang="scss" scoped>
.user-info-warp {
  display: flex;
  align-items: center;

  .user-icon {
    font-size: 20px;
    color: var(--el-color-primary);
  }

  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 10px;

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .user-name {
      padding: 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0 4px 0 8px;
      font-size: 16px;
      color: var(--el-color-primary);
    }

    .user-arrow-down {
      font-size: 10px;
    }


  }
}

.role-container {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--el-border-color-lighter);
  line-height: 22px;
  color: var(--el-text-color-disabled);
  font-size: var(--el-font-size-base);

  .title {
    font-size: 12px;
    padding: 5px;
    text-align: center;
  }

  .role-list {

    .role-item {
      padding: 5px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2px;
    }

    .active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-7);
    }
  }
}
</style>

<style lang="scss">
.userInfo-popper {
  .dropdown-item-label {
    width: 50px;
    text-align-last: justify;
  }

  .back_btn {
    color: var(--el-color-primary);
  }
}
</style>
