var mySwiper = new Swiper(".swiper-container-1", {
			loop:true,  //设置循环失败
			slidesPerView: 1.25,//这里数值就可以了
			initialSlide :0,
			centeredSlides: !0,
			watchSlidesProgress: !0,
			pagination: "#pagination",
			paginationClickable: !0,
			prevButton:'#prev',
			nextButton:'#next',
			// 这个方法有两个参数,a,索引, b,swiper-pagination-bullet
			paginationBulletRender: function() {
        return '<span class=' + arguments[1] + '><i></i></span>';
    },
    onProgress: function(a) {
    	// console.log(a);
        var b, c, d;
        for (b = 0; b < a.slides.length; b++){
            c = a.slides[b], d = c.progress, scale = 1 - Math.min(Math.abs(.2 * d), 1), es = c.style, es.opacity = 1 - Math.min(Math.abs(d / 2), 1), es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = "translate3d(0px,0," + -Math.abs(150 * d) + "px)"
            }
    }
    ,
    onSetTransition: function(a, b) {
        for (var c = 0; c < a.slides.length; c++){
            es = a.slides[c].style, es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = b + "ms"
            }
    	}
  	});//传入对象完毕

	//第二个滑动组件
	var mySwiper2 = new Swiper(".swiper-container-2", {
		loop:true,
		prevButton:'#prev2',
		nextButton:'#next2',
	});
	//第三个滑动组件
	var mySwiper3 = new Swiper(".swiper-container-3", {
		loop:true,
		prevButton:'#prev3',
		nextButton:'#next3',
		pagination:'#pagination3'
	});
	//导航
	var navs = document.querySelectorAll(".nav a")
    function navon(id){
        for(var p=0,len=navs.length;p<len;p++){
            navs[p].className = ""
        }
        navs[id].className = "current"
    }
    function getId(id){
		return typeof id==='string'? document.getElementById(id) : id ;
	}


	function addClass(dom,cls){
		if(!dom.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'))){
				dom.className+=' '+cls;
			}
	}
	function removeClass(dom,cls){
		if(dom.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'))){
				dom.className=dom.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),'');
			}
	}

    window.onscroll=function(){
		var st = document.body.scrollTop ||document.documentElement.scrollTop;
		// console.log(st);
		if(st>=0&&st<450){
			addClass(getId('nav-btn-1'),'current');
		}else{
			removeClass(getId('nav-btn-1'),'current');
		}
		if(st>450&&st<800){
			addClass(getId('nav-btn-2'),'current');
		}else{
			removeClass(getId('nav-btn-2'),'current');
		}
		if(st>800&&st<1260){
			addClass(getId('nav-btn-3'),'current');
		}else{
			removeClass(getId('nav-btn-3'),'current');
		}
		if(st>1260){
			addClass(getId('nav-btn-4'),'current');
		}else{
			removeClass(getId('nav-btn-4'),'current');
		}
	}