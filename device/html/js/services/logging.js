angular.module('mean').service('logging', ['$injector', function ($injector) {
	var service = {
		error:
			function () {
				self.type = 'error';
				log.apply(self, arguments);

				try {
					var $http = $injector.get('$http');
					var $state = $injector.get('$state');
					var $rootScope = $injector.get('$rootScope');

					var desc = 'Name: ' + $state.current.name
											+ '\nTitle: ' + $state.current.title
											+ '\nTemplate: ' + $state.current.templateUrl
											+ '\nData: ' + angular.toJson($state.current.data)
											+ '\nStack:' + arguments[0].stack;

					console.error(arguments[0] + '\n' + desc);
					/*$http.post(ApiUri + 'ticketing/' + (AppId == 1 ? '2' : '1') + '/issue/bug?category=' + $state.current.title, {
						Subject: 'Uncaught site exception, ' + arguments[0],
						Description: desc,
						Version: $rootScope.app.version,
						MerchantId: ($rootScope.app.merchant && $rootScope.app.merchant.MerchantId ? $rootScope.app.merchant.MerchantId : null),
						MemberId: ($rootScope.currentUser && $rootScope.currentUser.MemberId ? $rootScope.currentUser.MemberId : null)
					});*/
				} catch (e) {
					console.error('Error logging ' + e);
				}
			}
		, warn:
				function () {
					self.type = 'warn';
					log.apply(self, arguments);
					console.warn(arguments[0]);
				}
		, info:
				function () {
					self.type = 'info';
					log.apply(self, arguments);
					console.info(arguments[0]);
				}
		, log:
				function () {
					self.type = 'log';
					log.apply(self, arguments);
					console.log(arguments[0]);
				}
		, enabled: function () {
			return true;
		}
		//, logs: []
	}

	var log = function () {
		args = [];

		angular.forEach(arguments, function (val, key) {
			if (typeof val === 'object') {
				val = '' + val;
			}
			args.push(val);
		});

		var dd = new Date();
		var hh = dd.getHours();
		var mm = dd.getMinutes();
		var ss = dd.getSeconds();
		var ms = dd.getMilliseconds();
		var logItem = { time: hh + ":" + mm + ":" + ss + ":" + ms, message: angular.toJson(args), type: type };

		//service.logs.push(logItem);
		//logInfo(logItem.type + ' -- ' + logItem.message);
	}

	return service;

}])