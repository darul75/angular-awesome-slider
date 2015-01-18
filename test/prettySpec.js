describe('ngSlider', function () {
  var testDirective,
  noop = angular.noop,
  scope,
  fixture = function fixture($compile, $rootScope) {
    scope = $rootScope.$new();
    scope.options = options;    
    scope.value = 50;

    /**
     * Compiles markup and compares resulting output to expected.s
     * @param {string} markup Markup to compile     
     */
    return function tester(markup) {
      var element = $compile(markup)(scope);
      scope.$apply();
      
      angular.element(document.body).append(element.next());
      expect(0).toBe(0);        
      return element;
    };
  },

  obj;

  beforeEach(module('ngSlider'));

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
    it('simple', function () {
      testDirective('<input ng-model="value" type="text" id="mySlider1" slider options="options" />');
    });

        // it('creates an instance with default values', function () {
        //     testDirective('<pre json="json" pretty-json></pre>', 24);
        // });

        // it('uses prettyJson attribute', function () {
        //     testDirective('<pre pretty-json="json"></pre>', 24);
        // });

        // it('creates an instance with default values w/o presence of "json" key in obj', function () {
        //     testDirective('<pre pretty-json="obj"></pre>', 24);
        // });

        // it('creates an instance with default values, using element syntax', function () {
        //     testDirective('<pretty-json json="json"></pretty-json>', 24);
        // });

        // it('ignores updates to the root object if it has a json property', function () {
        //     var element = testDirective('<pre pretty-json="json"></pre>', 24);
        //     scope.$apply("json.f = 'bar'");
        //     expect(element.find('pre').children('span').length).toBe(24);
        // });

        // it('zaps markup if empty', function () {
        //     var element = testDirective('<pre pretty-json="json"></pre>', 24);
        //     delete scope.json.json;
        //     scope.$apply();
        //     expect(element.find('pre').children('span').length).toBe(0);
        // });
    });

// describe('makeEntities function', function () {
//   it('makes entities', inject(function (ngPrettyJsonFunctions) {
//     var foo = '<g>&</g>';
//     expect(foo.replace(ngPrettyJsonFunctions.rx.entities,
//       ngPrettyJsonFunctions.makeEntities)).toBe('&lt;g&gt;&amp;&lt;/g&gt;');
//   }));
// });

// describe('markup function', function () {
//   it('marks up properly', inject(function (ngPrettyJsonFunctions) {
//     var foo = JSON.stringify(obj);
//     expect(foo.replace(ngPrettyJsonFunctions.rx.json, ngPrettyJsonFunctions.markup)).toBe('{<span class="key">"a":</span><span class="number">1</span>,<span class="key">"b":</span><span class="string">"foo"</span>,<span class="key">"c":</span>[<span class="null">null</span>,<span class="boolean">false</span>,<span class="null">null</span>,{<span class="key">"d":</span>{<span class="key">"e":</span><span class="number">130000</span>}}]}');
//   }));
// });

});
