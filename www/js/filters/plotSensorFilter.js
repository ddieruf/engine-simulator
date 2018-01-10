angular.module('mean').filter('plotSensorFilter',['$filter', function ( $filter) {
	return function (memberSensors) {
		var ret = [];
		
		angular.forEach(memberSensors, function(parentSensor){//physical
			if(parentSensor.physicalAddress === null){
				return;
			}
			
			if(parentSensor.plotData === 1){
				ret.push(parentSensor);
			}
			
			angular.forEach(parentSensor.children, function(happenSensor){//happening
				if(happenSensor.parentLocalId === null){
					return;//don't use sensors that haven't gotten a physical parent
				}
				
				if(happenSensor.plotData === 1){
					ret.push(happenSensor);
				}
				
				angular.forEach(happenSensor.children, function(childChildSensor){//happening
					if(childChildSensor.plotData === 1 && childChildSensor.parentLocalId !== null){
						ret.push(childChildSensor);
					}
				});
			});
		});
		
		return ret;
	};
}]);