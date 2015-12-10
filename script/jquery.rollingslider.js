(function($,window,document,undefined) {
  var argFn = function(ele,obj){
    this.$element = ele,
    this.defaults = {
        showArea:"#JslideWrap",
        prev:"#Jprev",
        next:"#Jnext",
        moveSpeed: 400,
        autoPlay:false,
        stay: 5000
    },
    this.args = $.extend({}, this.defaults, obj);
  };
  $.fn.RollingSlider = function(arg) {
    var _instance = new argFn(this, arg);
    // 参数, 函数声明
    var $showArea = $(_instance.args.showArea),
        $showArea_li = $(_instance.args.showArea+">li"),
        $prev =  $(_instance.args.prev),
        $next =  $(_instance.args.next),
        show_len = $showArea_li.length,
        column = 5,
        direction = "next",
        timer,
        init_arr = [],
        item_arr = [],  // 存起所有的li
        flag = 1;
    // 存储样式和li
    function slider() {
      for (var i = 0; i < show_len; i++) {
        var $cur_li = $showArea_li.eq(i); //当前展示的图片
        if (i < column) { //记录 5 张图片的初始状态信息
          init_arr[i] = {
            left: $cur_li.position().left,
            top: $cur_li.position().top,
            zIndex: $cur_li.css("z-index"),
            width: $cur_li.width(),
            height: $cur_li.height()
          };
          $cur_li.css("left", init_arr[i].left)
        } else {
          $cur_li.css("left", init_arr[column - 1].left)
        }
        item_arr.push($cur_li);
      }
    }
    //模拟点击和设置鼠标离开指定区域而恢复自动轮播
    function simulate() {
      $next.click();
    }
    function autoPlay() {
      timer = setInterval(simulate, _instance.args.stay);
    }
    function clearTimer(ele){
      $(ele).bind("mouseenter",
        function() {
          clearInterval(timer)
        }).bind("mouseleave",
        function() {
          if(_instance.args.autoPlay===true){
            autoPlay();
          }
        });
    }
    // 箭头
    function arrows() {
      clearTimer(_instance.args.showArea);
      clearTimer(_instance.args.prev);
      clearTimer(_instance.args.next);
      $next.bind("click",function() {
        if (flag) {
          direction = "next";
          flag = 0;
          animation();
        }
      });
      $prev.bind("click",function() {
        if (flag) {
          direction = "prev";
          flag = 0;
          animation();
        }
      });
    }
    //动画
    function animation() {
      if (direction == "next") { //点击next
        for (i = 0; i < column; i++) {
          var prevStyleObj = init_arr[i - 1];
          if (i == 0) {
            item_arr[i].fadeOut(_instance.args.moveSpeed)
          } else {
            item_arr[i].css("z-index", prevStyleObj.zIndex).animate({
              left: prevStyleObj.left,
              top: prevStyleObj.top,
              width: prevStyleObj.width,
              height: prevStyleObj.height
            }, _instance.args.moveSpeed)
          }
        }
        var lastStyleObj = init_arr[column - 1]; // 最后一个样式对象
        if (item_arr.length != column) { //只能大于
          item_arr[column].css({
            left: lastStyleObj.left,
            top: lastStyleObj.top,
            width: lastStyleObj.width,
            height:lastStyleObj.height,
            "z-index": lastStyleObj.zIndex
          }).fadeIn(_instance.args.moveSpeed,function() {
            flag = 1;
          })
        } else {  // 或者等于
          item_arr[0].stop().css({
            left: lastStyleObj.left,
            top: lastStyleObj.top,
            width: lastStyleObj.width,
            height:lastStyleObj.height,
            "z-index": lastStyleObj.zIndex
          }).fadeIn(_instance.args.moveSpeed,function() {
            flag = 1;
          })
        }
        item_arr.push(item_arr.shift());
        // 按需加载右边图片
        lazyLoad(4);
      } else {    //点击prev
        for (i = 0; i < column; i++) {
          var nextStyleObj = init_arr[i + 1];
          if (i == column - 1) {
            item_arr[i].css("z-index", 0).fadeOut(_instance.args.moveSpeed)
          } else {
            item_arr[i].css("z-index", nextStyleObj.zIndex).animate({
              left: nextStyleObj.left,
              top: nextStyleObj.top,
              width: nextStyleObj.width,
              height:nextStyleObj.height
            },_instance.args.moveSpeed)
          }
        }
        var firstStyleObj = init_arr[0];
        item_arr[item_arr.length - 1].stop().css({
          left: firstStyleObj.left,
          top: firstStyleObj.top,
          width: firstStyleObj.width,
          height:firstStyleObj.height,
          "z-index": firstStyleObj.zIndex
        }).fadeIn(_instance.args.moveSpeed,function() {
          flag = 1;
        });
        item_arr.unshift(item_arr.pop());
        //按需加载左边图片
        lazyLoad(0);
      }
    }
    // 按需加载
    function lazyLoad(index){
      var $nextOne = item_arr[index].find('img');
      var $realSrc = $nextOne.data('src');
      var hasSrc = item_arr[index].find('img').attr('src');
      if (!hasSrc) {
        $nextOne.attr('src', $realSrc);
      };
    }
    // 初始化
    function init() {
      slider();
      arrows();
      if(_instance.args.autoPlay===true){
        autoPlay();
      }
    }
    init();
  }
})($,window,document);