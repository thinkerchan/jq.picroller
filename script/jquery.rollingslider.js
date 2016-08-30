/**
 * @thinkerchan 291810213@qq.com
 */
;(function($, window, undefined) {
  var defaults = {
    showArea:"#JslideWrap",
    prev:"#Jprev",
    next:"#Jnext",
    midClass:"active",
    moveSpeed:400,
    autoPlay:false,
    stay:5e3,
    column:5
  };
  // 区域全局变量
  var $showArea, $showArea_li, $prev, $next, _this, show_len, column, flag, midClass, moveSpeed, timer, styleArr = [], itemArr = [];
  // 构造函数
  function PicRoller(options) {
    $.extend(this, defaults, options);
    _this = this;
    this.init();
  }
  PicRoller.prototype = {
    init:function() {
      $showArea = $(this.showArea);
      $showArea_li = $(this.showArea + ">li");
      $prev = $(this.prev);
      $next = $(this.next);
      show_len = $showArea_li.length;
      column = this.column;
      midClass = this.midClass;
      flag = 1;
      moveSpeed = this.moveSpeed;
      if (show_len < column) {
        alert("数量设置错误!");
        return false;
      }
      this.saveStyle();
      this.arrows();
      this.autoPlay && this._autoPlay();
    },
    // 存储所有的show-item 但只存储 column个 样式
    saveStyle:function() {
      for (var i = 0; i < show_len; i++) {
        var $cur_li = $showArea_li.eq(i);
        if (i < column) {
          // 存储用户设置的样式
          styleArr[i] = {
            left:$cur_li.position().left,   // offset vs position
            top:$cur_li.position().top,
            zIndex:$cur_li.css("z-index"),
            width:$cur_li.width(),
            height:$cur_li.height()
          };
          $cur_li.css("left", styleArr[i].left);
        } else {
          // 超出部分取最后一个样式
          $cur_li.css("left", styleArr[column - 1].left);
        }
        // 存储所有的show-item;
        itemArr.push($cur_li);
      }
    },
    arrows:function() {
      this._prev();
      this._next();
    },
    _prev:function() {
      this.bindClick($prev, "prev");
    },
    _next:function() {
      this.bindClick($next, "next");
    },
    bindClick:function(prevOrNext, direction) {
      prevOrNext.bind("click", function() {
        if (flag) {
          flag = 0;
          _this.animation(direction);
        }
      });
    },
    animation:function(direction) {
      var updateFlag = function(){
        flag = 1;
      };
      if (direction == "next") {
        for (i = 0; i < column; i++) {
          var prevStyleObj = styleArr[i - 1]; // 获取前一个li的样式
          if (i == 0) {
            // 处理最左边
            itemArr[i].fadeOut(moveSpeed);
          } else {
            itemArr[i].css({"z-index": prevStyleObj.zIndex}).animate(prevStyleObj, moveSpeed);
          }
        }
        var lastStyleObj = styleArr[column - 1]; // 最右边的li样式
        if (itemArr.length != column) {
          itemArr[column].css(lastStyleObj).fadeIn(moveSpeed,updateFlag);
        } else {
          itemArr[0].stop().css(lastStyleObj).fadeIn(moveSpeed,updateFlag);
        }
        itemArr.push(itemArr.shift());
        this.lazyLoad(column - 1);
      } else {
        for (i = 0; i < column; i++) {
          var nextStyleObj = styleArr[i + 1]; //获取后一个li的样式
          if (i == column - 1) {
            // 处理最右边
            itemArr[i].css("z-index", 0).fadeOut(moveSpeed);
          } else {
            itemArr[i].css("z-index", nextStyleObj.zIndex).animate(nextStyleObj, moveSpeed);
          }
        }
        var firstStyleObj = styleArr[0];
        itemArr[itemArr.length - 1].stop().css(firstStyleObj).fadeIn(moveSpeed,updateFlag);
        itemArr.unshift(itemArr.pop());
        this.lazyLoad(0);
      }
      var center  =  parseInt((column-1)/2);
      itemArr[center].addClass(midClass).siblings().removeClass(midClass);
    },
    lazyLoad:function(index) {
      var $nextOne = itemArr[index].find("img"),
          $realSrc = $nextOne.data("src"),
          hasSrc = itemArr[index].find("img").attr("src");
      !hasSrc && $nextOne.attr("src", $realSrc);
    },
    simulate:function() {
      $next.click();
    },
    _autoPlay:function(){
      timer = setInterval(_this.simulate, _this.stay);
      this.clearTimer();
    },
    clearTimer:function() {
      $showArea.one("mouseenter", function() {
        clearInterval(timer);
        timer = null;
      })
      $showArea.one("mouseleave", function() {
        _this.autoPlay && _this._autoPlay();
      });
    }
  };
  window.PicRoller = PicRoller;
})($, window);