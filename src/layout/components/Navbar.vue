<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      v-if="!isApply"
    />
    <div class="backSystem" v-if="isApply" @click="$router.push('/index')">
      <svg-icon icon-class="back"></svg-icon>
      <span>真码通系统</span>
    </div>
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <!-- v-if="device !== 'mobile'" -->
      <template>
        <search id="header-search" class="right-menu-item" />

        <div class="right-menu-item">
          <router-link to="/terms" target="_blank">
            <img
              src="@/assets/images/question_circle.png"
              style="margin-bottom: -3px;position: relative;top: 3px;"
              width="25"
              alt=""
            />
          </router-link>
        </div>
        <div class="right-menu-item">
          <router-link to="/user/notify">
            <el-badge class="notify" :value="smsCount" :max="99">
              <i class="el-icon-bell"></i>
            </el-badge>
          </router-link>
        </div>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        style="width:auto"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <div class="avatar-name ellitext">{{ name }}</div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/center">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link v-show="isUnit" to="/apply">
            <el-dropdown-item>公安授权</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
// import Screenfull from "@/components/Screenfull";
// import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    // Screenfull,
    // SizeSelect,
    Search
  },
  props: {
    isApply: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "smsCount", "name", "roles"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
    isUnit() {
      return this.roles.includes("admin_unit");
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.href = "/";
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.navbar {
  height: 65px;
  position: relative;
  background: #0088FE;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);

  // 为了圆角左侧补充30px颜色
  &:before {
    content: "";
    width: 30px;
    height: 65px;
    position: absolute;
    left: -30px;
    top: 0;
    background-color: #0088FE;
  }

  .hamburger-container {
    line-height: 61px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .backSystem {
    width: 150px;
    height: 65px;
    color: #fff;
    float: left;
    line-height: 65px;
    padding-left: 30px;
    font-size: 16px;
    font-weight: 400;
    span {
      margin-left: 20px;
    }
  }
  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 65px;
    overflow: hidden;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      width: 50px;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      .notify {
        cursor: pointer;
        height: 20px;
        line-height: 20px;

        /deep/ .el-badge__content {
          box-sizing: content-box;
          height: 14px;
          line-height: 14px;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        height: 40px;
        margin-top: 12.5px;
        display: flex;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .avatar-name {
          max-width: 100px;
          margin: 0 0 0 10px;
          line-height: 40px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 12.5px;
        }
      }
    }
  }
}
</style>
