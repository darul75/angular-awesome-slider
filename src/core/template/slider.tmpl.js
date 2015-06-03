(function(angular, undefined) {
'use strict';

  angular.module('ngSlider')
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('ng-slider/slider-bar.tmpl.html',
    '<span ng-class="mainSliderClass" id="{{sliderTmplId}}">' +
      '<table><tr><td>' +
        '<div class="jslider-bg" ng-attr-style="{{compileCss(options.styler(\'bg\', currentValue))}}">' +
          '<i class="l" ng-attr-style="{{compileCss(options.styler(\'l\', currentValue))}}"></i>'+
					'<i class="r" ng-attr-style="{{compileCss(options.styler(\'r\', currentValue))}}"></i>'+
					'<i class="v" ng-attr-style="{{compileCss(options.styler(\'v\', currentValue))}}"></i>'+
					'<i class="p" ng-attr-style="{{compileCss(options.styler(\'p\', currentValue))}}"></i>'+
					'<i class="s" ng-attr-style="{{compileCss(options.styler(\'s\', currentValue))}}"></i>'+
					'<i class="s" ng-attr-style="{{compileCss(options.styler(\'s\', currentValue))}}"></i>'+
					'<i class="f" ng-attr-style="{{compileCss(options.styler(\'f\', currentValue))}}"></i>' +
        '</div>' +
        '<div class="jslider-pointer" ng-attr-style="{{compileCss(options.styler(\'pointer\', currentValue))}}"></div>' +
        '<div class="jslider-pointer jslider-pointer-to" ng-attr-style="{{compileCss(options.styler(\'pointer-to\', currentValue))}}"></div>' +
        '<div class="jslider-label" ng-attr-style="{{compileCss(options.styler(\'label\', currentValue))}}"><span>{{from}}</span>{{options.dimension}}</div>' +
        '<div class="jslider-label jslider-label-to" ng-attr-style="{{compileCss(options.styler(\'label-to\', currentValue))}}"><span>{{to}}</span>{{options.dimension}}</div>' +
        '<div class="jslider-value" ng-attr-style="{{compileCss(options.styler(\'value\', currentValue))}}"><span></span>{{options.dimension}}</div>' +
        '<div class="jslider-value jslider-value-to" ng-attr-style="{{compileCss(options.styler(\'value-to\', currentValue))}}"><span></span>{{options.dimension}}</div>' +
        '<div class="jslider-scale" ng-attr-style="{{compileCss(options.styler(\'scale\', currentValue))}}" id="{{sliderScaleDivTmplId}}"></div>' +
      '</td></tr></table>' +
    '</span>');
  }]);

})(window.angular);
