const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const { transformFromAst } = require("@babel/core");
module.exports = class Webpack {
    constructor (options) {
        const { entry, output } = options;
        this.entryFile = entry;
        this.output = output;
        //收集模块
        this.modules = {};
    }
    run () {
        this.installModule(this.entryFile)
        this.file(this.modules);
    }
    //递归构建依赖图
    genearteGraphByTraversal (dependencies) {
        if (dependencies) {
            for (let j in dependencies) {
                this.installModule(dependencies[j])
            }
        }
    }
    //注册模块
    installModule (entry) {
        if (this.modules[dependencies[j]]) return;
        const { entryFile, dependencies, code } = this.parse(entry)
        this.modules[entryFile] = {
            dependencies,
            code
        }
        this.genearteGraphByTraversal(dependencies)
    }
    //解析入口文集的内容
    parse (entryFile) {
        //读取文件内容
        const content = fs.readFileSync(entryFile, 'utf-8');
        //! 将内容抽象成ast 进行分析
        const ast = parser.parse(content, {
            sourceType: "module"
        })
        const dependencies = {};
        //对ast进行分析
        traverse(ast, {
            //表示ast.program.body的ImportDeclaration
            ImportDeclaration ({ node }) {
                //在这里对相对路径和绝对路径做一个映射
                const correctPath = path.resolve(path.dirname(entryFile), node.source.value);
                dependencies[node.source.value] = correctPath;
            }
        })
        //!将 ast 生成code
        const { code } = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        })
        return {
            entryFile,
            dependencies,
            code
        }
    }
    //生成bundle.js
    file (code) {
        const filePath = path.join(this.output.path, this.output.filename);
        const newCode = JSON.stringify(code);
        //整合bundle.js
        const bundle = `
        (function(graph){
                function require(module){

                    function localRequire(relativePath){
                        return require(graph[module].dependencies[relativePath])
                    }

                    let exports={};
                    //require是一个方法
                    (function(require,exports,code){
                        eval(code);
                    })(localRequire,exports,graph[module].code)
                    //返回一个对象
                    return exports
                }
                require('${this.entryFile}')
        })(${newCode}) 
        `
        fs.writeFileSync(filePath, bundle, 'utf-8')
    }
}