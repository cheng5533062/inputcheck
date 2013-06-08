(function(window){
var InputCheck=function(target,config){
	if($('#'+target).length==0 || !$('#'+target).is('input'))return;
	this.trigger='blur';
	this.required=true;
	this.blankmsg='不能为空！';
	$.extend(this,config);
	if(null==this.error){
		this.error=target+'-err';
	}
	if(null == this.pass){
		this.pass=target+'-pass';
	}
	if(null ==this.loading){
		this.loading=target+'-loading';
	}
	this.target=$('#'+target);
	this.error=$('#'+this.error);
	this.pass=$('#'+this.pass);
	this.loading=$('#'+this.loading);
	if(null == this.validators){
		this.validators=new Array();
	}
	if(this.required){
		this.validators.splice(0,0,{validator:'blank',msg:this.blankmsg,template:this.defaultTemplate});
	}
	this.bindEvent();
};
InputCheck.prototype={
	bindEvent:function(){
		var self=this;
		this.target.bind(this.trigger,function(e){
			self.check();
		});
	},
	check:function(){
		if(this.target.length==0 || !this.target.is('input'))return true;
		var value=$.trim(this.target.val());
		var re=true;
		var self=this;
		var ajaxValidator=null;
		$.each(this.validators,function(i,v){
			if('ajax'==v.type && null!=v.url){
				ajaxValidator=v;
			}else if(($.isFunction(v.validator) && !v.validator(value,self))||
			($.isFunction(window.$inputcheck.utils._validators[v.validator]) && 
			!window.$inputcheck.utils._validators[v.validator](value))){
				self.showMSG(v.msg,v.template);
				re=false;
				return false;
			}
		});
		if(re && null!=ajaxValidator){
			this.showLoading();
			var parameters={};
				parameters[ajaxValidator.parameterName]=value;
				$.getJson(ajaxValidator.url,parameters,function(data){
					if($.isFunction(ajaxValidator.validator)){
						if(!ajaxValidator.validator(data)){
							self.showMSG(ajaxValidator.msg,ajaxValidator.template);
						}else{
							self.showPass();
						}
					}
				});
		}else if(re){
			this.showPass();
		}
		return re;
	},
	showMSG:function(m, t){
		this.pass.hide();
		this.loading.hide();
		this.error.html(this.message(m,t)).show();
	},
	showPass:function(){
		this.error.hide();
		this.loading.hide();
		this.pass.show();
	},
	showLoading:function(){
		this.error.hide();
		this.pass.hide();
		this.loading.show();
	},
	message:function(m, t){
		if(null == m){
			m='错误信息未定义';
		}
		if(null != t){
			return t.replace('{msg}',m);
		}else if(null != this.defaultTemplate){
			return this.defaultTemplate.replace('{msg}',m);
		}else{
			return m;
		}
	}
};
var utils={
	_validators:{
		blank:function(v){
			return ''!=v;
		},
		email:function(v){
			var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
			return reg.test(v);
		},
		mobile:function(v){
			var reg = /^1[3-8]{1}\d{9}$/g;
			return reg.test(v);
		},
		phone:function(v){
			var reg = /^(\d{3,4}-?)?\d{7,8}([\-转]\d{3,5})?$/g;
			return reg.test(v);
		},
		number:function(v){
			var reg = /^-?(0|[1-9]\d*)$/;
			return reg.test(v);
		},
		url:function(v){
			var strRegex = "^((https|http|ftp|rtsp|mms)?://)" 
				+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
				+ "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
				+ "|" // 允许IP和DOMAIN（域名）
				+ "([0-9a-z_!~*'()-]+.)*" // 域名- www. 
				+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名 
				+ "[a-z]{2,6})" // first level domain- .com or .museum 
				+ "(:[0-9]{1,4})?" // 端口- :80 
				+ "((/?)|" // a slash isn't required if there is no file name 
				+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
			var re=new RegExp(strRegex); 
			return re.test(v);
		},
		ID:function(v){
		}
	}
};
window.$inputcheck={};
window.$inputcheck.utils=utils;
window.InputCheck=InputCheck;
})( window );
$.fn.extend({
	InputCheck:function(config){
		this.each(function(i,e){
			$(e).data('_checker',new InputCheck($(e).attr('id'),config));
		});
	},
	check:function(shortCut){
		var re=true;
		this.each(function(i,e){
			if(!$(e).data('_checker').check()){
				re=false;
				if(shortCut){
					return false;
				}
			}
		});
		return re;
	}
});