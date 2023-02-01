# jquery.rollingslider.js

## 仿3D图片轮播
### HTML结构
	<div class="demo">
  		<ul class="slide-wrap" id="JslideWrap">
    		<li class="pos1"></li>
		    <li class="pos2"></li>
		    <li class="pos3"></li>
		    <li class="pos4"></li>
		    <li class="pos5"></li>
		</ul>
  		<i class="arrow prev" id="Jprev"></i>
		<i class="arrow next" id="Jnext"></i>
	</div>
### JS用法
	var demo = new PicRoller({
				showArea:"#JslideWrap",	//必须参数
				prev:"#Jprev",	//必须参数
				next:"#Jnext",	//必须参数
				column:5,	//展示列数
				midClass:"active",	//中间li的样式名
				moveSpeed:300,	//动画时间
				autoPlay:false,	//自动播放
				stay:3000,	//autoPlay为true时使用才有效果
				dots:true,
				dotsClick:true,
				callBack:(index)=>{
					console.log(index);
				}
			});
