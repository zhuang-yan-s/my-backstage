<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar">
        <img src="../../assets/porco014-avatar.jpg" alt="" />
      </div>
      <!-- 表单 -->
      <div class="form">
        <el-form ref="formRef" :rules="loginRules" :model="form">
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="form.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-coffee-cup"
              show-password
              v-model="form.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button type="primary" @click="submitForm('formRef')"
              >登录</el-button
            >
            <el-button type="info" @click="resetForm('formRef')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/api/index.js'
export default {
  data() {
    // 自定义表单验证规则
    // value时输入的值, calllback时错误提示信息
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      // 表单绑定数据
      form: {
        username: 'admin',
        password: '123456',
      },
      // 表单验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        password: [{ validator: validatePass, trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 表单校验
    submitForm(formName) {
      // form表单方法,validate,如果表单有一项规则不符合形参就为false, 全部满足为true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http.post('login', this.form).then((res) => {
            if (res.data.meta.status == 200) {
              this.$message.success('登录成功')
              // 将返回值token存入本地作为访问其他页面的令牌
              sessionStorage.setItem('token', res.data.data.token)
              // 跳转到首页
              this.$router.push('/home')
            } else if (res.data.meta.status == 400) {
              this.$message.error('登录失败，请检查用户名或密码！！！')
            }
          })
        } else {
          return false
        }
      })
    },
    // 表单重置
    resetForm(formName) {
      console.log(this.$refs[formName])
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果, 需要配置rules
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
// 登录框
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  // 头像
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 1px 1px 3px 0px #555;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 表单
  .form {
    width: 80%;
    margin: 80px auto 0;
    .form-btn {
      text-align: right;
    }
  }
}
</style>