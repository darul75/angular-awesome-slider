(function(angular){
  'use strict';
  angular.module('ngSlider').constant('sliderConstants', {
    SLIDER: {
      settings: {
        from: 1,
        to: 40,
        step: 1,
        smooth: true,
        limits: false,
        round: false,
        value: "3",
        dimension: "",
        vertical: false,
        calculate: false,
        onstatechange: false,
        callback: false
      },
      className: "jslider",
      selector: ".jslider-"
    },
    EVENTS: {
      
    }
  });

}(angular));