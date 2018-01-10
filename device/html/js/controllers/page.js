'use strict';

angular.module('mean').controller('pageCtrl', ['message', '$scope','codebase', function (message, $scope, codebase) {
	//Scope Functions
	$scope.toggleCodebase = function(){
		codebase.toggle();
	};

	//Local Functions
	var init = function () {
		message.clear($scope);
	};

	//Destroy Scope
	$scope.$on('$destroy', function () {
	});

	//Local  Variables

	//Scope  Variables
	$scope.codebase = codebase.current;

	//Initialize Page
	init();
 }]);