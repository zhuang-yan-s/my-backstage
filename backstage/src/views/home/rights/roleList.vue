<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色表格 -->
    <el-table :data="roles" border>
      <!-- 权限展开 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row
            v-for="(item, i1) in scope.row.children"
            :key="item.id"
            :class="['rowBottom', i1 === 0 ? 'rowTop' : '', 'vcenter']"
          >
            <!-- 一级权限 -->
            <el-col :span="6"
              ><el-tag closable @close="deleteRole(scope.row, item.id)"
                >{{ item.authName }}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染一级的children得到二级权限和三级权限 -->
            <el-col :span="18">
              <el-row
                v-for="(item2, i2) in item.children"
                :key="item2.id"
                :class="[i2 === 0 ? '' : 'rowTop', 'vcenter']"
              >
                <!-- 二级权限 -->
                <el-col :span="10"
                  ><el-tag
                    type="warning"
                    closable
                    @close="deleteRole(scope.row, item2.id)"
                    >{{ item2.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="14">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="danger"
                    closable
                    @close="deleteRole(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
            <!-- 三级权限 -->
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" width="50px"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template v-slot="scope">
          <!-- 编辑按钮 -->
          <el-button
            icon="el-icon-edit"
            size="medium"
            type="primary"
          ></el-button>
          <!-- 删除按钮 -->
          <el-popconfirm title="确定删除吗？">
            <el-button
              slot="reference"
              type="danger"
              size="medium"
              icon="el-icon-delete"
            ></el-button>
          </el-popconfirm>
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配权限" placement="top">
            <el-button
              size="medium"
              type="warning"
              @click="allocateRights(scope.row)"
            >
              <i class="el-icon-s-help"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配角色权限弹框组件 -->
    <role-rights-popup
      v-if="roleRightsPopupShow"
      :rights-dialog-show.sync="roleRightsPopupShow"
      :rights-tree-keys="rightsTreeKeys"
      :roleId="roleId"
      @updata-list="getRoles"
    ></role-rights-popup>
  </div>
</template>

<script>
import http from '@/api/index.js'
import RoleRightsPopup from '@/components/roleRightsPopup/index.vue'
export default {
  data() {
    return {
      // 角色列表
      roles: [],
      // 控制角色权限分配组件显示隐藏
      roleRightsPopupShow: false,
      // 角色权限树已有数据
      rightsTreeKeys: [],
      // 分配权限角色id
      roleId: '',
    }
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      console.log(111)
      const { data: res } = await http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.mag)
      }
      this.roles = res.data
    },
    // 删除角色权限
    async deleteRole(role, rightsId) {
      const confirmResult = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
      if (confirmResult === 'confirm') {
        const { data: res } = await http.delete(
          `roles/${role.id}/rights/${rightsId}`
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        role.children = res.data
      }
    },
    // 分配角色
    allocateRights(role) {
      this.roleId = role.id
      let arr = []
      // 调用递归函数获取当前角色最后一层节点
      this.recursiveRights(role, arr)
      this.rightsTreeKeys = arr
      this.roleRightsPopupShow = true
    },
    // 获取当前角色权限的递归函数
    recursiveRights(node, arr) {
      // 如果当前节点没有children 就表明是最后一项, 将这一项的id 添加到数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果存在children, 遍历节点的每一项, 再次调用这个函数进行判断
      node.children.forEach((el) => {
        this.recursiveRights(el, arr)
      })
    },
  },
  created() {
    this.getRoles()
  },
  components: {
    RoleRightsPopup,
  },
}
</script>

<style lang="scss" scoped>
.rowBottom {
  border-bottom: 1px solid #eee;
}
.rowTop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 8px;
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