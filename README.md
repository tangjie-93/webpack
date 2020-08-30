## 1.	为什么使用webpack？

+	模块化开发（支持import（es6），require（commonjs）和AMD）；
+	Loader：预处理工具（能将不同的语言Less,Sass,ES6,TypeScript转化为javascript）；
+	Plugins：扩展性强，插件机制完善；
+	可以实现按需加载；
+	可以实现热更新；
+	主流框架脚手架支持（Vue，React，ANgular）
+	庞大的社区（资源丰富，降低学习成本）

## 2.	概念

webpack是Javascript应用程序的静态模块打包器。在webpack处理应用程序时，它会在内部创建一个依赖图，用于映射到项目需要的各个模块，然后将所有这些依赖生成到一个或多个bundle文件。
模块：在模块化编程中，开发者将程序分解为功能离散的chunk(discrete chunks of functionality)，并称之为模块。精心编写的_模块_提供了可靠的抽象和封装界限，使得应用程序中每个模块，都具备了条理清楚的设计和明确的目的。

## 3.	核心组成部分：

entry（入口），output（输出），loader和plugins（插件）以及model（模式）
entry：指示webpack使用哪些模块作为内部依赖图的开始。在Vue项目中一般是main.js 文件。
output：控制webpack如何向硬盘写入编译文件。Output对象至少包好filename和path，如果有多个入口起点，filename那里应该使用占位符（filename: '[name].js',）来确保每个文件具有唯一的名称。
loader：用于对模块的源代码进行转换。loader 可以将文件从不同的语言如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！
在更高层面，在 webpack 的配置中 loader 有两个属性：

1.	test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。
2.	use 属性，表示进行转换时，应该使用哪个 loader。
   在应用程序中，有三种使用loader的方式：

+	配置（推荐）：在webpack.config.js中使用；、
+	内联：在每个import语句中显示指定loader
+	import Styles from 'style-loader!css-loader?modules!./styles.css';
  使用“!”将资源中的 loader 分开。分开的每个部分都相对于当前目录解析。
+	CLI：在shell命令中指定它们
+	webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
  这会对 .jade 文件使用 jade-loader，对 .css 文件使用 style-loader 和 css-loader。

Plugin（插件）：在于解决loader无法实现的其他事。包括打包优化，资源管理，注入环境变量。

## 4.	插件（plugins）

+ 1.	html-webpack-plugin
     使用html-webpack-plugin插件时，将不用在本地创建index.html文件。使用npm run build命令时会自动在dist文件夹下生成index.html。如下图所示

+ 2.	clean-webpack-plugin
     使用webpack-dev-server时默认不会在本地生成dist文件夹，所有的文件都生成在内存中。使用npm run build时，默认会在本地生成dist文件夹，但是如果在webpack.config.js中引入clean-webpack-plugin并使用它将会在本地生成dist文件夹之前清除已经存在的dist文件夹。

+ 3.	ProvidePlugin
     使用ProvidePlugin可以自动加载模块，而不必到处import或者require。其实就是定义全局变量。
     用法如下：
     new webpack.ProvidePlugin({
     identifier: 'module1',
     _:'lodash'
     // ...
     })
     或者
     new webpack.ProvidePlugin({
     identifier: ['module1', 'property1'],
     join: ['lodash', 'join'],
     // ...	
     })
     module1是模块的名称，而identifier会被这个模块输出的内容赋值。
     而property1表示的是module1中的某个方法或类。identifier: ['module1', 'property1'],表示将module1中的property1赋值给identifier。
+ 4.	CommonsChunkPlugin、ModuleConcatenationPlugin、HashedModulePlugin等高效缓存及性能优化的插件：
     webpack.optimize.CommonsChunkPlugin插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。




**注意：**

+ 1、	npm run build和npm run dev和npm start等命令行都是在package.json中进行配置的。

+ 2、	如果想在webpack打包过程中去除一些没用用到的代码，可以在package.json文件中进行如下设置。

+ 3、	全局变量的使用，当模块运行在 CommonJS 环境下这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。可以使用import-loader来解决。

```
module: {
        rules: [
            {
                test: require.resolve("some-module"),
                use: "imports-loader?this=>window"
            }
        ]
    }
```

+ 4、	全局exports，exports-loader的使用。

```
{
         test: require.resolve('globals.js'),
         use: 'exports-loader?file,parse=helpers.parse'
       }
```

将 file 导出为 file 以及将 helpers.parse 导出为 parse。其实就相当于如下代码：
//  将添加下面的代码:
//  exports["file"] = file;
//  exports["parse"] = helpers.parse;
在其他模块中引用的方式为:
var  { file, parse }=require('./globals.js');

+ 5、	Babel-Polyfill的作用：
  Babel：Babel是一个广泛使用的转码器，可以将ES6代码转为ES5代码，从而可以在现有环境执行。默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
  Polyfill：用于实现浏览器不支持原生功能的代码。举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。
+ 6、	devDependencies和dependencies区别：
  1、	devDependencies是只会在开发环境下依赖的模块，生产环境不会被打入包内；
  2、	dependencies依赖的包不仅开发环境能使用，生产环境也能使用。

注意：避免在生产中(mode为production)使用 inline-source-map 和 eval-source-map，因为它们可以增加 bundle 大小，并降低整体性能。