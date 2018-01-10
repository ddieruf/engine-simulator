angular.module('mean').directive('validateForm', function () {
	return {
		restrict: 'A',
		require: '?form',
		controller: ["$scope", "$element", function ($scope, $element) {
			var $elem = $($element);
			if ($.fn.parsley)
				$elem.parsley();
		}]
	};
})