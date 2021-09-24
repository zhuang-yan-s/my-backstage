<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容卡片 -->
    <el-card class="box-card">
      <!-- 搜索用户 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="userParams.query"
            @change="getUserData"
            clearable
            @clear="getUserData"
          >
            <template slot="append"
              ><el-button icon="el-icon-search" @click="getUserData"></el-button
            ></template>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="14">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-row>
        <el-col :span="24">
          <!-- 表格数据 -->
          <el-table :data="userData" border style="width: 100%">
            <el-table-column label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="140">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="180">
            </el-table-column>
            <el-table-column prop="role_name" label="角色" width="180">
            </el-table-column>
            <el-table-column prop="mg_state" label="状态" width="100">
              <template v-slot="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 编辑按钮 -->
                <el-button
                  icon="el-icon-edit"
                  size="medium"
                  type="primary"
                  @click="editPopupShow(scope.row)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="removeUser(scope.row.id)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    size="medium"
                    icon="el-icon-delete"
                  ></el-button>
                </el-popconfirm>
                <!-- 分配角色按钮 -->
                <el-tooltip effect="dark" content="分配角色" placement="top">
                  <el-button
                    size="medium"
                    type="warning"
                    @click="userRoleShow(scope.row)"
                  >
                    <i class="el-icon-s-help"></i>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 表格数据导航 -->
      <el-row>
        <el-col :span="12">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="userParams.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="userParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userNumTotal"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加用户组件 -->
    <add-user
      v-if="addDialogVisible"
      :addShow.sync="addDialogVisible"
      @update-user-list="getUserData"
    ></add-user>
    <!-- 修改用户信息组件 -->
    <edit-user
      v-if="editDialogVisible"
      :editData="editData"
      :editShow.sync="editDialogVisible"
      @update-user-list="getUserData"
    ></edit-user>
    <!-- 分配用户角色组件 -->
    <user-role
      v-if="userRoleVisible"
      :user-role-visible.sync="userRoleVisible"
      :user-role-info="userRoleInfo"
      @update-user-list="getUserData"
    ></user-role>
  </div>
</template>

<script>
import http from '@/api/index.js'
// 修改用户信息组件
import EditUser from '@/components/editUserPopup/index.vue'
// 添加用户组件
import AddUser from '@/components/addUserPopup/index.vue'
// 分配用户角色组件
import UserRole from '@/components/userRolePopup/index.vue'
export default {
  data() {
    return {
      // 用户搜索值
      searchUserVal: '',
      // 用户数据
      userData: [],
      // 请求用户数据参数
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 用户总条数
      userNumTotal: 0,
      // 控制修改弹窗显示隐藏
      editDialogVisible: false,
      // 控制修改弹窗显示隐藏
      addDialogVisible: false,
      // 发送到修改组件数据
      editData: {},
      // 控制角色分配弹窗组件
      userRoleVisible: false,
      // 待分配角色用户的数据
      userRoleInfo: '',
    }
  },
  methods: {
    // 获取用户数据
    async getUserData() {
      console.log(111)
      const { data: res } = await http.get('users', {
        params: this.userParams,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户数据失败,请重试')
      this.userData = res.data.users
      this.userNumTotal = res.data.total
      console.log(res.data)
    },
    // 分页大小发生变化
    handleSizeChange(v) {
      this.userParams.pagesize = v
      this.getUserData()
    },
    // 分页页码发生变化
    handleCurrentChange(v) {
      this.userParams.pagenum = v
      this.getUserData()
    },
    // 用户状态变化
    async userStateChange(state) {
      const { data: res } = await http.put(
        `users/${state.id}/state/${state.mg_state}`
      )
      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state
        return this.$message.error('更新状态错误')
      }
      this.$message.success('更新状态成功')
      console.log(res)
    },
    // 显示修改用户弹窗
    editPopupShow(data) {
      this.editData = data
      this.editDialogVisible = true
    },
    // 删除用户
    removeUser(id) {
      http.delete(`users/${id}`).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error(res.data.meta.msg)
        this.$message.success(res.data.meta.msg)
        this.getUserData()
      })
    },
    // 显示分配用户角色弹窗
    userRoleShow(userInfo) {
      this.userRoleInfo = userInfo
      this.userRoleVisible = true
    },
  },
  created() {
    this.getUserData()
  },
  components: {
    EditUser,
    AddUser,
    UserRole,
  },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: unset;
  }
}
// 表格
.el-table {
  .el-button--warning {
    .el-icon-s-help {
      transition: all 1s ease;
    }
  }
  .el-button--warning:hover {
    .el-icon-s-help {
      transform: rotate(360deg);
    }
  }
  .el-button {
    margin-right: 20px;
  }
}
</style>