angular.module('mean').filter('countSensorFilter', function () {
	return function (memberSensors) {
		var ret = [];
		
		angular.forEach(memberSensors, function(parentSensor){//physical
			if(parentSensor.physicalAddress === null){
				return;
			}
			
			if(parentSensor.showCount === 1){
				ret.push(parentSensor);
			}
			
			angular.forEach(parentSensor.children, function(happenSensor){//happening
				if(happenSensor.parentLocalId === null){
					return;//don't use sensors that haven't gotten a physical parent
				}
				
				if(happenSensor.showCount === 1){
					ret.push(happenSensor);
				}
				
				angular.forEach(happenSensor.children, function(childChildSensor){//child
					if(childChildSensor.showCount === 1 && childChildSensor.parentLocalId !== null){
						ret.push(childChildSensor);
					}
				});
			});
		});
		
		return ret;
		//return $filter('filter')(memberSensors,{parentLocalSensorId: null});
	};
});