<template>
  <div class="about">
    <div class="header">
      <div class="hello">
        <h3>你好:{{this.userData.name}}{{identity}}</h3>
      </div>
      <div class="exit">
        <h3 @click="exitMeth" style="color:blue;cursor: pointer">退出登录</h3>
      </div>
    </div>
    <div class="tableContent">
      <h1 style="text-align:center">学生信息</h1>
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="250"></el-table-column>
        <el-table-column prop="num" label="学号" width="250"></el-table-column>
        <el-table-column prop="college" label="学院" width="250"></el-table-column>
        <el-table-column prop="date" label="注册时间" :width="operateState === true ? 250 : 600"></el-table-column>
        <el-table-column label="操作" v-if="operateState">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" size="mini" @click="openDia(scope.row)">修改信息</el-button>
              <el-button type="primary" size="mini" @click="removeUser(scope.row.num)">移除学生</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="信息修改"
      class="pzp_dia"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学号/职工号">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="form.college"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      identity: '',
      operateState: false,
      dialogVisible: false,
      tempObj: {},
      tempNum: '',
      form: {
        name: '',
        num: '',
        college: ''
      }
    }
  },
  computed: {
    userData () {
      if (this.$store.getters.userInfo) {
        return this.$store.getters.userInfo
      } else {
        return []
      }
    }
  },
  created () {
    if (this.userData.identity === '教师') {
      this.getUsers()
      this.identity = '老师'
      this.operateState = true
    } else {
      var dateTemp = new Date(this.userData.date)
      this.userData.date = dateTemp.getFullYear() + '-' + dateTemp.getMonth() + 1 + '-' + dateTemp.getDate()
      this.tableData.push(this.userData)
      this.identity = '同学'
    }
  },
  methods: {
    getUsers () {
      this.$axios
        .post('http://localhost:5000/api/user/getUsers', {})
        .then(res => {
          res.data.user.forEach((el, index) => {
            var dateNow = new Date(el.date)
            el.date = dateNow.getFullYear() + '-' + dateNow.getMonth() + 1 + '-' + dateNow.getDate()
          })
          this.tableData = res.data.user
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 退出登录
    exitMeth () {
      localStorage.removeItem('loginToken')
      this.$store.dispatch('clearData')
      this.$router.push('/')
    },
    // 移除学生
    removeUser (param) {
      const params = { num: param }
      this.$axios
        .post('http://localhost:5000/api/user/deleteUser', params)
        .then(res => {
          if (res.data.code === 200) {
            Message.success('移除成功')
            this.getUsers()
          } else {
            Message.error('出错了，请重试')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改信息   测试驱蚊器翁无群
    openDia (row) {
      this.tempObj = row
      this.tempNum = row.num
      this.form.name = row.name
      this.form.num = row.num
      this.form.college = row.college
      this.dialogVisible = true
    },
    updateUser () {
      const params = {
        num1: this.tempNum,
        name: this.form.name,
        num: this.form.num,
        college: this.form.college
      }
      this.$axios
        .post('http://localhost:5000/api/user/updateUser', params)
        .then(res => {
          if (res.data.code === 200) {
            this.dialogVisible = false
            this.getUsers()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100%;
  position: relative;
  .tableContent {
    width: 100%;
    background-color: #f5f5f5
  }
  .header{
    display: flex;
    justify-content: space-between;
  }
}
</style>
