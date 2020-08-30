(function (graph) {
    function require (module) {
        function localRequire (relativePath) {

            return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function (require, exports, code) {
            eval(code)
        })(localRequire, exports, graph[module].code)

        return exports;
    }
    require('./src/index.js') //./src/index
})({ "./src/index.js": { "dependencies": { "./b.js": "./src\\b.js" }, "code": "\"use strict\";\n\nrequire(\"./b.js\");\n\nvar test = function test() {\n  console.log(\"test\");\n};\n\nconsole.log(\"webpack\");" }, "./src\\b.js": { "dependencies": { "./a.js": "./src\\a.js" }, "code": "\"use strict\";\n\nvar _a = require(\"./a.js\");\n\nvar a = 3,\n    b = 4;\nvar addRes = (0, _a.add)(a, b);\nvar minusRes = (0, _a.minus)(a, b);\nvar multiRes = (0, _a.mutiply)(a, b);\nvar divideRes = (0, _a.divide)(a, b);\nconsole.log(addRes, minusRes, multiRes, divideRes);" }, "./src\\a.js": { "dependencies": {}, "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.divide = exports.mutiply = exports.minus = exports.add = void 0;\n\nvar add = function add(a, b) {\n  return a + b;\n};\n\nexports.add = add;\n\nvar minus = function minus(a, b) {\n  return a - b;\n};\n\nexports.minus = minus;\n\nvar mutiply = function mutiply(a, b) {\n  return a * b;\n};\n\nexports.mutiply = mutiply;\n\nvar divide = function divide(a, b) {\n  return a / b;\n};\n\nexports.divide = divide;" } })