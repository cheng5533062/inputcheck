inputcheck
==========

*common use of the html input validate*


* 自定义输入框检查类
* author:yuan.cheng
* date:2013-6-3

####e.g
	<script language="JavaScript" type="text/javascript">
		$(document).ready(function(e) {
			$(':text').InputCheck({
				defaultTemplate:'<b>{msg}</b>',//错误信息显示模板，{msg}会被替换为错误提示消息
				validators:[{//检查器组，可以定义多个检查器
					validator:function(v,e){//定义检查规则，v为输入框的值,e目录输入框对象，在此可对其进行操作。
						return v>10;//返回结果必需为bool型
					},
					msg:'请输入大于10的数字',//错误提示信息
					template:'<i>{msg}</i>'//也可以为每个检查器定义消息显示样式模板
				},
				{
					validator:'phone',//可以使用内置检查器。其他内置检查器还有email,mobile,url,number等
					msg:'请输入正确电话号码'
				},
				{
					type:'ajax',//支持ajax异步验证
					parameterName:'name',//传入参数名
					url:'http://123.4556.com/checkusername.do',
					validator:function(v){//此时validator函数在ajax返回后调用，v为返回值(json格式)
						return v.result=='true';
					},
					msg:'用户名重复'
				}]
			});
		});
		function check(){
			alert($(':text').check());//也可外部调用
		}
	</script>
	</head>
	
	<body>
		<input id="test" type="text" />
		<input id="test1" type="text" />
		<input id="test2" type="text" /><br />
		<span id="test-err" style="display:none; background-color:#F00"></span><br />
		<span id="test1-err" style="display:none; background-color:#0F0"></span><br />
		<span id="test2-err" style="display:none; background-color:#00F"></span><br />
		<input type="button" value="提交" onclick="check();"/>
	</body>


