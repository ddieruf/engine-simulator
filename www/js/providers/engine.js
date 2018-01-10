angular.module('mean').provider('engine',[function () {
	this.$get = ['$q', '$timeout','$resource','ApiUrl', function ($q, $timeout, $resource, ApiUrl) {
		var timeoutWait = 400;

		var get = function (vin) {
			var deferred = $q.defer();

			$timeout(function () {
				$resource(ApiUrl + 'engine/' + vin).get(null,function(result){
																						deferred.resolve(result);
																					}, function(err){
																						deferred.reject(err);
																					});
			}, timeoutWait);

			return deferred.promise;
		};
		var list = function(){
			var deferred = $q.defer();

			$timeout(function () {
				$resource(ApiUrl + 'engine/all').list(null,function(result){
																						deferred.resolve(result);
																					}, function(err){
																						deferred.reject(err);
																					});
			}, timeoutWait);
			return deferred.promise;
		};

		var remove = function(vin){
			var deferred = $q.defer();

			$timeout(function () {
				$resource(ApiUrl + 'engine/' + vin).delete(null,function(result){
																						deferred.resolve(result);
																					}, function(err){
																						deferred.reject(err);
																					});
			}, timeoutWait);
			return deferred.promise;
		};

		return {
			list: list,
			get: get,
			remove: remove
		}
	}];

	this.init = function () {

	};
}]);