<template>
  <div class="home">
    <div class="container">
      <el-form ref="form" :model="form" label-width="100px">
        <h1 style="margin-bottom: 40px">学生管理系统</h1>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学号/职工号">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="学院" v-if="collegeState">
          <el-input v-model="form.college"></el-input>
        </el-form-item>
        <el-form-item label="身份" v-if="collegeState">
          <el-select v-model="form.identity" placeholder="请选择您的身份">
            <el-option label="学生" value="学生"></el-option>
            <el-option label="教师" value="教师"></el-option>
          </el-select>
        </el-form-item>
        <div class="bottom">
          <el-button type="primary" style="text-align:center" size="medium" v-if="!collegeState" @click="loginPost">登录</el-button>
          <el-button type="primary" style="text-align:center" size="medium" v-if="collegeState" @click="registerPost">注册</el-button>
          <span style="line-height:36px;margin-left:12px;color:blue;cursor: pointer" v-if="!collegeState" @click="register()">注册</span>
          <span style="line-height:36px;margin-left:12px;color:blue;cursor: pointer" v-if="collegeState" @click="backtoLogin()">返回登录</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Message } from 'element-ui'
import jwtDecode from 'jwt-decode'
export default {
  name: 'Home',
  data () {
    return {
      form: {
        name: '',
        num: '',
        password: '',
        college: '',
        identity: ''
      },
      collegeState: false // 学院输入框状态
    }
  },
  methods: {
    // 返回登录
    backtoLogin () {
      this.form.name = ''
      this.form.num = ''
      this.form.password = ''
      this.form.college = ''
      this.collegeState = false
    },
    // 点击显示注册页面
    register () {
      this.form.name = ''
      this.form.num = ''
      this.form.password = ''
      this.form.college = ''
      this.collegeState = true
    },
    // 注册
    registerPost () {
      const params = {
        name: this.form.name,
        num: this.form.num,
        password: this.form.password,
        college: this.form.college,
        identity: this.form.identity
      }
      this.$axios
        .post('http://localhost:5000/api/user/register', params)
        .then((res) => {
          if (res.data.code === 200) {
            Message.success('注册成功')
            this.collegeState = false
            this.form.name = ''
            this.form.num = ''
            this.form.password = ''
            this.form.college = ''
          } else {
            Message.error('该账号已注册')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 登录
    loginPost () {
      const params = {
        name: this.form.name,
        num: this.form.num,
        password: this.form.password
      }
      this.$axios
        .post('http://localhost:5000/api/user/login', params)
        .then(res => {
          if (res.data.code === 200) {
            Message.success('登录成功')
            // token存到localstorage
            var token = res.data.token
            localStorage.setItem('loginToken', token)
            const decode = jwtDecode(token)

            // token存到vuex
            this.$store.dispatch('setUser', decode)
            this.$router.push('/about')
          } else if (res.data.code === 404) {
            Message.error('用户不存在')
          } else {
            Message.error('密码错误')
          }
        })
        .catch(err => {
          console.log('发生错误', err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.home{
  width: 100%;
  height: 100%;
  background: url(../assets/timg.png) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: cover;
  position: relative;
  .container{
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width:596px;
    height:444px;
    background:rgb(140, 161, 230);
    box-shadow:0px 5px 12px rgba(0,0,0,0.2);
    opacity:0.69;
    border-radius:4px;
    h1 {
      text-align: center;
    }
    .bottom{
      display: flex;
      justify-content: center;
    }
  }
}
</style>

<style lang="less">
  .el-input__inner {
    width:410px !important;
    height:36px !important;
    background:rgb(255, 255, 255) !important;
    border:1px solid rgba(217,217,217,1) !important;
    opacity:1 !important;
    border-radius:4px !important;
  }
  .el-form-item__label {
    color: black !important;
  }
  .el-form-item {
    margin-bottom: 20px !important;
  }
  .el-input .el-input__clear {
    position: absolute;
    right: 92px;
  }
</style>
