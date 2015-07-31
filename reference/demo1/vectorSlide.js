(function(global, d, undefined) {
	'use strict';
	var proto = Array.prototype;
	if (![].some) {
		proto.some = function(callback, thisArg) {
			var ret = false;
			for (var i = 0, l = this.length; i < l; i++) {
				if (callback.apply(thisArg || null, [this[i], i, this]) === true) {
					ret = true;
					return ret;
				}
			}
			return ret;
		};
	}
	if (![].forEach) {
		proto.forEach = function(callback, thisArg) {
			var ret = [];
			for (var i = 0, l = this.length; i < l; i++) {
				callback.apply(thisArg || null, [this[i], i, this]);
			}
			return this;
		};
	}
	if (![].indexOf) {
		proto.indexOf = function(who) {
			for (var i = 0, l = this.length, ret; i < l; i++) {
				if (this[i] == who) {
					ret = i;
					break;
				}
			}
			return ret;
		}
	}
	var isCss3 = (function() {
		var prefix = ['', '-webkit-', '-o-', '-moz-', '-ms-', '-khtml-'],
			div = d.createElement('div'),
			divStyle = div.style;
		return prefix.some(function(pre) {
			return pre + 'transition' in divStyle;
		})
	})()
	var makeArray = function(arr) {
		var ret = [];
		try {
			ret = [].slice.call(arr)
		} catch (e) {
			for (var i = 0, l = arr.length; i < l; i++) {
				ret.push(arr[i]);
			}
		}
		return ret;
	}
	var addEvent = function(el, type, callback) {
		if (typeof addEventListener === 'function') {
			el.addEventListener(type, callback, false)
		} else {
			el.attachEvent('on' + type, callback)
		}
	}
	var preventDefault = function(e) {
		e.preventDefault ? e.preventDefault() : (window.event.returnValue = false);
	}
	var VectorSlide = function(config) {
		this.target = config.target;
		this.prevBtn = config.prevBtn;
		this.nextBtn = config.nextBtn;
		this.colNum = config.colNum || 3;
		this.index = this.mid = (typeof config.mid == 'undefined') ? Math.floor(this.colNum / 2) : config.mid;
		this.gutterWidth = config.gutterWidth || 0;
		this.scale = config.scale;
		this.autoPlay = config.autoPlay;
		this.direction = config.direction;
		this.delay = config.delay || 2000;
		this.tick = makeArray(this.target);
		this._tick = this.tick.slice();
		this.vector = [];
		this._vector = [];
		this.matrix = config.matrix || [];
		this.hasEffect = config.effect;
		this.onchange = config.onchange;
		this.initialize();
	}
	VectorSlide.prototype = {
		initialize: function() {
			this.buildVector();
			this.bindEvent();
			if (this.hasEffect && isCss3) {
				var transProperty = 'all linear .2s;';
				this.tick.forEach(function(dom) {
					dom.style.cssText += ';-webkit-transition: ' + transProperty + ';-moz-transition: ' + transProperty + ';-khtml-transition: ' + transProperty + ';-ms-transition: ' + transProperty + ';-o-transition: ' + transProperty + ';transition: ' + transProperty + ';-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0);'
				})
			}
			this.autoPlay && this.setAutoPlay();
			this.onchange && this.onchange.call(this, this.index);
		},
		buildVector: function() {
			var self = this,
				colnum = this.colNum,
				mid = this.mid,
				guttewidth = this.gutterWidth,
				scale = this.scale,
				matrix = this.matrix,
				tmpValue = {
					'left': 0,
					'width': 0,
					'height': 0,
					'margin-top': 0
				},
				tmpOtherValue = {};
			// 如果存在自定义矩阵,那么使用自定义矩阵布局,默认视图为等比透视
			// 自定义矩阵需要定义多一个'消失的元素'坐标
			if (matrix && matrix.length) {
				for (var i in matrix[0]) {
					if (matrix[0].hasOwnProperty(i)) {
						tmpOtherValue[i] = 0;
					}
				}
				this.tick.forEach(function(dom, index) {
					if (index <= colnum) {
						tmpValue = matrix[index];
					} else {
						tmpValue = tmpOtherValue;
					}
					self.vector.push(tmpValue)
					for (var i in tmpValue) {
						if (tmpValue.hasOwnProperty(i)) {
							dom.style.cssText += ';' + i + ':' + tmpValue[i];
						}
					}
				})
			} else {
				this.tick.forEach(function(dom, index) {
					if (index < colnum) {
						var width = (index == mid ? dom.offsetWidth : (scale ? dom.offsetWidth * scale : dom.offsetWidth * Math.pow(0.8, Math.abs(index - mid)))),
							height = width * dom.offsetHeight / dom.offsetWidth;
						tmpValue = {
							'left': parseInt(tmpValue.left, 10) + parseInt(tmpValue.width, 10) + guttewidth + 'px',
							'width': width + 'px',
							'height': height + 'px',
							'margin-top': -0.5 * height + 'px'
						}
					} else if (index == colnum) {
						tmpValue = {
							'left': parseInt(tmpValue.left, 10) + parseInt(tmpValue.width, 10) + guttewidth + 'px',
							'width': 0,
							'height': 0,
							'margin-top': 0
						}
					} else {
						tmpValue = {
							'left': 0,
							'width': 0,
							'height': 0,
							'margin-top': 0
						}
					}
					self.vector.push(tmpValue)
					for (var i in tmpValue) {
						if (tmpValue.hasOwnProperty(i)) {
							dom.style.cssText += ';' + i + ':' + tmpValue[i];
						}
					}
				})
			}
		},
		bindEvent: function() {
			var self = this;
			if (this.prevBtn) {
				addEvent(self.prevBtn, 'click', function(e) {
					preventDefault(e);
					self.handleType('prev');
				})
			}
			if (this.nextBtn) {
				addEvent(self.nextBtn, 'click', function(e) {
					preventDefault(e);
					self.handleType('next');
				})
			}
			// 不确定性所以不使用事件代理注册点击事件
			// 点击是,变化矩阵并且执行rebuildView
			this.tick.forEach(function(dom) {
				addEvent(dom, 'click', function(e) {
					var index = self._tick.indexOf(dom);
					self.handleType(index);
				});
			})
		},
		handleType: function(type) {
			// 每次点击的时候,重排vector,然后根据新旧数组来判断元素才怎么变化
			var self = this,
				mid = this.mid,
				len = this.tick.length,
				delay = this.delay,
				timmer;
			clearTimeout(self.moviePlayer);
			clearTimeout(self.movieTimmer);
			if (type == 'prev') {
				this._tick.unshift(this._tick.pop());
				this._vector = this.vector.slice();
				this.vector.push(this.vector.shift());
			} else if (type == 'next') {
				this._tick.push(this._tick.shift());
				this._vector = this.vector.slice();
				this.vector.unshift(this.vector.pop());
			} else {
				this._vector = this.vector.slice();
				// goddamn ie didn't allow single argument in [].splice
				this.vector = this.vector.splice(mid - type, len).concat(this.vector);
				this._tick = this._tick.splice(-(mid - type), len).concat(this._tick);
			}
			this.index = this.tick.indexOf(this._tick[this.mid]);
			this.rebuildView();
			if (this.autoPlay) {
				this.setAutoPlay();
			}
		},
		rebuildView: function() {
			var self = this;
			// 获取原来的元素在原本的矩阵中得配置,然后更新到新矩阵中得配置
			if (this.hasEffect && !isCss3) {
				this._animateQueue();
			} else {
				this.tick.forEach(function(dom, index) {
					var cssList = self.vector[index];
					for (var i in cssList) {
						if (cssList.hasOwnProperty(i)) {
							dom.style.cssText += ';' + i + ':' + cssList[i];
						}
					}
				})
			}
			// 更新zIndex,你看到的都不是真的
			this._tick.forEach(function(dom, index) {
				if(index == 3){
					index = 1;
				}
				if(index == 4){
					index = 0;
				}
				if(index==2){
					dom.style.padding="2px";
					dom.style.backgroundColor="#7C3AFE";
				}else{
					dom.style.padding="";
					dom.style.backgroundColor="";
				}
				dom.style.cssText += ';z-index: ' + index;
			})
			this.onchange && this.onchange.call(this, this.index);
		},
		_animateQueue: function() {
			var queue = this.tick.slice(),
				_vector = this._vector,
				vector = this.vector,
				self = this,
				startTime = +new Date(),
				duration;
			// this.timmers.push(this.movieTimmer);
			var fx = function() {
				duration = +new Date - startTime;
				if (duration < 200) {
					queue.forEach(function(dom, index) {
						var domStyle = dom.style;
						for (var i in vector[index]) {
							if (vector[index].hasOwnProperty(i)) {
								var step = (parseInt(vector[index][i], 10) - parseInt(_vector[index][i], 10)) / 200 * 16,
									key = (i.indexOf('-') !== -1) ? i.replace(/-\w/g, function(a) {
										return a.substr(1).toUpperCase()
									}) : i;
								domStyle[key] = parseInt(domStyle[key], 10) + step + 'px';
							}
						}
					})
					self.movieTimmer = setTimeout(fx, 16)
				} else {
					clearTimeout(self.movieTimmer)
					queue.forEach(function(dom, index) {
						var domStyle = dom.style;
						for (var i in vector[index]) {
							if (vector[index].hasOwnProperty(i)) {
								var key = (i.indexOf('-') !== -1) ? i.replace(/-\w/g, function(a) {
									return a.substr(1).toUpperCase()
								}) : i;
								domStyle[key] = vector[index][i];
							}
						}
					})
				}
			}
			fx();
		},
		setAutoPlay: function() {
			var self = this,
				delay = this.delay,
				direction = this.direction === 'reverse' ? 'prev' : 'next';
			this.moviePlayer = setTimeout(function() {
				self.handleType(direction);
			}, delay)
		},
		prev: function() {
			this.handleType('prev');
		},
		next: function() {
			this.handleType('next');
		}
	}
	global.VectorSlide = VectorSlide;
})(window, document);