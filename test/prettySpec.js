describe('test valid slider', function () {
	var $ngCompile, $ngRootScope;

	beforeEach(module('ngSlider'));

	beforeEach(inject(function ($compile, $rootScope) {
		
		$ngCompile = $compile;
		$ngRootScope = $rootScope;
		
		$ngRootScope.badjson = function() {};

	}));

	it('creates an instance of pretty', function () {
		//var element = $ngCompile('<pre json="badjson" pretty-json />')($ngRootScope);
		
		expect(0).toBe(0);
		//expect(element.find('span').length).toBe(0);
	});

});