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
    console.log(this.args);
  };
  Rolling.prototype = {

  };

  $.fn.RollingSlider = function(arg) {
    // 默认参数
    // var _default = {
    //   showArea:"#JslideWrap",
    //   ctrlArea:"#JctrlWrap",
    //   moveSpeed: 200,
    //   autoRollingTime: 5000
    // };
    // var args = $.extend({},_default, arg);

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
      var len = $showArea_li.length;

      // var y = 5;
      var column = 5; //默认列数

      var s = "next";
      var f;
      var C;  //大写C  timer 计时器

      // var u = [];
      var init_arr = []; //存储五个初始化的li状态

      // var x = [];
      var item_arr = [];   //存储五个 $cur_li

      var m = 1;
      var t = 0;
      var o = 0;
      var v = 0;
      var e = 0;

      init();
      function init() {
        controller();
        g();
        n()
      }

      // 控制点相关函数
      function controller() {
        $ctrlDot.html("");
        for (var i = 0; i < len; i++) {
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
          // console.log(x);
        $ctrlDot_li = $ctrlDot.find(">li");
        $ctrlDot_li.eq(0).addClass("current")
        // console.log(u);
      }


      // 控制点相关函数
      function g() {
        $(this).bind("mouseenter",
          function() {
            clearInterval(f)
          }).bind("mouseleave",
          function() {
            n()
          });
          $ctrlDot_li.bind("click",
            function() {
              if (m && o != $(this).index()) {
                t = $(this).index();
                m = 0;
                v = Math.abs(t - o);
                if (t > o) {
                  s = "next"
                } else {
                  s = "prev"
                }
                if (v > Math.ceil(len / 2)) {
                  v = len - v;
                  if (s == "next") {
                    s = "prev"
                  } else {
                    s = "next"
                  }
                }
                e = 0;
                q();
                if (v > 1) {
                  C = setInterval(function() {
                    if (m) {
                      q();
                      m = 0;
                      if (e >= v) {
                        clearInterval(C)
                      }
                    }
                  },
                  50)
                }
              }
            });
          $next.bind("click",
            function() {
              if (m) {
                s = "next";
                m = 0;
                if (t == len - 1) {
                  t = 0
                } else {
                  t++
                }
                q()
              }
            });
          $prev.bind("click",
            function() {
              if (m) {
                s = "prev";
                m = 0;
                if (t == 0) {
                  t = len - 1
                } else {
                  t--
                }
                q()
              }
            })
        }
        //
        function q() {
          if (s == "next") {
            for (i = 0; i < column; i++) {
              var D = init_arr[i - 1];
              if (i == 0) {
                item_arr[i].fadeOut(rolling.args.moveSpeed)
              } else {
                item_arr[i].css("z-index", D.zIndex).animate({
                  left: D.left,
                  top: D.top,
                  width: D.width
                },
                rolling.args.moveSpeed)
              }
            }
            var D = init_arr[column - 1];
            if (item_arr.length != column) {
              item_arr[column].css({
                left: D.left,
                top: D.top,
                width: D.width,
                "z-index": D.zIndex
              }).fadeIn(rolling.args.moveSpeed,
              function() {
                m = 1
              })
            } else {
              item_arr[0].stop().css({
                left: D.left,
                top: D.top,
                width: D.width,
                "z-index": D.zIndex
              }).fadeIn(rolling.args.moveSpeed,
              function() {
                m = 1
              })
            }
            item_arr.push(item_arr.shift())
          } else {
            for (i = 0; i < column; i++) {
              var D = init_arr[i + 1];
              if (i == column - 1) {
                item_arr[i].css("z-index", 0).fadeOut(rolling.args.moveSpeed)
              } else {
                item_arr[i].css("z-index", D.zIndex).animate({
                  left: D.left,
                  top: D.top,
                  width: D.width
                },
                rolling.args.moveSpeed)
              }
            }
            var D = init_arr[0];
            item_arr[item_arr.length - 1].stop().css({
              left: D.left,
              top: D.top,
              width: D.width,
              "z-index": D.zIndex
            }).fadeIn(rolling.args.moveSpeed,
            function() {
              m = 1
            });
            item_arr.unshift(item_arr.pop())
          }
          $ctrlDot_li.removeClass("current");
          $ctrlDot_li.eq(t).addClass("current");
          o = t;
          e++
        }
        //定时器函数
        function n() {
          f = setInterval(A, rolling.args.autoRollingTime)
        }
        // 模拟单击
        function A() {
          $next.click()
        }
      })
}
})($,window,document);