<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu :default-active="route.path" class="el-menu-vertical" router>
        <el-menu-item index="/dashboard">
          <el-icon>
            <DataLine />
          </el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/posts">
          <el-icon>
            <Document />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/categories">
          <el-icon>
            <Files />
          </el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/tags">
          <el-icon>
            <Collection />
          </el-icon>
          <span>标签管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              管理员
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
  import { useUserStore } from '@/stores/user'

  import { useRoute, useRouter } from 'vue-router'
  import { DataLine, Document, Files, Collection, ArrowDown } from '@element-plus/icons-vue'

  const route = useRoute()
  const router = useRouter()

  const handleLogout = () => {
    // 实现登出逻辑
    const userStore = useUserStore()
    userStore.clearUserInfo()
    router.push('/login')
  }
</script>

<style scoped>
  .layout-container {
    height: 100vh;
  }

  .el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }

  .el-aside {
    background-color: #545c64;
  }

  .el-menu {
    border-right: none;
  }

  :deep(.el-menu) {
    background-color: #545c64;
  }

  :deep(.el-menu-item) {
    color: #fff;
  }

  :deep(.el-menu-item:hover) {
    background-color: #434a50;
  }

  :deep(.el-menu-item.is-active) {
    background-color: #434a50;
    color: #409eff;
  }

  :deep(.el-menu-item .el-icon) {
    color: #fff;
  }

  :deep(.el-menu-item.is-active .el-icon) {
    color: #409eff;
  }

  .header-right {
    cursor: pointer;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
    color: #409eff;
  }

  :deep(.el-main) {
    padding: 0 !important;
  }
</style> 