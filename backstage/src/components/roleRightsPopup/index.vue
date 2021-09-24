<template>
  <!-- 添加用户弹窗 -->
  <el-dialog
    title="分配权限"
    :visible.sync="rightsDialogShow"
    width="400px"
    :before-close="closeDialog"
  >
    <!-- 权限树 -->
    <el-tree
      :data="rightsList"
      :props="treeProps"
      :default-checked-keys="rightsTreeKeys"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="treeRef"
    ></el-tree>
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
      // 权限列表
      rightsList: [],
      // 树配置参数
      treeProps: {
        children: 'children',
        label: 'authName',
      },
    }
  },
  methods: {
    // 提交分配权限
    async comfirm() {
      const rids = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ].join(',')
      const { data: res } = await http.post(`roles/${this.roleId}/rights`, {
        rids,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('分配成功')
      this.closeDialog()
      this.$emit('updata-list')
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:rights-dialog-show', false)
    },
    // 获取权限列表
    getRightsList() {
      http.get('rights/tree').then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.rightsList = res.data.data
      })
    },
  },
  props: ['rights-tree-keys', 'rights-dialog-show', 'role-id'],
  created() {
    this.getRightsList()
  },
}
</script>

<style>
</style>