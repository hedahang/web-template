class Timer {
  constructor() {
    throw new Error("error");
  }

  static init(ms = 15) {
    if (Timer.isStart) return;
    Timer.isStart = true;
    Timer.t = ms;
    Timer.lastTime = new Date().getTime();
    Timer.getAnimation();
    //setInterval(Timer.progress,ms);

    Timer.ID = window.requestAnimationFrame(Timer.progress);
  }

  /**
   * 定时器启动方法
   * @param {function} fn 定时调用的方法
   * @param {number} time 时间间隔
   * @param {object} _this 调用时的实例对象
   * @param {number} num 调用次数: 0 -> 一直调用
   * @param {boolean} isG 是否立即调用
   * @param {function} callBack 当调用次数不为0时，定时器结束时调用的方法
   */
  static add(
    fn = null,
    time = 500,
    _this = null,
    num = 0,
    isG = false,
    callBack = null
  ) {
    if (!Timer.isStart) {
      Timer.init();
    }
    if (_this) fn = fn.bind(_this);
    let str = Symbol();
    // 组件销毁时清除定时器
    _this.$once("hook:beforeDestroy", () => {
      Timer.clear(str);
    });

    let obj = {};
    obj.fn = fn; //回调
    obj.time = time; //间隔
    obj.num = num; //总运行次数
    obj.cb = callBack; //完成时的回调
    obj.id = str; //计时器id
    obj.currentNum = 0; //记录已经执行的次数
    obj.f = new Date().getTime(); //记录加入时的时间(执行时的时间戳)

    // 是否立即执行
    if (isG) {
      obj.currentNum++;
      obj.fn();
    }
    Timer.timerArr.push(obj);
    return str;
  }

  static progress() {
    Timer.currentTime = new Date().getTime();
    Timer.t = Timer.currentTime - Timer.lastTime;
    Timer.FPS = (1000 / Timer.t) | 0;
    Timer.timerArr.forEach(a => {
      if (Timer.currentTime - a.f > a.time) {
        if (a.fn) {
          a.fn();
          a.f = new Date().getTime();
        }
        a.currentNum++;
        if (a.currentNum === a.num) {
          if (a.cb) a.cb();
          Timer.clear(a.id);
        }
      }
    });
    Timer.lastTime = Timer.currentTime;
    Timer.ID = window.requestAnimationFrame(Timer.progress);
  }

  static clear(str) {
    let v = -1;
    for (let i = 0; i < Timer.timerArr.length; i++) {
      let obj = Timer.timerArr[i];
      if (obj.id === str) {
        v = i;
        for (let o in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, o)) {
            delete obj[o];
          }
        }
        Timer.timerArr.splice(v, 1);
      }
    }
    if (Timer.timerArr.length === 0) {
      Timer.isStart = false;
      window.cancelAnimationFrame(Timer.ID);
    }
  }

  static clearAll() {
    Timer.timerArr.length = 0;
  }

  static getAnimation() {
    let lastTime = 0;
    let vendors = ["ms", "moz", "webkit", "o"];

    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame =
        window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame =
        window[vendors[x] + "CancelAnimationFrame"] ||
        window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback) {
        let currTime = new Date().getTime();
        let timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }
}
Timer.timerArr = [];
Timer.isStart = false;
Timer.t = 0; //时间间隔
Timer.currentTime = 0;
Timer.lastTime = 0;
Timer.TIME = 0;
Timer.FPS = 0;
Timer.ID = 0;
export default Timer;
