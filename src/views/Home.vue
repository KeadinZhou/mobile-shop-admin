<template>
  <div>
    <!--        <el-button @click="debug()"></el-button>-->
    <!--        <img :src="'data:image/jpg;base64,'+ this.captcha" alt="">-->
    <el-card class="box-card" shadow="hover">
      <div class="imgBox">
        <img src="@/assets/login.png" alt="" width="110px">
      </div>
      <div class="page-title">
        <b>{{this.$store.state.user.id===-9?'登  录':'Admin'}}</b>
      </div>
      <el-divider><i class="el-icon-postcard"></i></el-divider>
      <template v-if="this.$store.state.user.id===-9">
        <div class="form-box">
          <el-form :model="FormData" status-icon :rules="rules" ref="FormData" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input
                      v-model="FormData.username"
                      placeholder="账号"
                      prefix-icon="el-icon-user">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password"
                        v-model="FormData.password"
                        placeholder="密码"
                        prefix-icon="el-icon-key"
                        @keyup.enter.native="submitForm('FormData')">
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="submitBox">
                <el-button class="submitButton" type="primary" @click="submitForm('FormData')">登录</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-else>
        <el-button style="position: relative;left: 50%;transform: translate(-50%,0);" @click="$router.push('/item')">进入系统</el-button>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        captcha: '',
        FormData: {
          username: '',
          password: ''
        },
        rules: {
          username: [{ required: true, message: '请输入你的账号!', trigger: 'blur' }],
          password: [{ required: true, message: '请输入你的密码!', trigger: 'blur' }]
        }
      }
    },
    methods: {
      login (username, password) {
        const that = this
        that.$http.post(that.$store.state.api + '/session', {
          username: username,
          password: password
        })
        .then(data => {
          const Data = data.data.data
          console.log(Data)
          that.$store.commit('updateUser')
          that.$message.success('登录成功')
          that.$router.push('/item')
        })
        .catch(function (error) {
          if (error.response) {
            const tmp = error.response.data.msg
            if ((typeof tmp) === 'string') {
              that.$message.error(tmp)
            } else {
              for (const index in tmp) {
                that.$message.error(tmp[index][0])
                break
              }
            }
          }
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login(this.FormData.username, this.FormData.password)
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .box-card{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
  }
  .imgBox{
    position: absolute;
    margin-top: 10px;
    left: 50%;
    transform: translate(-50%,0);
  }
  .form-box{
    width: 80%;
    float: left;
    transform: translate(12%,0);
  }
  .page-title{
    width: 100%;
    margin-top: 150px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 25px;
  }
  .submitBox{
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .submitButton{
    width: 100%;
    height: auto;
  }
</style>
