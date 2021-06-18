<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar
      class="sidebar-container"
      :style="{
        backgroundColor: variables.menuLightBg
      }"
    />
    <div :class="{ hasTagsView: true }" class="main-container">
      <div :class="{ 'fixed-header': true }">
        <navbar />
        <tags-view v-if="true" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import variables from "@/assets/styles/variables.less";

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    // Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      };
    },
    variables() {
      return variables;
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/styles/mixin.less";
@import "~@/assets/styles/variables.less";

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background: #e8edf7;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - @sideBarWidth);
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
