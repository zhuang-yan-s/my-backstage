<template>
  <!-- 添加用户弹窗 -->
  <el-dialog
    title="添加用户"
    :visible.sync="addShow"
    width="400px"
    :before-close="closeDialog"
  >
    <!-- 添加表单 -->
    <el-form :model="addUserDatd" :rules="addRules" ref="addFormRef">
      <el-form-item label="用户名" label-width="20%" prop="username">
        <el-input v-model="addUserDatd.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="20%" prop="password">
        <el-input
          v-model="addUserDatd.password"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="20%">
        <el-input v-model="addUserDatd.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" label-width="20%">
        <el-input v-model="addUserDatd.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- 操作按钮 -->
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitAdd">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/api/index.js'
export default {
  data() {
    return {
      // 添加用户表单数据
      addUserDatd: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户表单规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 提交添加用户
    submitAdd() {
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild) return
        http.post('users', this.addUserDatd).then((res) => {
          console.log(res)
          if (res.data.meta.status !== 201)
            return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.$emit('update-user-list')
          this.closeDialog()
        })
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:add-show', false)
    },
  },
  props: ['add-show'],
}
</script>

<style>
</style>