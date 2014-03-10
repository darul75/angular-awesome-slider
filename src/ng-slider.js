(function (angular) {
'use strict';	

	angular.module('ngSlider', ['ngSanitize'])					
		// DIRECTIVE
		.directive('slider', ['$timeout', function(timeout) {
			return {
				restrict : 'AE',
				require: '?ngModel',
				scope: { options:'=' },
				priority: 1,
				template:
					'<span ng-class="mainSliderClass" id="{{sliderTmplId}}">' +
						'<table><tr><td>' +
							'<div class="jslider-bg">' +
								'<i class="l"></i><i class="f"></i><i class="r"></i>' +
								// '<i class="v"></i>' +
							'</div>' +
							'<div class="jslider-pointer"></div>' +
							'<div class="jslider-pointer jslider-pointer-to"></div>' +
							'<div class="jslider-label"><span ng-bind-html="from"></span></div>' +
							'<div class="jslider-label jslider-label-to"><span ng-bind-html="to"></span>{{options.dimension}}</div>' +
							'<div class="jslider-value"><span></span>{{options.dimension}}</div>' +
							'<div class="jslider-value jslider-value-to"><span></span>{{options.dimension}}</div>' +
							'<div class="jslider-scale" id="{{sliderScaleDivTmplId}}"></div>' +
						'</td></tr></table>' +
					'</span>',
				link : function(scope, element, attrs, ngModel) {					
					if(!ngModel) return; // do nothing if no ng-model							

					scope.sliderTmplId = attrs.id + '-slider-span';
					scope.sliderScaleDivTmplId = attrs.id + '-slider-scale';

					scope.mainSliderClass = 'jslider';

					// TODO : skin
					scope.mainSliderClass += ' jslider_round';

					// model -> view
		            ngModel.$render = function () {
						//elm.html(ctrl.$viewValue);

		                if( !ngModel.$viewValue.split(";")[1])
							scope.mainSliderClass += ' jslider-single';

						scope.init();	
		            };

					scope.init = function() {

						scope.from = ''+scope.options.from;
						scope.to = ''+scope.options.to;
						var OPTIONS = {						
							from: scope.options.from,
							to: scope.options.to,
							step: scope.options.step,
							smooth: scope.options.smooth,
							limits: true,
							round: scope.options.round || 0,
							value: ngModel.$viewValue,
							dimension: "",
							scale: scope.options.scale,
							sliderSpanId: scope.sliderTmplId,						
							callback: function(value) {
								scope.$apply(function() {
									ngModel.$setViewValue(value); // view -> model
								});
							}										
						};

						if (scope.options.calculate)
							OPTIONS.calculate = scope.options.calculate;

						timeout(function(){
							$("#"+attrs.id).slider(OPTIONS);
							$('#'+scope.sliderScaleDivTmplId).html(scope.generateScale());						
							scope.drawScale();
						});	

					};
									

					scope.generateScale = function(){
						if( scope.options.scale && scope.options.scale.length > 0 ){
							var str = "";
							var s = scope.options.scale;
							var prc = Math.round((100/(s.length-1))*10)/10;
							for( var i=0; i < s.length; i++ ){
								str += '<span style="left: ' + i*prc + '%">' + ( s[i] != '|' ? '<ins>' + s[i] + '</ins>' : '' ) + '</span>';
							}
							return str;
						} else return "";

						return "";
					};

					scope.drawScale = function(){
						$("#"+attrs.id+'-slider-span').find(".jslider-scale span ins").each(function(){
							$(this).css({ marginLeft: -$(this).outerWidth()/2 });
						});
					};

					// WATCH OPTIONS CHANGES

					scope.$watch('options', function(value) {
			    		scope.init();
					});
					
				}
			};
		}]);

(function( $ ) {

	var OPTIONS = {
		settings: {
				from: 1,
				to: 40,
				step: 1,
				smooth: true,
				limits: true,
				round: 0,			
				value: "3",
				dimension: ""				
			},
		className: "jslider",
		selector: ".jslider-"
	};

	function isArray( value ){
		if( typeof value == "undefined" ) return false;

		if (value instanceof Array || (!(value instanceof Object) &&
			(Object.prototype.toString.call((value)) == '[object Array]') ||
			typeof value.length == 'number' &&
			typeof value.splice != 'undefined' &&
			typeof value.propertyIsEnumerable != 'undefined' &&
			!value.propertyIsEnumerable('splice')
			)) {
			return true;
		}
		return false;
	}

	$.slider = function( node, settings ){
		var jNode = $(node);
		if( !jNode.data( "jslider" ) )
			jNode.data( "jslider", new Slider( node, settings ) );
		return jNode.data( "jslider" );
	};
	
	$.fn.slider = function( action, opt_value ){
		var returnValue, args = arguments;

		function isDef( val ){
			return val !== undefined;
		}

		function isDefAndNotNull( val ){
			return isDef( val ) && val !== null;
		}

		this.each(function(){

			$(this).data( "jslider", null )

			var self = $.slider( this, action );

			// do actions
			if( typeof action == "string" ){
				var pointers;
				switch( action ){
					case "value":						
						if( isDef( args[ 1 ] ) && isDef( args[ 2 ] ) ){
							pointers = self.getPointers();
							if( isDefAndNotNull( pointers[0] ) && isDefAndNotNull( args[1] ) ){
								pointers[0].set( args[ 1 ] );
								pointers[0].setIndexOver();
							}

							if( isDefAndNotNull( pointers[1] ) && isDefAndNotNull( args[2] ) ){
								pointers[1].set( args[ 2 ] );
								pointers[1].setIndexOver();
							}
						}

						else if( isDef( args[ 1 ] ) ){
							pointers = self.getPointers();
							if( isDefAndNotNull( pointers[0] ) && isDefAndNotNull( args[1] ) ){
								pointers[0].set( args[ 1 ] );
								pointers[0].setIndexOver();
							}
						}

						else
							returnValue = self.getValue();

						break;

					case "prc":						
						if( isDef( args[ 1 ] ) && isDef( args[ 2 ] ) ){
							pointers = self.getPointers();
							if( isDefAndNotNull( pointers[0] ) && isDefAndNotNull( args[1] ) ){
								pointers[0]._set( args[ 1 ] );
								pointers[0].setIndexOver();
							}

							if( isDefAndNotNull( pointers[1] ) && isDefAndNotNull( args[2] ) ){
								pointers[1]._set( args[ 2 ] );
								pointers[1].setIndexOver();
							}
						}
						else if( isDef( args[ 1 ] ) ){
							pointers = self.getPointers();
							if( isDefAndNotNull( pointers[0] ) && isDefAndNotNull( args[1] ) ){
								pointers[0]._set( args[ 1 ] );
								pointers[0].setIndexOver();
							}
						}
						else
							returnValue = self.getPrcValue();
						break;
					case "calculatedValue":
						var value = self.getValue().split(";");
						returnValue = "";
						for (var i=0; i < value.length; i++) {
							returnValue += (i > 0 ? ";" : "") + self.nice( value[i] );
						}
						break;

					case "skin":
						self.setSkin( args[1] );
						break;
				}
			}
			// return actual object
			else if( !action && !opt_value ){
				if( !isArray( returnValue ) )
					returnValue = [];
				returnValue.push( self );
			}
		});

		// flatten array just with one slider
		if( isArray( returnValue ) && returnValue.length == 1 )
			returnValue = returnValue[ 0 ];

		return returnValue || this;
	};

	function Slider(){
		/*jshint validthis:true */
		return this.init.apply( this, arguments );
	}

	Slider.prototype.init = function( node, settings ){
		this.settings = $.extend(true, {}, OPTIONS.settings, settings ? settings : {});
		this.inputNode = $( node ).hide();
		this.settings.interval = this.settings.to-this.settings.from;		
			
		if( this.settings.calculate && $.isFunction( this.settings.calculate ) )
			this.nice = this.settings.calculate;

		if( this.settings.onstatechange && $.isFunction( this.settings.onstatechange ) )
			this.onstatechange = this.settings.onstatechange;

		this.is = {
			init: false
		};
		this.o = {};

		this.create();
	};

	Slider.prototype.create = function(){
		var $this = this;

		this.domNode = $("#"+this.settings.sliderSpanId);

		this.inputNode.after( this.domNode );		

		// set skin class
		//   if( this.settings.skin && this.settings.skin.length > 0 )
		//     this.setSkin( this.settings.skin );

		this.sizes = {
			domWidth: this.domNode.width(),
			domOffset: this.domNode.offset()
		};

		// find some objects
		$.extend(this.o, {
			pointers: {},
			labels: {
				0: {
					o: this.domNode.find(OPTIONS.selector + "value").not(OPTIONS.selector + "value-to")
				},
				1: {
					o: this.domNode.find(OPTIONS.selector + "value").filter(OPTIONS.selector + "value-to")
				}
			},
			limits: {
				0: this.domNode.find(OPTIONS.selector + "label").not(OPTIONS.selector + "label-to"),
				1: this.domNode.find(OPTIONS.selector + "label").filter(OPTIONS.selector + "label-to")
			}
		});

		$.extend(this.o.labels[0], {
			value: this.o.labels[0].o.find("span")
		});

		$.extend(this.o.labels[1], {
			value: this.o.labels[1].o.find("span")
		});


		if( !$this.settings.value.split(";")[1] ){
			this.settings.single = true;
		}		

		var clickPtr;

		this.domNode.find(OPTIONS.selector + "pointer").each(function( i ){
			var value = $this.settings.value.split(";")[i];
			if( value ){
				$this.o.pointers[i] = new SliderPointer( this, i, $this );

			var prev = $this.settings.value.split(";")[i-1];
			if( prev && value < prev ) value = prev;

			value = value < $this.settings.from ? $this.settings.from : value;
			value = value > $this.settings.to ? $this.settings.to : value;
				
			$this.o.pointers[i].set( value, true );

			if (i === 0) {
				$this.domNode.mousedown(function( event ){					

					$this.o.pointers[i]._parent = {
						offset: $this.domNode.offset(),
						width: $this.domNode.width()
					};					

					$this.o.pointers[i]._mousemove(event);
					$this.o.pointers[i].onmouseup();
					
					return false;
				});
			}
			}
		});		

		this.o.value = this.domNode.find(".v");
		this.is.init = true;

		$.each(this.o.pointers, function(i){
			$this.redraw(this);
		});

		(function(self){
			$(window).resize(function(){
				self.onresize();
			});
		})(this);
	};			

	Slider.prototype.nice = function( value ){
		return value;
	};

	Slider.prototype.onstatechange = function(){

	};

	Slider.prototype.limits = function( x, pointer ){
		// smooth
		if( !this.settings.smooth ){
			var step = this.settings.step*100 / ( this.settings.interval );
			x = Math.round( x/step ) * step;
		}

		var another = this.o.pointers[1-pointer.uid];
		if( another && pointer.uid && x < another.value.prc ) x = another.value.prc;
		if( another && !pointer.uid && x > another.value.prc ) x = another.value.prc;

		// base limit
		if( x < 0 ) x = 0;
		if( x > 100 ) x = 100;

		return Math.round( x*10 ) / 10;
	};

	Slider.prototype.setPointersIndex = function( i ){
		$.each(this.getPointers(), function(i){
			this.index( i );
		});
	};

	Slider.prototype.getPointers = function(){
		return this.o.pointers;
	};

	Slider.prototype.onresize = function(){
		var self = this;
		this.sizes = {
			domWidth: this.domNode.width(),
			domOffset: this.domNode.offset()
		};

		$.each(this.o.pointers, function(i){
			self.redraw(this);
		});
	};

	Slider.prototype.update = function(){
		this.onresize();
		this.drawScale();
	};

	Slider.prototype.drawScale = function(){
		this.domNode.find(OPTIONS.selector + "scale span ins").each(function(){
			$(this).css({ marginLeft: -$(this).outerWidth()/2 });
		});
	};

	Slider.prototype.redraw = function( pointer ){
		if( !this.is.init ) return false;

		this.setValue();

		// redraw range line
		if( this.o.pointers[0] && this.o.pointers[1] )
			this.o.value.css({ left: this.o.pointers[0].value.prc + "%", width: ( this.o.pointers[1].value.prc - this.o.pointers[0].value.prc ) + "%" });

		this.o.labels[pointer.uid].value.html(this.nice(pointer.value.origin));

		// redraw position of labels
		this.redrawLabels( pointer );
	};

	Slider.prototype.redrawLabels = function( pointer ){

		function setPosition( label, sizes, prc ){
			sizes.margin = -sizes.label/2;

			// left limit
			var label_left = sizes.border + sizes.margin;
			if( label_left < 0 )
				sizes.margin -= label_left;

			// right limit
			if( sizes.border+sizes.label / 2 > self.sizes.domWidth ){
				sizes.margin = 0;
				sizes.right = true;
			} else
				sizes.right = false;

			label.o.css({ left: prc + "%", marginLeft: sizes.margin, right: "auto" });
			if( sizes.right ) label.o.css({ left: "auto", right: 0 });
				return sizes;
			}

			var self = this;
			var label = this.o.labels[pointer.uid];
			var prc = pointer.value.prc;

			var sizes = {
				label: label.o.outerWidth(),
				right: false,
				border: ( prc * this.sizes.domWidth ) / 100
			};

			var another_label = null;

			if( !this.settings.single ){
				// glue if near;
				var another = this.o.pointers[1-pointer.uid];
				another_label = this.o.labels[another.uid];

				switch( pointer.uid ){
					case 0:
						if( sizes.border+sizes.label / 2 > another_label.o.offset().left-this.sizes.domOffset.left ){
							another_label.o.css({ visibility: "hidden" });
							another_label.value.html( this.nice( another.value.origin ) );

							label.o.css({ visibility: "visible" });

							prc = ( another.value.prc - prc ) / 2 + prc;
							if( another.value.prc != pointer.value.prc ){
								label.value.html( this.nice(pointer.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(another.value.origin) );
								sizes.label = label.o.outerWidth();
								sizes.border = ( prc * this.sizes.domWidth ) / 100;
							}
						} else {
							another_label.o.css({ visibility: "visible" });
						}
						break;
					case 1:
						if( sizes.border - sizes.label / 2 < another_label.o.offset().left - this.sizes.domOffset.left + another_label.o.outerWidth() ){
							another_label.o.css({ visibility: "hidden" });
							another_label.value.html( this.nice(another.value.origin) );

							label.o.css({ visibility: "visible" });

							prc = ( prc - another.value.prc ) / 2 + another.value.prc;
							if( another.value.prc != pointer.value.prc ){
								label.value.html( this.nice(another.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(pointer.value.origin) );
								sizes.label = label.o.outerWidth();
								sizes.border = ( prc * this.sizes.domWidth ) / 100;
							}
						} else {
							another_label.o.css({ visibility: "visible" });
						}
						break;
					}
				}

			sizes = setPosition( label, sizes, prc );

			/* draw second label */
			if( another_label ){
				sizes = {
					label: another_label.o.outerWidth(),
					right: false,
					border: ( another.value.prc * this.sizes.domWidth ) / 100
				};
				sizes = setPosition( another_label, sizes, another.value.prc );
			}

			this.redrawLimits();
		};

	Slider.prototype.redrawLimits = function(){
		if( this.settings.limits ){

			var limits = [ true, true ];

			for( var key in this.o.pointers ){

				if( !this.settings.single || key === 0 ){

				var pointer = this.o.pointers[key];
				var label = this.o.labels[pointer.uid];
				var label_left = label.o.offset().left - this.sizes.domOffset.left;

				var limit = this.o.limits[0];
				if( label_left < limit.outerWidth() )
					limits[0] = false;

				limit = this.o.limits[1];
				if( label_left + label.o.outerWidth() > this.sizes.domWidth - limit.outerWidth() )
					limits[1] = false;
			}
		}

		for( var i=0; i < limits.length; i++ ){
			if( limits[i] )
				this.o.limits[i].fadeIn("fast");
			else
				this.o.limits[i].fadeOut("fast");
			}
		}
	};

	Slider.prototype.setValue = function(){
		var value = this.getValue();
		this.inputNode.attr( "value", value );
		this.onstatechange.call( this, value );
	};

	Slider.prototype.getValue = function(){
		if(!this.is.init) return false;
		var $this = this;

		var value = "";
		$.each( this.o.pointers, function(i){
		if( this.value.prc !== undefined && !isNaN(this.value.prc) ) value += (i > 0 ? ";" : "") + $this.prcToValue( this.value.prc );
		});
		return value;
	};

	Slider.prototype.getPrcValue = function(){
		if(!this.is.init) return false;
		var $this = this;

		var value = "";
		$.each( this.o.pointers, function(i){
		if( this.value.prc !== undefined && !isNaN(this.value.prc) ) value += (i > 0 ? ";" : "") + this.value.prc;
		});
		return value;
	};

	Slider.prototype.prcToValue = function( prc ){
		var value;
		if( this.settings.heterogeneity && this.settings.heterogeneity.length > 0 ){
			var h = this.settings.heterogeneity;

			var _start = 0;
			var _from = this.settings.from;

			for( var i=0; i <= h.length; i++ ){
				var v;
				if( h[i] ) 
					v = h[i].split("/");
				else
					v = [100, this.settings.to];				

				if( prc >= _start && prc <= v[0] ) {
					value = _from + ( (prc-_start) * (v[1]-_from) ) / (v[0]-_start);
				}

				_start = v[0];
				_from = v[1];
			}
		} 
		else {
			value = this.settings.from + ( prc * this.settings.interval ) / 100;
		}

		return this.round( value );
	};

	Slider.prototype.valueToPrc = function( value, pointer ){
		var prc;
		if( this.settings.heterogeneity && this.settings.heterogeneity.length > 0 ){
			var h = this.settings.heterogeneity;

			var _start = 0;
			var _from = this.settings.from;

			for (var i=0; i <= h.length; i++) {
				var v;
				if(h[i])
					v = h[i].split("/");
				else
					v = [100, this.settings.to];				

				if(value >= _from && value <= v[1]){
					prc = pointer.limits(_start + (value-_from)*(v[0]-_start)/(v[1]-_from));
				}

				_start = v[0]; _from = v[1];
			}

		} else {
			prc = pointer.limits((value-this.settings.from)*100/this.settings.interval);
		}

		return prc;
	};

	Slider.prototype.round = function( value ){
		value = Math.round( value / this.settings.step ) * this.settings.step;
		if( this.settings.round ) 
			value = Math.round( value * Math.pow(10, this.settings.round) ) / Math.pow(10, this.settings.round);
		else 
			value = Math.round( value );
		return value;
	};

	function Draggable(){
		this._init.apply( this, arguments );
	}

	Draggable.prototype.oninit = function(){

	};

	Draggable.prototype.events = function(){

	};

	Draggable.prototype.onmousedown = function(){
		this.ptr.css({ position: "absolute" });
	};

	Draggable.prototype.onmousemove = function( evt, x, y ){
		this.ptr.css({ left: x, top: y });
	};

	Draggable.prototype.onmouseup = function(){

	};

	Draggable.prototype.isDefault = {
		drag: false,
		clicked: false,
		toclick: true,
		mouseup: false
	};

	Draggable.prototype._init = function(){
		if( arguments.length > 0 ){
			this.ptr = $(arguments[0]);
			this.outer = $(".draggable-outer");

			this.is = {};
			$.extend( this.is, this.isDefault );

			var _offset = this.ptr.offset();
				this.d = {
				left: _offset.left,
				top: _offset.top,
				width: this.ptr.width(),
				height: this.ptr.height()
			};

			this.oninit.apply( this, arguments );

			this._events();
		}
	};

	Draggable.prototype._getPageCoords = function( event ){
		if( event.targetTouches && event.targetTouches[0] ){
			return { x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY };
		} else
			return { x: event.pageX, y: event.pageY };
	};

	Draggable.prototype._bindEvent = function( ptr, eventType, handler ){
		var self = this;

		if( this.supportTouches_ )
			ptr.get(0).addEventListener( this.events_[ eventType ], handler, false );

		else
			ptr.bind( this.events_[ eventType ], handler );
	};

	Draggable.prototype._events = function(){
		var self = this;

		this.supportTouches_ = 'ontouchend' in document;
		this.events_ = {
		"click": this.supportTouches_ ? "touchstart" : "click",
		"down": this.supportTouches_ ? "touchstart" : "mousedown",
		"move": this.supportTouches_ ? "touchmove" : "mousemove",
		"up"  : this.supportTouches_ ? "touchend" : "mouseup"
		};

		this._bindEvent( $( document ), "move", function( event ){
			if( self.is.drag ){
				event.stopPropagation();
				event.preventDefault();
				self._mousemove( event );
			}
		});
		this._bindEvent( $( document ), "down", function( event ){
			if( self.is.drag ){
				event.stopPropagation();
				event.preventDefault();
			}
		});
		this._bindEvent( $( document ), "up", function( event ){
			self._mouseup( event );
		});

		this._bindEvent( this.ptr, "down", function( event ){
		self._mousedown( event );
			return false;
		});
		this._bindEvent( this.ptr, "up", function( event ){
			self._mouseup( event );
		});

		this.ptr.find("a")
		.click(function(){
			self.is.clicked = true;

			if( !self.is.toclick ){
				self.is.toclick = true;
				return false;
			}
		})
		.mousedown(function( event ){
			self._mousedown( event );
			return false;
		});

		this.events();
	};

	Draggable.prototype._mousedown = function( evt ){
		this.is.drag = true;
		this.is.clicked = false;
		this.is.mouseup = false;

		var _offset = this.ptr.offset();
		var coords = this._getPageCoords( evt );
		this.cx = coords.x - _offset.left;
		this.cy = coords.y - _offset.top;

		$.extend(this.d, {
			left: _offset.left,
			top: _offset.top,
			width: this.ptr.width(),
			height: this.ptr.height()
		});

		if( this.outer && this.outer.get(0) ){
			this.outer.css({ height: Math.max(this.outer.height(), $(document.body).height()), overflow: "hidden" });
		}

		this.onmousedown( evt );
	};

	Draggable.prototype._mousemove = function( evt ){
		this.is.toclick = false;
		var coords = this._getPageCoords( evt );
		this.onmousemove( evt, coords.x - this.cx, coords.y - this.cy );
	};

	Draggable.prototype._mouseup = function( evt ){
		var oThis = this;

		if( this.is.drag ){
		this.is.drag = false;

		if( this.outer && this.outer.get(0) ){

			if( $.browser.mozilla ){
				this.outer.css({ overflow: "hidden" });
			} else {
				this.outer.css({ overflow: "visible" });
			}

		if( $.browser.msie && $.browser.version == '6.0' ){
		this.outer.css({ height: "100%" });
		} else {
		this.outer.css({ height: "auto" });
		}  
		}

		this.onmouseup( evt );
		}
	};

	window.Draggable = Draggable;

	function SliderPointer(){
		Draggable.apply( this, arguments );
	}

	SliderPointer.prototype = new Draggable();

	SliderPointer.prototype.oninit = function( ptr, id, _constructor ){
		this.uid = id;
		this.parent = _constructor;
		this.value = {};
		this.settings = this.parent.settings;
	};

	SliderPointer.prototype.onmousedown = function(evt){
		this._parent = {
		offset: this.parent.domNode.offset(),
		width: this.parent.domNode.width()
		};
		this.ptr.addClass("jslider-pointer-hover");
		this.setIndexOver();
	};

	SliderPointer.prototype.onmousemove = function( evt, x ){
	var coords = this._getPageCoords( evt );
	this._set( this.calc( coords.x ) );
	};

	SliderPointer.prototype.onmouseup = function( evt ){
		if( this.parent.settings.callback && $.isFunction(this.parent.settings.callback) )
			this.parent.settings.callback.call( this.parent, this.parent.getValue() );

		this.ptr.removeClass("jslider-pointer-hover");
	};

	SliderPointer.prototype.setIndexOver = function(){
	this.parent.setPointersIndex( 1 );
	this.index( 2 );
	};

	SliderPointer.prototype.index = function( i ){
		this.ptr.css({ zIndex: i });
	};

	SliderPointer.prototype.limits = function( x ){
		return this.parent.limits( x, this );
	};

	SliderPointer.prototype.calc = function(coords){
		var x = this.limits(((coords-this._parent.offset.left)*100)/this._parent.width);
		return x;
	};

	SliderPointer.prototype.set = function( value, opt_origin ){
		this.value.origin = this.parent.round(value);
		this._set( this.parent.valueToPrc( value, this ), opt_origin );
	};

	SliderPointer.prototype._set = function( prc, opt_origin ){
		if( !opt_origin )
			this.value.origin = this.parent.prcToValue(prc);

		this.value.prc = prc;
		this.ptr.css({ left: prc + "%" });
		this.parent.redraw(this);
	};

})(jQuery);

})(angular);
