describe('ngSlider', function () {
  var testDirective,
  noop = angular.noop,
  scope,
  fixture = function fixture($compile, $rootScope, $timeout) {
    scope = $rootScope.$new();
    scope.options = options;    
    scope.value = 40;
    scope.value2 = 10;
    scope.value3 = 90;
  

    /**
     * Compiles markup and compares resulting output to expected.s
     * @param {string} markup Markup to compile     
     * @param {value} slider value to compare with position generated
     */
    return function tester(markup, value) {

      var element = $compile(markup)(scope);
      scope.$digest();

      $timeout.flush(2000);
          
      var sliderDom = element.next();    
      angular.element(document.body).append(sliderDom);

      // fetch first pointer
      var prcPosition = angular.element(sliderDom.find("div")[1]).css("left").replace("%", "");

      // force re-rendering
      angular.element(window).triggerHandler("resize");

      expect(prcPosition).toBeLessThan(value+1);        
      expect(prcPosition).toBeGreaterThan(value-1);

      return element;
    };
  },

  obj;

  beforeEach(module('angularAwesomeSlider'));

  beforeEach(inject(function ($injector) {      
    options = {       
      from: 1,
      to: 100,
      step: 1,
      dimension: " km",
      css: {
        background: {"background-color": "silver"},
        before: {"background-color": "purple"},
        default: {"background-color": "white"},
        after: {"background-color": "green"},
        pointer: {"background-color": "red"}          
      }        
    };
    testDirective = $injector.invoke(fixture);
  }));

  describe('slider directive', function () {
    it('horizontal ', function () {
      testDirective('<input ng-model="value" type="text" id="mySlider1" slider options="options" />', scope.value);
    });

    it('simple', function () {
      testDirective('<input ng-model="value2" type="text" id="mySlider2" slider options="options" />', scope.value2);
    });

    it('simple', function () {
      testDirective('<input ng-model="value3" type="text" id="mySlider3" slider options="options" />', scope.value3);
    });    
  });

});
