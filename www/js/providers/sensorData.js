angular.module('mean').provider('sensorData',[function () {
	this.$get = ['$q', '$timeout','$resource','ApiUrl', function ($q, $timeout, $resource, ApiUrl) {
		var timeoutWait = 200;

		var listLastN = function(vin, startRow, numRows){
			var deferred = $q.defer();

			$timeout(function () {
					$resource(ApiUrl + 'sensordata/listlastn/'+vin+'/'+startRow+'/' + numRows).list(null,function(result){
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
				$resource(ApiUrl + 'sensordata/all').list(null,function(result){
																						deferred.resolve(result);
																					}, function(err){
																						deferred.reject(err);
																					});
			}, timeoutWait);
			return deferred.promise;
		};

		return {
			listLastN: listLastN,
			list: list
		}
	}];

	this.init = function () {

	};
}]);