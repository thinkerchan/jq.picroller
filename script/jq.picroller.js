/**
 * @thinkerchan chenxinkai@163.com
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
    column:5,
    dots:false,
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
      this.styleArr = []; // 存储当前样式
      this.styleArrBk = []
      this.itemArr = []; // 存储所有卡片
      this.timer = null;
      this.flag = 1;
      if (this.show_len < this.column) {
        alert("数量设置错误!");
        return false;
      }
      this.saveStyle(this.styleArr);
      this.arrows();
      this.autoPlay && this._autoPlay();

      this.curIndex = 0;
    },

    // 存储所有的show-item 但只存储 column个 样式
    saveStyle:function(styleArr) {
      var show_len = this.show_len,
        column = this.column;

      let dotsStr = ''

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
        $cur_li.index = i
        this.itemArr.push($cur_li);
        dotsStr +=`<span class="dots-item" data-index="${i}">${i}</span>`
      }

      this.styleArrBk = $.extend(true,[],styleArr)

      if (this.dots) {
        this.$dots = $(`<div class="dots-wraps">${dotsStr}</div>`)
        this.$showArea.parent().append(this.$dots)

        this.visualTargetIndex = (this.column-1)/2
        // this.$dots.find('.dots-item').eq(0+this.visualTargetIndex).addClass('active')
        this.$dots.find('.dots-item').eq(0).addClass('active')

        this.dotsClick && this.$dots.on('click','.dots-item',(e)=>{

          let targetIndex = e.target.dataset.index
          let distance =  targetIndex - this.curIndex
          // console.log('distance:',distance);
          switch (distance) {
            case 0:
              break;
            case 1:
                this.animation('next')
              break;
            case -1:
                this.animation('prev')
              break;
            default:
              this._sort(targetIndex,distance)
              break;
          }
        })
      }else{
        dotsStr = ''
      }
    },
    _sort(targetIndex,distance){
      // console.log('distance:',distance);

      if (distance>0) {
        let arrCut = this.itemArr.splice(0,Math.abs(distance))
        this.itemArr.push(...arrCut)
      }else{
        let arrCut = this.itemArr.splice(this.itemArr.length-Math.abs(distance),Math.abs(distance))
        this.itemArr.unshift(...arrCut)
      }

      let styleArrBk = this.styleArrBk
      let midIndex = (this.column-1)/2
      // itemArr重新排序之后,需要调整对应顺序的样式
      for (let idx = 0; idx < this.show_len; idx++) {
        if (idx < this.column) {
          this.itemArr[idx]
          .css({
            display:'block',
            opacity:0,
            zIndex: (idx < midIndex ? idx : idx == midIndex ? midIndex : this.column - idx - 1) + 1,
          })
          .animate({
            left:styleArrBk[idx].left,
            top:styleArrBk[idx].top,
            opacity:1,
            width:styleArrBk[idx].width,
            height:styleArrBk[idx].height,
          })
        }else{
          this.itemArr[idx].hide()
        }
      }

      this.curIndex = this.itemArr[0].index
      this.$dots.find('.dots-item').eq(targetIndex).addClass('active').siblings().removeClass('active')
      this.callBack && this.callBack(this.curIndex)
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
    animation:function(direction, num) {
      var _this = this,
        column = this.column,
        styleArr = this.styleArr,
        itemArr = this.itemArr,
        moveSpeed = this.moveSpeed,
        center  =  parseInt((column-1)/2);

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

      this.curIndex = itemArr[0].index
      // console.log(this.curIndex);

      if (this.dots) {
        // this.$dots.find('.dots-item').eq((itemArr[column - 1].index) - this.visualTargetIndex).addClass('active').siblings().removeClass('active')
        this.$dots.find('.dots-item').eq((itemArr[0].index) ).addClass('active').siblings().removeClass('active')
      }
      itemArr[center].addClass(this.midClass).siblings().removeClass(this.midClass);
      this.callBack && this.callBack(this.curIndex)
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
