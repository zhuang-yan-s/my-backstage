<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <!-- 头像 -->
      <div class="home-avatar">
        <img src="../../assets/porco014-avatar.jpg" alt="" />
      </div>
      <!-- 退出登录按钮 -->
      <div class="logout">
        <el-button type="info" @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="menuFold ? '64px' : '200px'">
        <!-- 顶部折叠条 -->
        <div class="menu-fold" @click="collapseMenu">
          <i :class="menuFold ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
        </div>
        <!-- 导航 -->
        <el-menu
          router
          unique-opened
          :collapse="menuFold"
          :collapse-transition="false"
          background-color="#725e82"
          text-color="#fff"
          active-text-color="#ff2d51"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              class="el-icon-menu"
              >{{ subItem.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主要区域 -->
      <el-main>
        <!-- 路由视图 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import http from '@/api/index.js'
export default {
  data() {
    return {
      // 导航列表
      menuList: [],
      // 导航图标
      menuIcon: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
      },
      // 菜单折叠
      menuFold: false,
    }
  },
  methods: {
    // 请求菜单数据
    async getMenu() {
      const { data: res } = await http.get('menus')
      if (!res.meta.status == 200) return this.$message.error('获取数据失败')
      this.menuList = res.data
      console.log(res)
    },
    // 折叠菜单
    collapseMenu() {
      this.menuFold = !this.menuFold
    },
    // 退出登录
    logout() {
      window.sessionStorage.removeItem('token')
      this.$message('退出登录')
      this.$router.replace('/login')
    },
  },
  created() {
    this.getMenu()
  },
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
// 头部样式
.el-header {
  background-color: #425066;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .home-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
// 侧边栏
.el-aside {
  background-color: #725e82;
  // 折叠条
  .menu-fold {
    font-size: 20px;
    color: #fff;
    text-align: center;
  }
  // 导航
  .el-menu {
    border-right-width: 0;
    .el-submenu__title {
      i {
        color: #fff;
      }
    }
  }
}
// 中心页面
.el-main {
  background-color: #fffbf0;
}
</style>