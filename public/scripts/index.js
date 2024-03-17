/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/program.ts":
/*!******************************!*\
  !*** ./src/utils/program.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createProgram(gl, fragmentShader, vertexShader) {
    var program = gl.createProgram();
    if (program === null || vertexShader === null || fragmentShader === null) {
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        gl.deleteProgram(program);
        throw Error('Failed to link program!');
    }
    return program;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createProgram);


/***/ }),

/***/ "./src/utils/shader.ts":
/*!*****************************!*\
  !*** ./src/utils/shader.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (shader === null) {
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        gl.deleteShader(shader);
        throw Error('Failed to compile shader!');
    }
    return shader;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createShader);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderCanvas: () => (/* binding */ renderCanvas)
/* harmony export */ });
/* harmony import */ var _utils_shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/utils/shader */ "./src/utils/shader.ts");
/* harmony import */ var _utils_program__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/utils/program */ "./src/utils/program.ts");
//! INI MASIH COPAS KINAN, INGATKAN UNTUK DIGANTI KEMUDIAN


/* Create Program */
var canvas = document.getElementById('webgl-canvas');
var gl = canvas.getContext('webgl');
var vertexShaderElement = document.getElementById('vertex-shader');
var fragmentShaderElement = document.getElementById('fragment-shader');
var vertexShaderSource = vertexShaderElement === null || vertexShaderElement === void 0 ? void 0 : vertexShaderElement.textContent;
var fragmentShaderSource = fragmentShaderElement === null || fragmentShaderElement === void 0 ? void 0 : fragmentShaderElement.textContent;
if (gl !== null) {
    var vertexShader = (0,_utils_shader__WEBPACK_IMPORTED_MODULE_0__["default"])(gl, gl === null || gl === void 0 ? void 0 : gl.VERTEX_SHADER, vertexShaderSource !== null && vertexShaderSource !== void 0 ? vertexShaderSource : '');
    var fragmentShader = (0,_utils_shader__WEBPACK_IMPORTED_MODULE_0__["default"])(gl, gl === null || gl === void 0 ? void 0 : gl.FRAGMENT_SHADER, fragmentShaderSource !== null && fragmentShaderSource !== void 0 ? fragmentShaderSource : '');
    var program = (0,_utils_program__WEBPACK_IMPORTED_MODULE_1__["default"])(gl, fragmentShader, vertexShader);
    /* Setup Program */
    gl.useProgram(program);
    /* Setup Viewport */
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    /* Clear Color */
    gl.clear(gl.COLOR_BUFFER_BIT);
}
/* Export Function */
var renderCanvas = function () {
    gl === null || gl === void 0 ? void 0 : gl.clear(gl.COLOR_BUFFER_BIT);
    window.requestAnimationFrame(renderCanvas);
};
/* DOM Listener */
document.addEventListener('DOMContentLoaded', renderCanvas);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YmVzLTEtZ3JhZmtvbS8uL3NyYy91dGlscy9wcm9ncmFtLnRzIiwid2VicGFjazovL3R1YmVzLTEtZ3JhZmtvbS8uL3NyYy91dGlscy9zaGFkZXIudHMiLCJ3ZWJwYWNrOi8vdHViZXMtMS1ncmFma29tL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3R1YmVzLTEtZ3JhZmtvbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdHViZXMtMS1ncmFma29tL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdHViZXMtMS1ncmFma29tL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdHViZXMtMS1ncmFma29tLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZVByb2dyYW0gKFxuICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICBmcmFnbWVudFNoYWRlcjogV2ViR0xTaGFkZXIgfCBudWxsLFxuICB2ZXJ0ZXhTaGFkZXI6IFdlYkdMU2hhZGVyIHwgbnVsbFxuKTogV2ViR0xQcm9ncmFtIHwgbnVsbCB7XG4gIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKClcbiAgaWYgKHByb2dyYW0gPT09IG51bGwgfHwgdmVydGV4U2hhZGVyID09PSBudWxsIHx8IGZyYWdtZW50U2hhZGVyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpXG4gIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmFnbWVudFNoYWRlcilcbiAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSlcblxuICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykgYXMgYm9vbGVhblxuICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pXG5cbiAgICB0aHJvdyBFcnJvcignRmFpbGVkIHRvIGxpbmsgcHJvZ3JhbSEnKVxuICB9XG5cbiAgcmV0dXJuIHByb2dyYW1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUHJvZ3JhbVxuIiwiZnVuY3Rpb24gY3JlYXRlU2hhZGVyIChcbiAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgdHlwZTogbnVtYmVyLFxuICBzb3VyY2U6IHN0cmluZ1xuKTogV2ViR0xTaGFkZXIgfCBudWxsIHtcbiAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpXG4gIGlmIChzaGFkZXIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKVxuICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcilcblxuICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpIGFzIGJvb2xlYW5cbiAgaWYgKCFzdWNjZXNzKSB7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcilcblxuICAgIHRocm93IEVycm9yKCdGYWlsZWQgdG8gY29tcGlsZSBzaGFkZXIhJylcbiAgfVxuXG4gIHJldHVybiBzaGFkZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2hhZGVyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vISBJTkkgTUFTSUggQ09QQVMgS0lOQU4sIElOR0FUS0FOIFVOVFVLIERJR0FOVEkgS0VNVURJQU5cblxuaW1wb3J0IGNyZWF0ZVNoYWRlciBmcm9tICdAL3V0aWxzL3NoYWRlcidcbmltcG9ydCBjcmVhdGVQcm9ncmFtIGZyb20gJ0AvdXRpbHMvcHJvZ3JhbSdcblxuLyogQ3JlYXRlIFByb2dyYW0gKi9cbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWJnbC1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxuY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKVxuXG5jb25zdCB2ZXJ0ZXhTaGFkZXJFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRleC1zaGFkZXInKVxuY29uc3QgZnJhZ21lbnRTaGFkZXJFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZyYWdtZW50LXNoYWRlcicpXG5cbmNvbnN0IHZlcnRleFNoYWRlclNvdXJjZSA9IHZlcnRleFNoYWRlckVsZW1lbnQ/LnRleHRDb250ZW50XG5jb25zdCBmcmFnbWVudFNoYWRlclNvdXJjZSA9IGZyYWdtZW50U2hhZGVyRWxlbWVudD8udGV4dENvbnRlbnRcblxuaWYgKGdsICE9PSBudWxsKSB7XG4gIGNvbnN0IHZlcnRleFNoYWRlciA9IGNyZWF0ZVNoYWRlcihnbCwgZ2w/LlZFUlRFWF9TSEFERVIsIHZlcnRleFNoYWRlclNvdXJjZSA/PyAnJylcbiAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjcmVhdGVTaGFkZXIoXG4gICAgZ2wsXG4gICAgZ2w/LkZSQUdNRU5UX1NIQURFUixcbiAgICBmcmFnbWVudFNoYWRlclNvdXJjZSA/PyAnJ1xuICApXG5cbiAgY29uc3QgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIGZyYWdtZW50U2hhZGVyLCB2ZXJ0ZXhTaGFkZXIpXG5cbiAgLyogU2V0dXAgUHJvZ3JhbSAqL1xuICBnbC51c2VQcm9ncmFtKHByb2dyYW0pXG5cbiAgLyogU2V0dXAgVmlld3BvcnQgKi9cbiAgY29uc3Qgd2lkdGggPSBjYW52YXMuY2xpZW50V2lkdGhcbiAgY29uc3QgaGVpZ2h0ID0gY2FudmFzLmNsaWVudEhlaWdodFxuXG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHRcbiAgZ2wudmlld3BvcnQoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KVxuXG4gIC8qIENsZWFyIENvbG9yICovXG4gIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpXG59XG5cbi8qIEV4cG9ydCBGdW5jdGlvbiAqL1xuZXhwb3J0IGNvbnN0IHJlbmRlckNhbnZhcyA9ICgpOiB2b2lkID0+IHtcbiAgZ2w/LmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJDYW52YXMpXG59XG5cbi8qIERPTSBMaXN0ZW5lciAqL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHJlbmRlckNhbnZhcylcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==