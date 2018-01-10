angular.module('mean').provider('sensorData',[function () {
	this.$get = ['$q', '$timeout','$resource', function ($q, $timeout, $resource) {
		var timeoutWait = 400;

		var stopeEngine = function () {
			var deferred = $q.defer();

			$timeout(function () {
				$resource('/stopengine').get(null,function(result){
																						deferred.resolve(result);
																					}, function(err){
																						deferred.reject(err);
																					});
			}, timeoutWait);

			return deferred.promise;
		};

		return {
			stopeEngine: stopeEngine
		}
	}];

	this.init = function () {

	};
}]);