(function (angular) {
  'use strict'; 

  angular.module('ngSlider', ['ngSanitize'])          
    // DIRECTIVE
    .directive('slider', [
      '$compile', '$templateCache','$timeout', '$window', 'slider',
      function(compile, templateCache, timeout, win, Slider) {
        return {
          restrict : 'AE',
          require: '?ngModel',
          scope: {options:'='},
          priority: 1,
          link : function(scope, element, attrs, ngModel) {
            if(!ngModel) return;

          // TODO : skin        
          scope.mainSliderClass = 'jslider';
          scope.mainSliderClass += ' jslider_round';
          scope.mainSliderClass += scope.options.vertical ? ' vertical ' : '';          

          // compile template
          element.after(compile(templateCache.get('ng-slider/slider-bar.tmpl.html'))(scope, function(clonedElement, scope) {          
            scope.tmplElt = clonedElement;
          }));        

          // model -> view
          ngModel.$render = function () {
            //elm.html(ctrl.$viewValue);
            var singleValue = false;

            if (!ngModel.$viewValue && ngModel.$viewValue !== 0) {
              return;
            }

            if (typeof(ngModel.$viewValue) === 'number') {
              ngModel.$viewValue = ''+ngModel.$viewValue;
            }

            if( !ngModel.$viewValue.split(";")[1]) {
              scope.mainSliderClass += ' jslider-single';
            }

            if (scope.slider) {
              scope.slider.getPointers()[0].set(ngModel.$viewValue.split(";")[0], true);
              if (ngModel.$viewValue.split(";")[1]) {
                scope.slider.getPointers()[1].set(ngModel.$viewValue.split(";")[1], true);
              }
            }
          };

          // INIT
          var init = function() {
            scope.from = ''+scope.options.from;
            scope.to = ''+scope.options.to;
            if (scope.options.calculate && typeof scope.options.calculate === 'function') {
              scope.from = scope.options.calculate(scope.from);
              scope.to = scope.options.calculate(scope.to);
            }

            var OPTIONS = {
              from: scope.options.from,
              to: scope.options.to,
              step: scope.options.step,
              smooth: scope.options.smooth,
              limits: true,
              round: scope.options.round || false,
              value: ngModel.$viewValue,
              dimension: "",
              scale: scope.options.scale,
              vertical: scope.options.vertical,
              callback: forceApply
            };
            
            OPTIONS.calculate = scope.options.calculate || undefined;
            OPTIONS.onstatechange = scope.options.onstatechange || undefined;
            
            timeout(function() {
              var scaleDiv = scope.tmplElt.find('div')[7];
              scope.slider = angular.element.slider(element, scope.tmplElt, OPTIONS);
              angular.element(scaleDiv).html(scope.generateScale());
              scope.drawScale(scaleDiv);

              initListener();
            });           
          };

          function initListener() {
            // window resize listener
            angular.element(win).bind('resize', function(event) {
              scope.slider.onresize();
            });
          }

          // UTILS

          // TODO: move these 2 next function in slider...        
          scope.generateScale = function(){
            if( scope.options.scale && scope.options.scale.length > 0 ){
              var str = "";
              var s = scope.options.scale;

              // FIX Big Scale Failure #34
              // var prc = Math.round((100/(s.length-1))*10)/10;
              var prc = (100/(s.length-1)).toFixed(2);

              var position = scope.options.vertical ? 'top' : 'left';

              for( var i=0; i < s.length; i++ ){
                str += '<span style="'+ position + ': ' + i*prc + '%">' + ( s[i] != '|' ? '<ins>' + s[i] + '</ins>' : '' ) + '</span>';
              }
              return str;
            } else return "";

            return "";
          };

          scope.drawScale = function(scaleDiv){
            angular.forEach(angular.element(scaleDiv).find('ins'), function(scaleLabel, key) {
              scaleLabel.style.marginLeft = - scaleLabel.clientWidth / 2;
            });
          };

          // view -> model
          var forceApply = function(value) {
            scope.$apply(function() {
              ngModel.$setViewValue(value);
            });
            if (scope.options.callback)
              scope.options.callback(value);
          };

          // WATCH OPTIONS CHANGES
          scope.$watch('options', function(value) {
            init();
          });

          angular.element.slider = function( inputElement, element, settings) {
            if(!element.data('jslider'))
              element.data('jslider', new Slider( inputElement, element, settings ));
            return element.data('jslider');
          };
        }
      };
    }])
.config(function() {})
.run(function() {});
})(angular);

