#nodejs Web 服务运行流程图
![nodejs Web 服务运行流程图](http://7xsfn1.com1.z0.glb.clouddn.com/Nodejs%E6%9E%84%E5%BB%BAweb%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%9A%84%E6%B5%81%E7%A8%8B%E5%9B%BE.svg)
##Node.js的应用场景
####1) 适合

&#160; &#160; &#160; &#160;JSON APIs——构建一个Rest/JSON API服务，Node.js可以充分发挥其非阻塞IO模型以及JavaScript对JSON的功能支持(如JSON.stringfy函数)
单页面、多Ajax请求应用——如Gmail，前端有大量的异步请求，需要服务后端有极高的响应速度。<br>
&#160; &#160; &#160; &#160;基于Node.js开发Unix命令行工具——Node.js可以大量生产子进程，并以流的方式输出，这使得它非常适合做Unix命令行工具
流式数据——传统的Web应用，通常会将HTTP请求和响应看成是原子事件。而Node.js会充分利用流式数据这个特点，构建非常酷的应用。如实时文件上传系统transloadit
准实时应用系统——如聊天系统、微博系统，但Javascript是有垃圾回收机制的，这就意味着，系统的响应时间是不平滑的(GC垃圾回收会导致系统这一时刻停止工作)。例如worktile就是基于nodejs开发的。
#####2) 不适合

&#160; &#160; &#160; &#160;nodejs是单线程的，不适合做复杂计算，适合用来做 IO 调度（高并发）。
####3) 列举几个国内成功应用的项目

1. [雪球](http://xueqiu.com/)

2. [花瓣](http://huaban.com/ "title  花瓣网_发现、采集你喜欢的一切（家居，美食，时尚，穿搭，设计，商品，美图等）")

3. [Worktile ](https://worktile.com/)


##Node.js的优势和劣势

####优点：
1. 异步事件驱动，单进程线程，占用服务器资源少，高并发支持好，虽然单进程，但可以通过官方的 cluster 模块开启多个实例充分利用多核CPU的优势. 节约了服务器的资源，同时又能达到理想的状态。
2. 入门简单，非常适合做 单页程序 + RESTfull API，Worktile就是采用Angular JS + Node.js实现的SPA，基本上完美配合。
3. Node.js也非常适合动态网页web开发，虽然官方没有提供像Apache 和 Tomcat 这样的网页服务器和JSP这样的动态创建网页的技术，但是有很多优秀的第三方模块可以使用， 用 express mvc框架 加上你喜欢的模板引擎（ejs，jade，dot ），感觉还是很棒的。

####缺点：
1. 异步编程的缺点往往就是到处callback，代码不优雅，但是可以通过一些第三方的同步模式的模块进行弥补。
2. 目前不适合做企业级应用开发，特别是复杂业务逻辑的，代码不好维护，事务支持不是很好，不过其生态圈更新速度很快，过不了多久会有大量企业使用。

##基于express框架的web后台管理系统
###一 、代码目录结构

 ----model: 实体

 ----helper：辅助工具
 
 ----routes：路由
 
 ----static：静态文件（imag、js、css等） 

 ----views：视图模板

 ----node_modules：依赖模块库
 
 ----app.js：程序入口
 
 ----package.json：程序版本信息以及依赖模块等配置文件
 
 ----README.md：框架说明文档
###二 、客户端js模块化管理requireJs
 1、	配置require.config：

	require.config({  
    baseUrl: "/",  
    paths: {  
        "jquery": "assets/libs/jquery/jquery.min",  
        "jquery-ui": "assets/libs/jquery-plugins/jquery-ui/jquery-ui",  
        "semantic": "assets/libs/semantic/semantic.min",  
        "modal": "assets/css/components/modal.min",  
        "ui-events": "app/public/ui-events",  
        "base": "config/base",  
        "crypto": "assets/libs/crypto/crypto-js",  
        "md5": "assets/libs/crypto/md5",  
        "core": "assets/libs/crypto/core"  
    },  
    shim: {  
        "jquery-ui": ["jquery"],  
        "modal": ["jquery"]  
    } });

 2、	页面引入需要的js模块：
	
	<script src="/assets/libs/requirejs/require.js"></script>
	<script>
        require(["/app/config.js"], function () {
            require(["/app/user/userList.js"]);
        });
    </script>
 3、	模块定义：

	define(["jquery"], function($) {
    var config = {
        host: "http://" + window.location.host,
        address: {
            userList: "/user/list",
            addUser: "/user/add"
        }
    }
    var common = {
        getData: function(api, params, async, successCallback, errorCallback) {
            try{
                var strTemp = "";
                var arrTemp = [];

                if(params) {
                    for(var i in params) {
                        if(params[i] === "")
                            continue;
                        else {
                            arrTemp.push(i + "=" + params[i])
                        }
                    }

                    strTemp = arrTemp.join("&");
                }

                if(api.indexOf("?") > -1) {
                    strTemp = "&async=true&" + strTemp;
                }else {
                    strTemp = "?async=true&" + strTemp;
                }

                $.ajax({
                    cache: false,
                    type: "GET",
                    async: async,
                    url: config.host + api + strTemp,
                    dataType: "json",
                    success: function(returnData) {
                        successCallback(returnData);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        errorCallback(errorThrown);
                    }
                })
            }catch(err) {
                throw Error("get方式调用接口时出现未知错误");
            }
        },
        postData: function(api, params, async, successCallback, errorCallback) {
            try{
                var __url = config.host + api;

                params.async = true;
                $.ajax({
                    cache: false,
                    type: "POST",
                    async: async,
                    url: __url,
                    dataType: "json",
                    data: params,
                    success: function(returnData) {
                        successCallback(returnData);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        errorCallback(errorThrown);
                    }
                });
            }catch(err) {
                throw Error("post方式调用接口时出现未知错误");
            }
        }
    }

    return {
        api : config.address,
        common: common
    };
	});

###三 、异常处理
 nodejs最主要的优势在于其非阻塞的IO机制，意味着其内有大量的异步回调，这里的错误是难以捕捉和处理的，也是try..catch所无法达到的，nodejs提供了domain方法，同样在 app.use里做处理，代码如下：

	var domain     = require( 'domain' );    //引入domain
	var Domain = domain.create();
	Domain.on( 'error', function( e ){    //监听异步错误
    console.log( 'error ' + e) 
	});
	…
	app.use( function( req, res, next){    
        try{
            if( privilege[ req.path ] && req.path != '/login' && !req.session.status ){
                if( req.method == 'GET' ){
                    res.redirect('/login');
                    } else {
                        res.send( { code: 1001, msg: 'need you to log in'})    
                    }           
            } else {
            	Domain.run( function(){
                	next();   
					//包装异步处理，这样回调出错，也不会造成项目崩溃
            	});
            }
        } catch( e ){
            res.redirect( '/' );
        }    

    });
###四 、 进程守护模块 pm2
 pm2及forever模块是目前较常用的nodejs进程守护模块，前者更常用些、功能也更强大（提供负载）。其原理主要是pm2开启一个主进程，另行再开子进程运行nodejs项目，主进程监听子进程，若子进程崩溃，pm2会自行将其启动，并且也可以对一个项目启动多个子进程，pm2主进程做随机转发请求。

1、安装 	 

	npm install pm2 -g 

2、常用命令
	  
	pm2 start app.js    //启动
    pm2 ls            //显示已启动的项目进程，会显示项目id / name 负载等信息
    pm2 start app.js -i max //自动依赖电脑内核数，尽量启动多的进程
    pm2 reload all    //重新加载
    pm2 restart [ app_name | id | all ]    //重启项目，用于改了nodejs代码时，其不具备node-dev功能
    pm2 stop  [ app_name | id | all ]    //停止某进程
    pm2 logs
###五 、 日志记录 log4js
后台项目日志是极其重要的，后端不是客户端 js那么明晰，错误可以随时debug，日志是很好的记录，其对所有数据的请求进行记录，也记录了出现危害项目的行为，如修改、删除数据操作。

1 、安装
	npm install log4js

2 、配置文件log4js.son

	{
  		"customBaseDir" :"D:/GitHub/weblogs/logs/",
  		"customDefaultAtt" :{
    		"type": "dateFile",
    		"absolute": true,
    		"alwaysIncludePattern": true
  		},
  		"appenders": [
    		{"type": "console", "category": "console"},
    		{"pattern": "debug/yyyyMMddhh.txt", "category": "logDebug"},
    		{"pattern": "info/yyyyMMddhh.txt", "category": "logInfo"},
    		{"pattern": "warn/yyyyMMddhh.txt", "category": "logWarn"},
    		{"pattern": "err/yyyyMMddhh.txt", "category": "logErr"}
  		],
  		"replaceConsole": true,
  		"levels":{ "logDebug": "DEBUG", "logInfo": "DEBUG", "logWarn": "DEBUG", "logErr": "DEBUG"}
	}

**pattern可以使用的占位符说明，不属于下列占位符格式，均会原样输出为文件名（注：不支持单个M、d、h、m）：
yy 两位年份
yyyy 四位年份
MM 两位月份
dd  两位日期
hh  两位的小时数，按24小时制
mm 两位的分数数
ss  两位的秒数
SSS 三位的毫秒数
O    时区，大写字母O，占位符输出结果为+0800**

3、log4js辅助类logHelper.js

		var helper = {};
		exports.helper = helper;
		var log4js = require('log4js');
		var fs = require("fs");
		var path = require("path");
		// 加载配置文件
		var objConfig = JSON.parse(fs.readFileSync("log4js.json", "utf8"));
		// 检查配置文件所需的目录是否存在，不存在时创建
		if(objConfig.appenders){
		    var baseDir = objConfig["customBaseDir"];
		    var defaultAtt = objConfig["customDefaultAtt"];
		    for(var i= 0, j=objConfig.appenders.length; i<j; i++){
		        var item = objConfig.appenders[i];
		        if(item["type"] == "console")
		            continue;
		        if(defaultAtt != null){
		            for(var att in defaultAtt){
		                if(item[att] == null)
		                    item[att] = defaultAtt[att];
		            }
		        }
		        if(baseDir != null){
		            if(item["filename"] == null)
		                item["filename"] = baseDir;
		            else
		                item["filename"] = baseDir + item["filename"];
		        }
		        var fileName = item["filename"];
		        if(fileName == null)
		            continue;
		        var pattern = item["pattern"];
		        if(pattern != null){
		            fileName += pattern;
		        }
		        var category = item["category"];
		        if(!isAbsoluteDir(fileName))//path.isAbsolute(fileName))
		            throw new Error("配置节" + category + "的路径不是绝对路径:" + fileName);
		        var dir = path.dirname(fileName);
		        checkAndCreateDir(dir);
		    }
		}
		// 目录创建完毕，才加载配置，不然会出异常
		log4js.configure(objConfig);
		var logDebug = log4js.getLogger('logDebug');
		var logInfo = log4js.getLogger('logInfo');
		var logWarn = log4js.getLogger('logWarn');
		var logErr = log4js.getLogger('logErr');
		helper.writeDebug = function(msg){
		    if(msg == null)
		        msg = "";
		    logDebug.debug(msg);
		};
		helper.writeInfo = function(msg){
		    if(msg == null)
		        msg = "";
		    logInfo.info(msg);
		};
		helper.writeWarn = function(msg){
		    if(msg == null)
		        msg = "";
		    logWarn.warn(msg);
		};
		helper.writeErr = function(msg, exp){
		    if(msg == null)
		        msg = "";
		    if(exp != null)
		        msg += "\r\n" + exp;
		    logErr.error(msg);
		};
		// 配合express用的方法
		exports.use = function(app) {
		    //页面请求日志, level用auto时,默认级别是WARN
		    app.use(log4js.connectLogger(logInfo, {level:'debug', format:':method :url'}));
		}
		// 判断日志目录是否存在，不存在时创建日志目录
		function checkAndCreateDir(dir){
		    if(!fs.existsSync(dir)){
		        fs.mkdirSync(dir);
		    }
		}
		// 指定的字符串是否绝对路径
		function isAbsoluteDir(path){
		    if(path == null)
		        return false;
		    var len = path.length;
		    var isWindows = process.platform === 'win32';
		    if(isWindows){
		        if(len <= 1)
		            return false;
		        return path[1] == ":";
		    }else{
		        if(len <= 0)
		            return false;
		        return path[0] == "/";
		    }
		}
###六 、Node.js ORM框架（Object Relational Mapping）
	
-	[node-orm2](https://github.com/dresende/node-orm2 "node-orm2")
	
-	[sequelize](https://github.com/sequelize/sequelize "sequelize")

-	[waterline](https://github.com/balderdashy/waterline "waterline")
###七 、promise
promise是一个异步编程的抽象，它是一个返回值或抛出exception的代理对象，一般promise对象都有一个then方法，这个then方法是我们如何获得返回值(成功实现承诺的结果值，称为fulfillment)或抛出exception(拒绝承诺的理由，称为rejection)，then是用两个可选的回调作为参数，我们可以称为onFulfilled和OnRejected：

var promise = doSomethingAync()
promise.then(onFulfilled, onRejected)

　当这个promise被解决了，也就是异步过程完成后，onFulfilled和OnRejected中任何一个将被调用，

　因此，一个promise有下面三个不同状态：

  -	pending待承诺 - promise初始状态

  -	fulfilled实现承诺 - 一个承诺成功实现状态

  -	rejected拒绝承诺 - 一个承诺失败的状态
  
****
[nodejs异步控制「co、async、Q 、『es6原生promise』、then.js、bluebird」](https://www.zhihu.com/question/25413141 "「co、async、Q 、『es6原生promise』、then.js、bluebird」")

###八 、自我总结
1、	基于成熟的nodejs生态圈构建应用高效率、前后端统一使用JavaScript语言使得语言成本较低，如果web应用框架搭建成熟的话，其新人加入项目的门槛很低，JavaScript入门门槛很低。

2、 nodejs目前没有java、.Net的成熟框架和开发规范，其web框架express、koa也处于快速成长期，公司开发规范目前都是基于java、.Net的，其大部分并不适用于JavaScript，大部分开发人员对JavaScript的认知只是处于jQuery的阶段，
因此需要现在做一些基于nodejs的web学习，学习过程中可以提高对JavaScript、html等知识掌握和积累，以后java慢慢会变成业务中间件/接口服务，基于nodejs的前端会大力发展，尽早做其知识储备和能力提升。

3、[入门教程--小白用户](http://course.tianmaying.com/node)  


 ![nodejs应用图一](http://7xsfn1.com1.z0.glb.clouddn.com/nodejs%E5%BA%94%E7%94%A8.png)

 ![nodejs应用图二](http://7xsfn1.com1.z0.glb.clouddn.com/JUP%20X.png)
