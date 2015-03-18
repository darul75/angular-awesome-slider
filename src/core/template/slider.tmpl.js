(function(angular, undefined) {
'use strict';

  angular.module('ngSlider')
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('ng-slider/slider-bar.tmpl.html',
    '<span ng-class="mainSliderClass" id="{{sliderTmplId}}">' +
      '<table><tr><td>' +
        '<div class="jslider-bg" style="{{compileCss(options.styler(\'bg\', currentValue))}}">' +
          '<i class="l" style="{{compileCss(options.styler(\'l\', currentValue))}}"></i>'+
					'<i class="r" style="{{compileCss(options.styler(\'r\', currentValue))}}"></i>'+
					'<i class="v" style="{{compileCss(options.styler(\'v\', currentValue))}}"></i>'+
					'<i class="p" style="{{compileCss(options.styler(\'p\', currentValue))}}"></i>'+
					'<i class="s" style="{{compileCss(options.styler(\'s\', currentValue))}}"></i>'+
					'<i class="s" style="{{compileCss(options.styler(\'s\', currentValue))}}"></i>'+
					'<i class="f" style="{{compileCss(options.styler(\'f\', currentValue))}}"></i>' +
        '</div>' +
        '<div class="jslider-pointer" style="{{compileCss(options.styler(\'pointer\', currentValue))}}"></div>' +
        '<div class="jslider-pointer jslider-pointer-to" style="{{compileCss(options.styler(\'pointer-to\', currentValue))}}"></div>' +
        '<div class="jslider-label" style="{{compileCss(options.styler(\'label\', currentValue))}}"><span>{{from}}</span>{{options.dimension}}</div>' +
        '<div class="jslider-label jslider-label-to" style="{{compileCss(options.styler(\'label-to\', currentValue))}}"><span>{{to}}</span>{{options.dimension}}</div>' +
        '<div class="jslider-value" style="{{compileCss(options.styler(\'value\', currentValue))}}"><span></span>{{options.dimension}}</div>' +
        '<div class="jslider-value jslider-value-to" style="{{compileCss(options.styler(\'value-to\', currentValue))}}"><span></span>{{options.dimension}}</div>' +
        '<div class="jslider-scale" style="{{compileCss(options.styler(\'scale\', currentValue))}}" id="{{sliderScaleDivTmplId}}"></div>' +
      '</td></tr></table>' +
    '</span>');
  }]);

})(window.angular);
