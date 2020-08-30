const path = require('path');
const { Configuration } = require("webpack")
/**
 * @type {Configuration}
 */
const config = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "bundle.js"
    },
}
module.exports = config;