'use strict';

angular.module('mean').controller('partialCtrl', ['message','$scope',function(message, $scope) {
	//Scope Functions

	//Local Functions
	var init = function () {
		message.clear($scope);
	};

	//Destroy Scope
	$scope.$on('$destroy', function () {
	});

	//Local  Variables

	//Scope  Variables

	//Initialize Page
	init();
}]);