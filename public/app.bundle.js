/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(1);

var _main2 = _interopRequireDefault(_main);

var _util = __webpack_require__(2);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = new _util2.default();
var main = new _main2.default(util);

console.log(window.requestAnimationFrame);

main.beginGame(1000, window.requestAnimationFrame);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
  function Main(util, requestAnimationFrame) {
    _classCallCheck(this, Main);

    this.stopSim = false;
    this.now = Date.now();
    this.then = Date.now();
    this.fps = 1000;
    this.elapsed = null;
    this.util = util;
    this.requestAnimationFrame = requestAnimationFrame;
    console.log('this in constructor is ' + this);
  }

  _createClass(Main, [{
    key: 'beginGame',
    value: function beginGame(framesPerSecond) {
      if (this.util.getType(framesPerSecond) === '[object Number]') {
        this.fps = framesPerSecond;
        this.mainLoop();
      }
    }
  }, {
    key: 'mainLoop',
    value: function mainLoop() {
      console.log('this in mainLoop is ' + this);

      if (this.stopSim) {
        return;
      }

      this.now = Date.now();
      this.elapsed = this.now - this.then;

      if (this.elapsed > this.fps) {
        this.update();
        this.render();
        this.then = this.now - this.elapsed % this.fps;
      }

      this.requestAnimationFrame(this.mainLoop);
    }
  }, {
    key: 'update',
    value: function update() {
      console.log('updating');
    }
  }, {
    key: 'render',
    value: function render() {}
  }]);

  return Main;
}();

exports.default = Main;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//
//  Utility functions
//
var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, [{
    key: "getType",
    value: function getType(elem) {
      // Object.prototype.toString.call([]); // [object Array]
      // Object.prototype.toString.call({}); // [object Object]
      // Object.prototype.toString.call(''); // [object String]
      // Object.prototype.toString.call(new Date()); // [object Date]
      // Object.prototype.toString.call(1); // [object Number]
      // Object.prototype.toString.call(function () {}); // [object Function]
      // Object.prototype.toString.call(/test/i); // [object RegExp]
      // Object.prototype.toString.call(true); // [object Boolean]
      // Object.prototype.toString.call(null); // [object Null]
      // Object.prototype.toString.call(); // [object Undefined]
      return Object.prototype.toString.call(elem);
    }
  }]);

  return Util;
}();

exports.default = Util;

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map