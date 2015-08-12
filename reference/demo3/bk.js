(function($,window,document,undefined) {
  // 这个构造函数用于存放数据
  var Rolling = function(ele,obj){
    this.$element = ele,  //接受JQ元素,作为一个属性存起来.
    this.defaults = {
        showArea:"#JslideWrap",
        ctrlDot:"#JctrlDot",
        prev:"#prev",
        next:"#next",
        moveSpeed: 400,
        autoPlay:true,
        autoRollingTime: 5000
    },
    //这里的args是用来存放最终的参数
    this.args = $.extend({}, this.defaults, obj);
    // console.log(this.args);
  };
  Rolling.prototype = {
  };
  $.fn.RollingSlider = function(arg) {
    //改写后的构造函数
    var rolling = new Rolling(this, arg); //接收用户传入的参数
    return this.each(function() {
      var _this = $(this);  //保存$(this)
      // var l = _this.find(".slide-wrap");  //此处k.find可以替换成$
      var $showArea = $(rolling.args.showArea);
      // var h = l.find(">li");
      var $showArea_li = $(rolling.args.showArea+">li");
      // var j = _this.find(".ctrl-Dot"); //此处k.find可以替换成$
      var $ctrlDot =  $(rolling.args.ctrlDot);
      // var r = j.find(">li");
      var $ctrlDot_li =  $(rolling.args.ctrlDot+">li");
      // var z = _this.find(".d_prev");  //此处k.find可以替换成$
      var $prev =  $(rolling.args.prev);
      // var B = _this.find(".d_next");  //此处k.find可以替换成$
      var $next =  $(rolling.args.next);
      // var p = $showArea_li.length;
      var show_len = $showArea_li.length;  //图片个数
      // var y = 5;
      var column = 5; //默认列数
      var direction = "next";  //初始方向
      var timer;  //定时器
      

      var C;  //大写C  timer 计时器
      
      // var u = [];
      var init_arr = []; //存储五个初始化的li状态
      // var x = [];
      var item_arr = [];   //存储五个 $cur_li
     

      var flag = 1;  //标记
      

      var dot_target = 0;
      var dot_curIndex = 0;
      var move_count = 0;  //偏移个数
      
      var e = 0;
      
      function init() {
        slider();
        g();
        autoPlay()
      }
      //实例初始化
      init();
      // 控制点相关函数
      function slider() {
        $ctrlDot.html("");
        for (var i = 0; i < show_len; i++) {
          // var D = $showArea_li.eq(i);
          var $cur_li = $showArea_li.eq(i); //当前展示的图片
          if (i < column) { //记录5张图片的初始状态信息
            init_arr[i] = {
              left: $cur_li.position().left,
              top: $cur_li.position().top,
              zIndex: $cur_li.css("z-index"),
              width: $cur_li.width()
            };
            $cur_li.css("left", init_arr[i].left)
          } else {
            $cur_li.css("left", init_arr[column - 1].left)
          }
          item_arr.push($cur_li);
          $ctrlDot.append("<li></li>")
        }
        $ctrlDot_li = $ctrlDot.find(">li");
        $ctrlDot_li.eq(0).addClass("current")
      }
      // 清除和恢复定时器
      function clearTimer($obj){
        $($obj).bind("mouseenter",
          function() {
            // console.log("进入");
            clearInterval(timer)
          }).bind("mouseleave",
          function() {
            // console.log("出来");
            autoPlay()
          });
      }
      function g() {
        //进去区域清除定时器
        clearTimer(rolling.args.showArea);
        //进入控制点
        clearTimer(rolling.args.ctrlDot);
        //进入箭头
        clearTimer(rolling.args.prev);
        clearTimer(rolling.args.next);
        // 底部点点击事件
        $ctrlDot_li.bind("click",
          function() {
            if (flag && dot_curIndex != $(this).index()) {  //判断目标按钮不是当前按钮
              dot_target = $(this).index();  //目标索引
              flag = 0;
              move_count = Math.abs(dot_target - dot_curIndex);
              console.log('dot_curIndex:'+dot_curIndex);
              console.log('dot_target:'+dot_target);
              console.log('move_count:'+move_count);
              // console.log('flag:'+flag);
              if (dot_target > dot_curIndex) {  //判断需要从哪边模拟单击
                direction = "next"
              } else {
                direction = "prev"
              }

              // 反向模拟单击,避免因为move_count比较大导致从头到尾偏移
              if (move_count > Math.ceil(show_len / 2)) {
                move_count = show_len - move_count; //关键之处
                if (direction == "next") {
                  direction = "prev"
                } else {
                  direction = "next"
                }
              }

              e = 0;
              animation();    //animation运行之后 flag === 1

              //跳跃偏移
              if (move_count > 1) { //
                C = setInterval(function() {
                  if (flag) {
                    console.log('flag:'+flag);
                    animation();
                    flag = 0;
                    if (e >= move_count) {
                      clearInterval(C)
                    }
                  }
                },
                4000)
              }else{
                console.log('move_count等于1');
              }

            }else{  // main cycle else
              console.log("再点击这个按钮就不会跳转啦");
            }
          });
          // 右箭头点击事件
          $next.bind("click",
            function() {
              if (flag) {
                direction = "next";
                flag = 0;
                if (dot_target == show_len - 1) {
                  dot_target = 0
                } else {
                  dot_target++
                }
                animation();
              }
            });
          //左箭头点击事件
          $prev.bind("click",
            function() {
              if (flag) {
                direction = "prev";
                flag = 0;
                if (dot_target == 0) {
                  dot_target = show_len - 1
                } else {
                  dot_target--
                }
                animation();
              }
            })
        }
        //
        function animation() {
          if (direction == "next") {
            for (i = 0; i < column; i++) {
              var temp_arr = init_arr[i - 1]; //这个数组用来存储上一个样式信息
              if (i == 0) {
                item_arr[i].fadeOut(rolling.args.moveSpeed)
              } else {
                item_arr[i].css("z-index", temp_arr.zIndex).animate({
                  left: temp_arr.left,
                  top: temp_arr.top,
                  width: temp_arr.width
                },
                rolling.args.moveSpeed)
              }
            }
            var temp_arr = init_arr[column - 1];
            if (item_arr.length != column) {
              item_arr[column].css({
                left: temp_arr.left,
                top: temp_arr.top,
                width: temp_arr.width,
                "z-index": temp_arr.zIndex
              }).fadeIn(rolling.args.moveSpeed,
              function() {  //回调函数
                flag = 1
              })
            } else {
              item_arr[0].stop().css({
                left: temp_arr.left,
                top: temp_arr.top,
                width: temp_arr.width,
                "z-index": temp_arr.zIndex
              }).fadeIn(rolling.args.moveSpeed,
              function() {
                flag = 1
              })
            }
            item_arr.push(item_arr.shift())
          } else {    // main cycle else
            for (i = 0; i < column; i++) {
              var temp_arr = init_arr[i + 1];
              if (i == column - 1) {
                item_arr[i].css("z-index", 0).fadeOut(rolling.args.moveSpeed)
              } else {
                item_arr[i].css("z-index", temp_arr.zIndex).animate({
                  left: temp_arr.left,
                  top: temp_arr.top,
                  width: temp_arr.width
                },
                rolling.args.moveSpeed)
              }
            }
            var temp_arr = init_arr[0];
            item_arr[item_arr.length - 1].stop().css({
              left: temp_arr.left,
              top: temp_arr.top,
              width: temp_arr.width,
              "z-index": temp_arr.zIndex
            }).fadeIn(rolling.args.moveSpeed,
            function() {
              flag = 1;
            });
            item_arr.unshift(item_arr.pop())
          }
          $ctrlDot_li.eq(dot_target).addClass("current").siblings().removeClass("current");
          dot_curIndex = dot_target;
          e++
        }// animation end

        //定时器函数
        function autoPlay() {
          timer = setInterval(A, rolling.args.autoRollingTime)
        }
        // 模拟单击
        function A() {
          $next.click()
        }
      })
}
})($,window,document);