(function(c, d) {
  var e = document.documentElement || document.body,
    a = "orientationchange" in window ? "orientationchange" : "resize",
    b = function() {
      var f = e.clientWidth < 1280 ? 1280 : e.clientWidth;
      e.style.fontSize = f >= 1920 ? "100px" : 100 * (f / 1920) + "px";
    };
  b();
  c.addEventListener(a, b, false);
})(window);
