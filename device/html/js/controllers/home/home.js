'use strict';

angular.module('mean').controller('homeCtrl',['message','$scope','sensorData', function(message, $scope, sensorData){
	//Scope Functions
	$scope.stopEngine = function(){
		var success = function(result){
			message.addSuccess($scope,'Engine stopped');
		};
		var error = function(err){
			message.addError($scope, err);
		};

		sensorData.stopEngine().then(sucess, error);
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
	$scope.text = '';

	//Initialize Page
	init();
}]);