<template>
  <div class="home app-container">
    2131231231231
  </div>
</template>
<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      dateRange: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      personTypeOptions: [],
      unitActivityOptions: [],
      curObj: {}, // 当前类型 机构/活动
      curType: 1,
      timeOptions: [
        {
          label: "今天",
          value: 0
        },
        {
          label: "近7日",
          value: 7
        },
        {
          label: "近30日",
          value: 30
        },
        {
          label: "近一年",
          value: 365
        }
      ],
      queryParams: {
        startTime: undefined,
        endTime: undefined
      },
      dialogDatas: {
        visible: false,
        row: {}
      },
      dialogVisit: {
        visible: false,
        row: {
          remark: "已进入"
        }
      },
      dialogInvite: {
        visible: false,
        row: {}
      }
    };
  },
  computed: {
    roles() {
      return this.$store.getters.roles;
    },
    isPlatform() {
      return this.roles.includes("admin_platform");
    },
    permissions() {
      return this.$store.getters.permissions;
    },
    isShow() {
      const all_permission = "*:*:*";
      return this.permissions.some(permission => {
        return all_permission === permission || permission === "home:home:list";
      });
    }
  },
  created() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.home {
  .home-header {
    .home-header-filter {
      .el-form-item {
        margin-bottom: 0;
      }
      .shortcut {
        width: 240px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border-radius: 4px;
        font-size: 13px;
        color: #8c8c8c;
        border: 1px solid #dcdfe6;
        .row {
          height: 20px;
          line-height: 20px;
          padding: 0 10px;
          cursor: pointer;
          & + .row {
            border-left: 1px solid #d8d8d8;
          }
          &.select {
            color: #000000;
            font-weight: bold;
          }
        }
      }
      .home-header-btn {
        width: 120px;
        height: 40px;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        background-color: #fff;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
          display: block;
          margin-right: 6px;
        }
      }
    }
    .home-header-top {
      margin-top: 0.2rem;
      .lf {
        flex-shrink: 0;
        width: 11.62rem;
      }
      .rt {
        padding-left: 0.22rem;
        flex: 1;
      }
    }
  }
  .home-content {
    .lf-chart {
      flex-shrink: 0;
      width: 11.62rem;
      flex-wrap: wrap;
      justify-content: space-between;
      /deep/ .home-chart-row {
        margin-top: 0.2rem;
        width: 5.7rem;
        height: 3.67rem;
        background: #ffffff;
        box-shadow: 0.04rem 0.04rem 0.1rem 0px rgba(218, 218, 218, 0.5);
        border-radius: 0.1rem;
        padding-top: 0.25rem;
        .chart-title {
          width: 100%;
          padding-left: 0.25rem;
          height: 0.26rem;
          line-height: 0.26rem;
          font-size: 0.2rem;
          font-weight: bold;
          color: #333333;
        }
      }
    }
    .rt-list {
      padding-left: 0.22rem;
      flex: 1;
    }
  }
}
</style>
