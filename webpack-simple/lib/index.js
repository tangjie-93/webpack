//! 在这里初始化webpack
const options = require("../webpack.config");
const Webpack = require("./webpack")
new Webpack(options).run();