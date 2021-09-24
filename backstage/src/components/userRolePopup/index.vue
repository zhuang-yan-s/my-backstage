<template>
  <!-- 添加用户弹窗 -->
  <el-dialog
    title="分配用户角色"
    :visible.sync="userRoleVisible"
    width="400px"
    :before-close="closeDialog"
  >
    <p class="dialog-row">当前用户: {{ userRoleInfo.username }}</p>
    <p class="dialog-row">当前角色: {{ userRoleInfo.role_name }}</p>
    <div class="dialog-row">
      <span>分配新角色: </span>
      <el-select v-model="selectVal" placeholder="请选择角色">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <!-- 操作按钮 -->
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="comfirm">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/api/index.js'
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      // 选择框选择的值
      selectVal: '',
    }
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      http.get('roles').then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error(res.data.meta.msg)
        this.roleList = res.data.data
        console.log(res.data)
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:user-role-visible', false)
    },
    // 确定事件
    async comfirm() {
      if (!this.selectVal) return this.$message.warning('请选择要分配的角色')
      const { data: res } = await http.put(
        `users/${this.userRoleInfo.id}/role`,
        { rid: this.selectVal }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.$emit('update-user-list')
      this.closeDialog()
    },
  },
  props: ['user-role-visible', 'user-role-info'],
  created() {
    this.getRoleList()
  },
}
</script>

<style lang="scss" scoped>
.el-dialog {
  .dialog-row {
    margin: 10px 0;
    font-size: 16px;
  }
}
</style>