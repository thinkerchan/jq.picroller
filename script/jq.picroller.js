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
  // 构造函数
  function PicRoller(options) {
    $.extend(this, defaults, options);
    this.init();
  }
  PicRoller.prototype = {
    init:function() {
      var $showArea = $(this.showArea);
      this.$showArea = $showArea;
      var $showArea_li = $(this.showArea + ">li");
      this.$showArea_li = $showArea_li;
      this.$prev = $(this.prev);
      this.$next = $(this.next);
      this.show_len = $showArea_li.length;
      this.styleArr = [];
      this.itemArr = [];
      this.timer = null;
      this.flag = 1;
      if (this.show_len < this.column) {
        alert("数量设置错误!");
        return false;
      }
      this.saveStyle();
      this.arrows();
      this.autoPlay && this._autoPlay();
    },
    // 存储所有的show-item 但只存储 column个 样式
    saveStyle:function() {
      var show_len = this.show_len, column = this.column, styleArr = this.styleArr;
      for (var i = 0; i < show_len; i++) {
        var $cur_li = this.$showArea_li.eq(i);
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
        this.itemArr.push($cur_li);
      }
    },
    arrows:function() {
      this._prev();
      this._next();
    },
    _prev:function() {
      this.bindClick(this.$prev, "prev");
    },
    _next:function() {
      this.bindClick(this.$next, "next");
    },
    bindClick:function(prevOrNext, direction) {
      var _this = this;
      prevOrNext.bind("click", function() {
        _this.flag && (_this.flag = 0, _this.animation(direction))
      });
    },
    animation:function(direction) {
      var _this = this, column = this.column, styleArr = this.styleArr, itemArr = this.itemArr, moveSpeed = this.moveSpeed, center  =  parseInt((column-1)/2);
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
          itemArr[column].css(lastStyleObj).fadeIn(moveSpeed,function(){
            _this.flag = 1;
          });
        } else {
          itemArr[0].stop().css(lastStyleObj).fadeIn(moveSpeed,function(){
            _this.flag = 1;
          });
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
        itemArr[itemArr.length - 1].stop().css(firstStyleObj).fadeIn(moveSpeed,function(){
            _this.flag = 1;
          });
        itemArr.unshift(itemArr.pop());
        this.lazyLoad(0);
      }
      itemArr[center].addClass(this.midClass).siblings().removeClass(this.midClass);
    },
    lazyLoad:function(index) {
      var itemArr = this.itemArr,
          $nextOne = itemArr[index].find("img"),
          $realSrc = $nextOne.data("src"),
          hasSrc = itemArr[index].find("img").attr("src");
      !hasSrc && $nextOne.attr("src", $realSrc);
    },
    _autoPlay:function(){
      var _this = this;
      this.timer = setInterval(function(){
        _this.$next.click();
      }, _this.stay);
      this.clearTimer();
    },
    clearTimer:function() {
      var _this = this, timer = this.timer;
      this.$showArea.one("mouseenter", function() {
        clearInterval(timer);
        timer = null;
      }).one("mouseleave", function() {
        _this.autoPlay && _this._autoPlay();
      });
    }
  };
  window.PicRoller = PicRoller;
})($, window);
