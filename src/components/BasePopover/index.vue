<template>
  <el-popover
    class="el-button-popover"
    placement="top"
    v-model="isShow"
    width="160"
  >
    <p>{{ isDelete ? `确定${text}吗？` : desc }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="handleCancel">{{
        leftBtn
      }}</el-button>
      <el-button type="danger" plain size="mini" @click="handleFun">{{
        rightBtn
      }}</el-button>
    </div>
    <el-button slot="reference" size="mini" type="text">{{ text }}</el-button>
  </el-popover>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "删除"
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    desc: {
      type: String,
      default: "确认选择?"
    },
    leftBtn: {
      type: String,
      default: "取消"
    },
    rightBtn: {
      type: String,
      default: "确定"
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    handleFun() {
      this.$emit("handleFun");
      this.isShow = false;
    },
    handleCancel() {
      this.$emit("handleCancel");
      this.isShow = false;
    }
  }
};
</script>

<style></style>
