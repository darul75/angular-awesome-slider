(function(angular, undefined) {
'use strict';

  angular.module('ngSlider')
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('ng-slider/slider-bar.tmpl.html',
    '<span ng-class="mainSliderClass" id="{{sliderTmplId}}">' +
      '<table><tr><td>' +
        '<div class="jslider-bg" style="{{options.styler(\'bg\', currentValue)}}">' +
          '<i class="l" style="{{options.styler(\'l\', currentValue)}}"></i>'+
					'<i class="r" style="{{options.styler(\'r\', currentValue)}}"></i>'+
					'<i class="v" style="{{options.styler(\'v\', currentValue)}}"></i>'+
					'<i class="p" style="{{options.styler(\'p\', currentValue)}}"></i>'+
					'<i class="s" style="{{options.styler(\'s\', currentValue)}}"></i>'+
					'<i class="s" style="{{options.styler(\'s\', currentValue)}}"></i>'+
					'<i class="f" style="{{options.styler(\'f\', currentValue)}}"></i>' +
        '</div>' +
        '<div class="jslider-pointer" style="{{options.styler(\'pointer\', currentValue)}}"></div>' +
        '<div class="jslider-pointer jslider-pointer-to" style="{{options.styler(\'pointer-to\', currentValue)}}"></div>' +
        '<div class="jslider-label" style="{{options.styler(\'label\', currentValue)}}"><span>{{from}}</span>{{options.dimension}}</div>' +
        '<div class="jslider-label jslider-label-to" style="{{options.styler(\'label-to\', currentValue)}}"><span>{{to}}</span>{{options.dimension}}</div>' +
        '<div class="jslider-value" style="{{options.styler(\'value\', currentValue)}}"><span></span>{{options.dimension}}</div>' +
        '<div class="jslider-value jslider-value-to" style="{{options.styler(\'value-to\', currentValue)}}"><span></span>{{options.dimension}}</div>' +
        '<div class="jslider-scale" style="{{options.styler(\'scale\', currentValue)}}" id="{{sliderScaleDivTmplId}}"></div>' +
      '</td></tr></table>' +
    '</span>');
  }]);

})(window.angular);
