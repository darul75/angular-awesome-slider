(function(angular){
  'use strict';

  angular.module('ngSlider').factory('sliderPointer', ['sliderDraggable', function(Draggable) {

    function SliderPointer() {
      Draggable.apply( this, arguments );
    }

    SliderPointer.prototype = new Draggable();

    SliderPointer.prototype.oninit = function( ptr, id, _constructor ){
      this.uid = id;
      this.parent = _constructor;
      this.value = {};
      this.settings = angular.copy(_constructor.settings);
    };

    SliderPointer.prototype.onmousedown = function(evt) {
      var offset = {
        left: this.parent.domNode[0].offsetLeft,
        top: this.parent.domNode[0].offsetTop,
        width: this.parent.domNode[0].clientWidth,
        height: this.parent.domNode[0].clientHeight
      };

      this._parent = {
        offset: offset,
        width: offset.width
      };

      this.ptr.addClass("jslider-pointer-hover");
      this.setIndexOver();
    };

    SliderPointer.prototype.onmousemove = function( evt, x ){
      var coords = this._getPageCoords( evt );
      this._set( this.calc( coords.x ) );
    };

    SliderPointer.prototype.onmouseup = function( evt ){
      if( this.settings.callback && angular.isFunction(this.settings.callback) )
        this.settings.callback.call( this.parent, this.parent.getValue() );

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

    return SliderPointer;
  }]);
}(angular));