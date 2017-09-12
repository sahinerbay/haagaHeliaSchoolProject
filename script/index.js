"use strict";

require("babel-polyfill");

var _jquery = require("jquery");

// export for others scripts to use
window.$ = _jquery.$;
window.jQuery = _jquery.jQuery;

console.log(_jquery.$);