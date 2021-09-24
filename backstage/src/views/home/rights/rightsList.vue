<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-card class="box-card">
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="authName" label="说明"></el-table-column>
        <el-table-column label="等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">等级一</el-tag>
            <el-tag v-if="scope.row.level == 1" type="warning">等级二</el-tag>
            <el-tag v-if="scope.row.level == 2" type="danger">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import http from '@/api/index.js'
export default {
  data() {
    return {
      rightsList: [],
    }
  },
  methods: {
    getRightsList() {
      http.get('rights/list').then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.rightsList = res.data.data
      })
    },
  },
  created() {
    this.getRightsList()
  },
}
</script>

<style>
</style>