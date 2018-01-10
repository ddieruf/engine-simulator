'use strict';
angular.module('mean', ['ngResource', 'ui.router', 'ui.bootstrap','oc.lazyLoad','ngDialog'])
.run(['$rootScope','$window','$stateParams',function($rootScope, $window, $stateParams){
	$rootScope.storage = $window.storage;
	$rootScope.stateParams = $stateParams;

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
		//event.preventDefault();
		//console.log(toState);
	});

	$rootScope.$on('$destroy', function () {

	});
}])
;