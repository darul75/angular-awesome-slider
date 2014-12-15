(function(angular){
  'use strict';
  angular.module('ngSlider').constant('sliderConstants', {
    SLIDER: {
      settings: {
        from: 1,
        to: 40,
        step: 1,
        smooth: true,
        limits: true,
        value: "3",
        dimension: "",
        vertical: false
      },
      className: "jslider",
      selector: ".jslider-"
    },
    EVENTS: {
      
    }
  });

}(angular));