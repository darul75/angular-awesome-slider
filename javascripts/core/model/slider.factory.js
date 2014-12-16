(function(angular){
  'use strict';

  angular.module('ngSlider').factory('slider', ['sliderPointer', 'sliderConstants', 'utils', function(SliderPointer, sliderConstants, utils) {

    function Slider() {
      return this.init.apply( this, arguments );
    }

    Slider.prototype.init = function( inputNode, templateNode, settings ){
      this.settings = sliderConstants.SLIDER.settings;
      angular.extend(this.settings, angular.copy(settings));

      this.inputNode = inputNode;
      this.inputNode.addClass("ng-hide");

      this.settings.interval = this.settings.to-this.settings.from;
      
      if( this.settings.calculate && $.isFunction( this.settings.calculate ) )
        this.nice = this.settings.calculate;

      if( this.settings.onstatechange && $.isFunction( this.settings.onstatechange ) )
        this.onstatechange = this.settings.onstatechange;

      this.is = { init: false };
      this.o = {};

      this.create(templateNode);
    };

    Slider.prototype.create = function(templateNode){
      var $this = this;

      this.domNode = templateNode;

      //this.inputNode.after( this.domNode );   

      // set skin class
      //   if( this.settings.skin && this.settings.skin.length > 0 )
      //     this.setSkin( this.settings.skin );

      var off = utils.offset(this.domNode);

      var offset = {
        left: off.left,
        top: off.top,
        width: this.domNode[0].clientWidth,
        height: this.domNode[0].clientHeight
      };      

      this.sizes = { domWidth: this.domNode[0].clientWidth, domOffset: offset };

      // find some objects
      angular.extend(this.o, {
        pointers: {},
        labels: {
          0: {            
            o : angular.element(this.domNode.find('div')[5])
          },
          1: {            
            o : angular.element(this.domNode.find('div')[6])
          }
        },
        limits: {          
          0: angular.element(this.domNode.find('div')[3]),          
          1: angular.element(this.domNode.find('div')[5])
        }
      });

      angular.extend(this.o.labels[0], {
        value: this.o.labels[0].o.find("span")
      });

      angular.extend(this.o.labels[1], {
        value: this.o.labels[1].o.find("span")
      });

      if( !$this.settings.value.split(";")[1] ) {
        this.settings.single = true;
      }

      var clickPtr;

      var domNodeDivs = this.domNode.find('div');
      var pointers = [ angular.element(domNodeDivs[1]), angular.element(domNodeDivs[2]) ];

      angular.forEach(pointers, function(pointer, key ) {
        $this.settings = angular.copy($this.settings);
        var value = $this.settings.value.split(';')[key];
        if( value ) {
          $this.o.pointers[key] = new SliderPointer( pointer, key, $this.settings.vertical, $this );

          var prev = $this.settings.value.split(';')[key-1];
          if( prev && parseInt(value, 10) < parseInt(prev, 10 )) value = prev;

          var value1 = value < $this.settings.from ? $this.settings.from : value;
          value1 = value > $this.settings.to ? $this.settings.to : value;

          $this.o.pointers[key].set( value1, true );

          if (key === 0) {
            $this.domNode.bind('mousedown', function( event ) {

              var className = event.target.className;
              var targetIdx = 0;

              if (className.indexOf('jslider-pointer-to') > 0) {
                targetIdx = 1;
              }

              var offset = {
                left: $this.domNode[0].offsetLeft,
                top: $this.domNode[0].offsetTop,
                width: $this.domNode[0].clientWidth,
                height: $this.domNode[0].clientHeight
              };

              console.log('mousedown');
              console.log(offset);

              var targetPtr = $this.o.pointers[targetIdx];
              targetPtr._parent = { offset: offset, width: offset.width, height: offset.height};
              targetPtr._mousemove(event);
              //targetPtr.onmouseup();
              
              return false;
            });
          }
        }
      });

      this.o.value = angular.element(this.domNode.find("i")[2]);
      this.is.init = true;

      angular.forEach(this.o.pointers, function(pointer, key){
        $this.redraw(pointer);
      });

    };      

    Slider.prototype.nice = function( value ){
      return value;
    };

    Slider.prototype.onstatechange = function(){};

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
      angular.forEach(this.getPointers(), function(pointer, i) {
        pointer.index( i );
      });
    };

    Slider.prototype.getPointers = function(){
      return this.o.pointers;
    };

    Slider.prototype.onresize = function(){
      var self = this;

      this.sizes = {
        domWidth: this.domNode[0].clientWidth,
        domHeight: this.domNode[0].clientHeight,
        domOffset: {
          left: this.domNode[0].offsetLeft,
          top: this.domNode[0].offsetTop,
          width: this.domNode[0].clientWidth,
          height: this.domNode[0].clientHeight
        }
      };

      angular.forEach(this.o.pointers, function(ptr, key) {
        self.redraw(ptr);
      });
    };

    Slider.prototype.update = function(){
      this.onresize();
      this.drawScale();
    };

    Slider.prototype.drawScale = function(){
      this.domNode.find(sliderConstants.SLIDER.selector + "scale span ins").each(function(){
        $(this).css({ marginLeft: -$(this).outerWidth()/2 });
      });
    };

    Slider.prototype.redraw = function( pointer ){
      if( !this.is.init ) return false;

      this.setValue();

      // redraw range line      
      if(this.o.pointers[0] && this.o.pointers[1]) {
        var newPos = !this.settings.vertical ? 
          { left: this.o.pointers[0].value.prc + "%", width: ( this.o.pointers[1].value.prc - this.o.pointers[0].value.prc ) + "%" }
          :
          { top: this.o.pointers[0].value.prc + "%", height: ( this.o.pointers[1].value.prc - this.o.pointers[0].value.prc ) + "%" };
        
        this.o.value.css(newPos);
      }

      this.o.labels[pointer.uid].value.html(this.nice(pointer.value.origin));

      // redraw position of labels
      this.redrawLabels( pointer );
    };

    Slider.prototype.redrawLabels = function( pointer ) {

      function setPosition( label, sizes, prc ){
        sizes.margin = -sizes.label/2;
        var domSize = !self.settings.vertical ? self.sizes.domWidth : self.sizes.domHeight;

        // left limit
        var label_left = sizes.border + sizes.margin;
        if( label_left < 0 )
          sizes.margin -= label_left;

        // right limit
        if( sizes.border+sizes.label / 2 > domSize ){
          sizes.margin = 0;
          sizes.right = true;
        } else
        sizes.right = false;

        if (!self.settings.vertical)        
          label.o.css({ left: prc + "%", marginLeft: sizes.margin, right: "auto" });
        else
          label.o.css({ top: prc + "%", marginLeft: 20, bottom: "auto" });
        if( sizes.right ) label.o.css({ left: "auto", right: 0 });
        return sizes;
      }

      var self = this;
      var label = this.o.labels[pointer.uid];
      var prc = pointer.value.prc;

      var sizes = {
        label: label.o[0].offsetWidth,
        right: false,
        border: ( prc * domSize ) / 100
      };

      var another_label = null;
      var another = null;

      if (!this.settings.single){
        // glue if near;
        another = this.o.pointers[1-pointer.uid];
        another_label = this.o.labels[another.uid];

        switch( pointer.uid ){
          case 0:
          if( sizes.border+sizes.label / 2 > another_label.o[0].offsetLeft-this.sizes.domOffset.left ){
            another_label.o.css({ visibility: "hidden" });
            another_label.value.html( this.nice( another.value.origin ) );

            label.o.css({ visibility: "visible" });

            prc = ( another.value.prc - prc ) / 2 + prc;
            if( another.value.prc != pointer.value.prc ){
              label.value.html( this.nice(pointer.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(another.value.origin) );
              sizes.label = label.o[0].clientWidth;
              sizes.border = ( prc * domSize ) / 100;
            }
          } else {
            another_label.o.css({ visibility: "visible" });
          }
          break;
          case 1:
          if( sizes.border - sizes.label / 2 < another_label.o[0].offsetLeft - this.sizes.domOffset.left + another_label.o[0].clientWidth ){
            another_label.o.css({ visibility: "hidden" });
            another_label.value.html( this.nice(another.value.origin) );

            label.o.css({ visibility: "visible" });

            prc = ( prc - another.value.prc ) / 2 + another.value.prc;
            if( another.value.prc != pointer.value.prc ){
              label.value.html( this.nice(another.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(pointer.value.origin) );
              sizes.label = label.o[0].clientWidth;
              sizes.border = ( prc * domSize ) / 100;
            }
          } else {
            another_label.o.css({ visibility: "visible" });
          }
          break;
        }
      }

      sizes = setPosition( label, sizes, prc );

      var domSize = !self.settings.vertical ? self.sizes.domWidth : self.sizes.domHeight;

      /* draw second label */
      if( another_label ){
        sizes = {
          label: another_label.o[0].clientWidth,
          right: false,
          border: ( another.value.prc * this.sizes.domWidth ) / 100
        };
        sizes = setPosition( another_label, sizes, another.value.prc );
      }

      this.redrawLimits();
    };

    Slider.prototype.redrawLimits = function() {
      if( this.settings.limits ) {

        var limits = [ true, true ];

        for( var key in this.o.pointers ){

          if( !this.settings.single || key === 0 ){

            var pointer = this.o.pointers[key];
            var label = this.o.labels[pointer.uid];
            var label_left = label.o[0].offsetLeft - this.sizes.domOffset.left;

            var limit = this.o.limits[0];
            if( label_left < limit[0].clientWidth )
              limits[0] = false;

            limit = this.o.limits[1];
            if( label_left + label.o[0].clientWidth > this.sizes.domWidth - limit[0].clientWidth )
              limits[1] = false;
          }
        }

        for( var i=0; i < limits.length; i++ ){
          if( limits[i] ) // TODO animate
            angular.element(this.o.limits[i]).addClass("animate-show");          
          else
            angular.element(this.o.limits[i]).addClass("animate-hidde");          
        }
      }
    };

    Slider.prototype.setValue = function(){
      var value = this.getValue();
      this.inputNode.attr( "value", value );
      this.onstatechange.call( this, value, this.inputNode );
    };

    Slider.prototype.getValue = function(){
      if(!this.is.init) return false;
      var $this = this;

      var value = "";
      angular.forEach( this.o.pointers, function(pointer, key){
        if( pointer.value.prc !== undefined && !isNaN(pointer.value.prc) ) 
          value += (key > 0 ? ";" : "") + $this.prcToValue( pointer.value.prc );
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

    return Slider;

  }]);
}(angular));