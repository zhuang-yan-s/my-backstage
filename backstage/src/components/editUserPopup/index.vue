<template>
  <!-- 添加用户弹窗 -->
  <el-dialog
    title="修改用户信息"
    :visible.sync="editShow"
    width="400px"
    @close="closeDialog"
  >
    <!-- 修改表单 -->
    <el-form :model="editTempData" ref="editFormRef">
      <el-form-item label="用户名" label-width="20%">
        <el-input
          v-model="editTempData.username"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="20%">
        <el-input v-model="editTempData.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" label-width="20%">
        <el-input v-model="editTempData.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- 操作按钮 -->
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitEdit">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/api/index.js'
export default {
  data() {
    return {
      editTempData: {
        id: '',
        email: '',
        mobile: '',
        username: '',
      },
    }
  },
  methods: {
    // 提交修改请求
    submitEdit() {
      http.put(`users/${this.editData.id}`, this.editTempData).then((res) => {
        if (res.data.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.$emit('update-user-list')
        this.closeDialog()
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:edit-show', false)
    },
  },
  props: ['editData', 'edit-show'],
  created() {
    this.editTempData.id = this.editData.id
    this.editTempData.email = this.editData.email
    this.editTempData.mobile = this.editData.mobile
    this.editTempData.username = this.editData.username
  },
}
</script>

<style>
</style>