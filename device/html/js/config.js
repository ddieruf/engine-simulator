'use strict';
//Setting up route
angular.module('mean').config(['$stateProvider','$urlRouterProvider','$resourceProvider','routeHelpersProvider',function($stateProvider,$urlRouterProvider, $resourceProvider, routeHelpersProvider) {

    $urlRouterProvider.otherwise(function($injector, $location){
	    $injector.invoke(['$state', function($state) {
	        $state.go('partials.home');
	    }]);
    });

    $resourceProvider.stripTrailingSlashes = true;
    $resourceProvider.cancellable = true;//$cancelRequest()
    $resourceProvider.defaults.actions = {
      post: {method: 'POST'},
      get:    {method: 'GET'},
      list: {method: 'GET', isArray:true},
      update: {method: 'PUT'},
      delete: {method: 'DELETE'}
    };

    $stateProvider
	    .state('partials', {
				url: '/partials',
				controller : 'partialCtrl',
				templateUrl: 'views/partials/partial.html',
				resolve: routeHelpersProvider.resolveFor('inputmask', 'parsley', 'fa', 'modernizr','moment','loaders', 'toaster')
			})
			.state('partials.home',{
					url : '^/home',
					controller : 'homeCtrl',
					templateUrl: 'views/partials/home/home.html'
			})
			.state('partials.manage',{
					url : '^/manage',
					controller : 'manageCtrl',
					templateUrl: 'views/partials/manage/manage.html'
			})
			;
			/*.state('partials.404',{
					templateUrl: 'views/partials/404.html'
			});*/
}])

.config(['$locationProvider', '$provide', function ($locationProvider, $provide) {
	$locationProvider.html5Mode(false);

	$provide.decorator('$log', function ($delegate, logging) {
 		var ret = {
 			error: function () {
 				if (logging.enabled())
 					logging.error.apply(null, arguments)
 				else
 					$delegate.error.apply(null, arguments)
 			}
			, log: function () {
				if (logging.enabled()) {
					logging.log.apply(null, arguments)
				} else
					$delegate.log.apply(null, arguments)
			}
			, info: function () {
				if (logging.enabled()) {
					logging.info.apply(null, arguments)
				} else
					$delegate.info.apply(null, arguments)
			}
			, warn: function () {
				if (logging.enabled()) {
					logging.warn.apply(null, arguments)
				} else
					$delegate.warn.apply(null, arguments)
			}
 		}

 		return ret;
 	})
}])
.config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
	'use strict';

	// Lazy Load modules configuration
	$ocLazyLoadProvider.config({
		debug: false,
		events: true,
		modules: APP_REQUIRES.modules
	});

}])
.config(['$uibModalProvider', function ($uibModalProvider) {
	'use strict';

	$uibModalProvider.options = {
		animation: true,
		//appendTo: body
		backdrop: true,
		//backdropClass
		bindToController: false,
		//controller:
		//controllerAs:
		keyboard: true,
		//openedClass
		//templateUrl: 'myModalContent.html',
		template: '<div></div>',
		size: 'sm',
		//resolve: {}
		//scope: $scope
		//windowClass:
		//windowTemplateUrl:
		//windowTopClass:
	};

}])
;

function disableButton(jqObj, animation) {
	var btnHtml = jqObj.html();//the original html
	jqObj.addClass('disabled');
	jqObj.html((animation == null ? '<div class="ball-pulse-sync"><div></div><div></div><div></div></div>' : animation));

	return btnHtml;
};
function enableButton(jqObj, btnHtml) {
	jqObj.removeClass('disabled');
	jqObj.html(btnHtml);
	return;
}