(function(angular){
  'use strict';

  angular.module('ngSlider').factory('sliderUtils', ['$window', function(win) {
    return {
      offset: function(elm) { 
        // try {return elm.offset();} catch(e) {} 
        var rawDom = elm[0]; 
        var _x = 0; 
        var _y = 0; 
        var body = document.documentElement || document.body; 
        var scrollX = window.pageXOffset || body.scrollLeft; 
        var scrollY = window.pageYOffset || body.scrollTop; 
        _x = rawDom.getBoundingClientRect().left + scrollX; 
        _y = rawDom.getBoundingClientRect().top + scrollY; 
        return { left: _x, top:_y };
      },
      browser: function() {
        // TODO finish browser detection and this case
        var userAgent = win.navigator.userAgent;        
        var browsers = {mozilla: /mozilla/i, chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
        for(var key in browsers) {
          if (browsers[key].test(userAgent)) {
            return key;
          }
        }
        return 'unknown';
      },
			css: function (element, css, stylerStyles) {
				//applies css to an element, merging the styles from the styler function if applicable
				var finalStyles, initStyles;
	
				stylerStyles = angular.isObject(stylerStyles) ? stylerStyles : {};
				css = angular.isObject(css) ? css : {};

				if (stylerStyles.override === true) {
					finalStyles = css;
					initStyles = stylerStyles;
				}
				else {
					finalStyles = stylerStyles;
					initStyles = css;
				}
				for (var style in initStyles) {
					finalStyles[style] = initStyles[style];
				}
				return element.css(finalStyles);
			},
			compileCss: function (css) {
				var finalString = '';
				css = angular.isObject(css) ? css : {};
				for (var style in css) {
					finalString += style + ':' + css[style] + '; ';
				}
				return finalString;
			}
    };
  }]);  
})(angular);

    

