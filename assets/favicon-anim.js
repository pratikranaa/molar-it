(function () {
  'use strict';
  var N = 18;
  var MS = 30;
  var BASE = 'assets/favicon-frames/frame-';
  var link = document.getElementById('favicon-anim');
  if (!link || N < 2) return;
  var i = 0;
  setInterval(function () {
    i = (i + 1) % N;
    var s = i < 10 ? '0' + i : String(i);
    link.href = BASE + s + '.png?v=' + i;
  }, MS);
})();
