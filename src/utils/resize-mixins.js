// 混入代码
import { debounce } from "lodash";
const resizeChartMethod = Symbol();

export default {
  data() {
    // 在组件内部将图表init的引用映射到chart属性上
    return {
      ratio: 1,
      myChart: null,
      [resizeChartMethod]: null
    };
  },
  created() {
    var _this = this;
    this.resetRatio();
    this[resizeChartMethod] = debounce(function() {
      if (_this.myChart) {
        _this.resetRatio();
        _this.myChart.resize();
        _this.chartCallback && _this.chartCallback();
      }
    }, 100);
    window.addEventListener("resize", this[resizeChartMethod]);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("resize", this[resizeChartMethod]);
    });
  },
  methods: {
    // 重置radio
    resetRatio() {
      let fontSize = window.getComputedStyle(document.documentElement)[
        "fontSize"
      ];
      this.ratio = parseInt(fontSize) / 100;
    }
  }
};
