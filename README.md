inputcheck
==========

*common use of the html input validate*


* 自定义输入框检查类
* author:yuan.cheng
* date:2013-6-3

####e.g
	<script language="javasctipt" type="text/javascript">
		$(document).ready(function(e) {
		    input=new XJB.InputCheck('test',{
				error:'test-err',//显示错误信息的容器id，默认为target+'-err',此处可不设置
				trigger:'blur',//触发事件（默认）
				required:true,//是否必填（默认）
				blankmsg:'不能为空！',//为空时的提示信息（默认）
				defaultTemplate:'<b>{msg}</b>',//错误信息显示模板，{msg}会被替换为错误提示消息
				validators:[{//检查器组，可以定义多个检查器
					validator:function(v){//定义检查规则，参数为输入框的值
						return v>10;
					},
					msg:'请输入大于10的数字'//错误提示信息
				}]
			});
		});
		function check(){
			alert(input.check());//也可外部调用
		}
	</script>
		</head>
	
	<body>
		<input id="test" type="text" />
		<span id="test-err" style="display:none;"></span>
		<input type="button" value="提交" onclick="check();"/>
	</body>


