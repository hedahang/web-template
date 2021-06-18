<template>
  <div class="login">
    <div class="lf">
      <img
        class="bg1 animate__animated animate__fadeInDown"
        src="@/assets/images/login-bg-1.png"
        alt=""
      />
      <div class="lf-bg-center">
        <img class="bg2" src="@/assets/images/login-bg-2.png" alt="" />
      </div>
      <div class="lf-bg-bottom">
        <img class="bg3" src="@/assets/images/login-bg-3.png" alt="" />
      </div>
      <div class="lf-text">
        <div class="lf-text-title">
          实我•真码通
        </div>
        <div class="lf-text-desc">
          基于“互联网+”可信身份认证平台，采用人、证、码组合验证方式为企事业单位构筑安全边界。
        </div>
      </div>
    </div>
    <div class="rt">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        :hide-required-asterisk="true"
      >
        <div class="title">欢迎登录</div>
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model.trim="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin"
          >
          </el-input>
        </el-form-item>
        <div class="remenber">
          <el-checkbox v-model="loginForm.rememberMe" style="color:#B3B3B3"
            >记住账号</el-checkbox
          >
        </div>
        <el-form-item style="width:100%;">
          <el-button
            class="login-btn"
            :loading="loading"
            size="medium"
            type="primary"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div class="rt-tips">
        四川中京安民科技有限公司
      </div>
    </div>
  </div>
</template>

<script>
import { util } from "@/utils/common";
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        // username: "admin",
        // password: "123456",
        username: undefined,
        password: undefined,
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      defaultPsd: "**:**:**",
      cachePsd: null
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    let loginForm = Cookies.get("accountInfo");
    if (loginForm) {
      let json = JSON.parse(loginForm);
      this.cachePsd = json.password;
      json.password = this.defaultPsd;
      this.loginForm = json;
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let { username, password } = this.loginForm;
          if (password == this.defaultPsd) {
            password = this.cachePsd;
          } else {
            // 加密
            password = util
              .md5(password)
              .toString()
              .toUpperCase();
          }
          this.$store
            .dispatch("Login", { username, password })
            .then(() => {
              if (this.loginForm.rememberMe) {
                Cookies.set(
                  "accountInfo",
                  JSON.stringify({ ...this.loginForm, password })
                );
              }
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less">
@step: 1.5s;
@step2: 2s;
@keyframes privateFadeInDown {
  0% {
    opacity: 0;
    transform: translate3d(0, -20%, 0);
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
@keyframes fade2 {
  0% {
    opacity: 0;
    transform: translate3d(0, -20%, 0);
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
@keyframes fade3 {
  0% {
    opacity: 0;
    transform: translate3d(0, -100px, 0);
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .lf {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
    background: linear-gradient(314deg, #2957cb 0%, #271b76 100%);
    position: relative;
    text-align: center;
    .bg1,
    .bg3 {
      animation: privateFadeInDown;
      animation-duration: @step;
    }
    .bg1 {
      width: 745px;
      height: 303px;
    }
    .lf-bg-bottom {
      position: absolute;
      bottom: 35px;
      overflow: hidden;
      .bg3 {
        width: 964px;
        height: 465px;
      }
    }
    .lf-bg-center {
      position: absolute;
      bottom: 145px;
      .bg2 {
        opacity: 0;
        transform: translateY(-20%);
        animation: fade2;
        animation-duration: @step2;
        animation-delay: 1s;
        animation-fill-mode: forwards;
        width: 635px;
        height: 430px;
        margin-left: 70px;
      }
    }
    .lf-text {
      position: absolute;
      top: 190px;
      opacity: 0;
      animation: fade3;
      animation-duration: @step2;
      animation-delay: 1s;
      animation-fill-mode: forwards;
      &-title {
        width: 100%;
        height: 72px;
        font-size: 55px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ffffff;
        line-height: 72px;
      }
      &-desc {
        margin-top: 40px;
        width: 100%;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        line-height: 21px;
      }
    }
  }
  .rt {
    background-color: #fff;
    flex-shrink: 0;
    height: 100%;
    // width: 556px;
    width: 33.3%;
    position: relative;
    .login-form {
      margin: 200px auto;
      border-radius: 6px;
      background: #ffffff;
      width: 400px;
      padding: 25px 25px 5px 25px;
      .title {
        width: 130px;
        color: #707070;
        height: 44px;
        font-size: 22px;
        font-weight: bold;
        color: #000000;
        line-height: 44px;
        position: relative;
        margin-bottom: 50px;
        &:after {
          content: "";
          position: absolute;
          left: 3px;
          bottom: 0;
          width: 84px;
          background-color: #283ea8;
          height: 2px;
        }
      }
      .el-form-item {
        .el-form-item__label {
          line-height: 30px;
        }
        .el-input {
          .el-input__inner {
            border: none;
            border-bottom: 1px solid #b3b3b3;
            padding: 0;
            border-radius: 0;
            height: 30px;
            line-height: 30px;
            &:focus {
              border-color: #f56c6c;
            }
          }
        }
      }
      .remenber {
        width: 100%;
        text-align: right;
        margin-bottom: 25px;
      }
      .login-btn {
        width: 100%;
        height: 40px;
        background: linear-gradient(314deg, #3894f7 0%, #1e15c9 100%);
        box-shadow: 0px 13px 16px 0px rgba(174, 209, 255, 0.58);
        border-radius: 2px;
        border: none;
      }
    }
    .rt-tips {
      position: absolute;
      bottom: 30px;
      width: 100%;
      height: 20px;
      font-size: 12px;
      color: #b3b3b3;
      line-height: 20px;
      text-align: center;
    }
  }
}
</style>
