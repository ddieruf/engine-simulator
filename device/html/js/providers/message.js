angular.module('mean').provider('message',[ function () {
	this.$get = ['$q', '$timeout','$http', function ($q, $timeout, $http) {
		var addError = function (scope, err, message) {
			if (typeof (scope.alerts) == undefined || scope.alerts == null)
				scope.alerts = [];

			if (!message && !angular.isObject(err.data)) {
				scope.alerts.push({ type: 'danger', msg: err });
			} else {
				if(angular.isObject(err.data)){
					switch(err.data.type){
						case('SequelizeValidationError'):
							var msg = '';
							if(angular.isDefined(err.data.meta) && err.data.meta.length > 0){
								angular.forEach(err.data.meta,function(m){msg += m.message + ', '});
								scope.alerts.push({ type: 'danger', msg: msg + (message != null ? ', ' + message : '') });
							}else{
								$http.get('lib/messages.json').then(function(result){
									if(angular.isDefined(result.data[err.data.message])){
										scope.alerts.push({ type: 'danger', msg: result.data[err.data.message] });
									}else{
										scope.alerts.push({ type: 'danger', msg: err.data.message });
									}
								}, function(err){
									console.error(err);
								});
							}
							break;
						default:
							scope.alerts.push({ type: 'danger', msg: err.data.message + (message != null ? ', ' + message : '') });
							break;
					}

					return;
				}

				scope.alerts.push({ type: 'danger', msg: err + (message != null ? ', ' + message : '') });
			}
		};
		var addNotification = function (scope, message) {
			if (typeof (scope.alerts) == undefined || scope.alerts == null)
				scope.alerts = [];

			scope.alerts.push({ type: 'warning', msg: message });
		};
		var addSuccess=function (scope, message) {
			if (typeof (scope.alerts) == undefined || scope.alerts == null)
				scope.alerts = [];

			scope.alerts.push({ type: 'success', msg: message });
		};
		var clear= function (scope) {
			scope.alerts = [];
		};

		return {
			addError:addError,
			addNotification: addNotification,
			addSuccess: addSuccess,
			clear: clear
		}
	}];

	this.init = function () {

	};
}]);