'use strict';

angular.module('mean')
.controller('homeCtrl', ['$scope', 'message', '$filter', '$timeout','$interval','sensorData','modal','engine',
function ($scope, message, $filter, $timeout, $interval, sensorData, modal, engine) {
	'use strict';

	//Scope Functions
	$scope.addEngine = function(e){
		/*modal.open(null, templateUrl, controller, size, paramObj, function(ret){
			engineList.push({vin:'1234'});
		});*/

		e.preventDefault();
		return;
	};
	$scope.listEngines = function(){
		return engineList;
	};
	$scope.viewEngine = function(engine){
		logInfo('start');
		
		initEngine(engine);
		loadSensors(engine);
		startSensors();
		startCoach();

		return;
	};
	$scope.clearEngineView = function(){
		stopSensors();
		startRow = 1;
		numRows = 5;
		vin=null;
		$scope.alarmList = [];
	};
	$scope.removeEngine = function(eng){
		if(!confirm('Sure you want to remove?'))
			return;
		
		logInfo('stop');
		stopSensors();
		alarmList = [];

		angular.forEach(engineList, function(engine, idx){
			if(engine.vin === eng.vin)
				engineList.splice(idx, 1);
		});

		return;
	};
	$scope.activeVin = function(){
		return vin;
	};
	$scope.average = function(col){
		if(col == null || col.length < 20)
			return 0;

		var tot = 0;
		for ( var i = 0; i < 20; i++ ) {
        tot += parseFloat(col[i])
    }
		return (tot/col.length);
	}

	//Local Functions
	var init = function () {
		message.clear($scope);

		$('#flot-container').css('width', (parseInt($(document).width())-50) + 'px');

		$scope.memberSettings = {
							memberId: 1,
							firstName: 'First',
							lastName: 'Last',
							email: 'no@email.com',
							timeZone: 'EST"',
							units: 'standard',
							heightCentimeters: 100,
							weightKilograms: 100,
							gender: 'male',
							lastLoginDate:  null,
							birthDate: null,
							memberTypeId: 1,
							storageSpaceMb: 1000,
							apiKey: '1234',
							leftHandJab: true
					};
		$scope.memberSettings.age = 40;
		$scope.memberSettings.maxHeartRate = (220-$scope.memberSettings.age )

		initChart(plotContainer, [],null);
		
		checkForEngines();
		startEnginPolling();

		return;
	};
	var initEngine = function(engine){
		stopSensors();
		startRow = 1;
		numRows = 5;
		vin=engine.vin;
		$scope.alarmList = [];
		initChart(plotContainer, [],null);
	};
	var initChart = function (placeHolder, series, colors) {
		placeHolder.css('width', placeHolder.parent().width() + 'px');
		placeHolder.css('height', placeHolder.parent().height() + 'px');

		var options = {
			grid: {
				borderWidth: {
					top:0,
					right:0,
					bottom:1,
					left:0
				},
				minBorderMargin: 0,
				//labelMargin: 0,
				//axisMargin: 0,
				//margin: 0,
				backgroundColor: 'white',
				/*markings: [
					{ yaxis: { from: heartRateZones.one.min, to: heartRateZones.two.min },
						color: heartRateZones.one.minColor },
					{ yaxis: { from: heartRateZones.two.min, to: heartRateZones.three.min },
						color: heartRateZones.two.minColor },
					{ yaxis: { from: heartRateZones.three.min, to: heartRateZones.three.max },
						color: heartRateZones.three.minColor },

					{ yaxis: { from: heartRateZones.one.min, to: heartRateZones.one.min },
						color: heartRateZones.one.maxColor },
					{ yaxis: { from: heartRateZones.two.min, to: heartRateZones.two.min },
						color: heartRateZones.two.maxColor },
					{ yaxis: { from: heartRateZones.two.max, to: heartRateZones.two.max },
						color: heartRateZones.two.maxColor },
					{ yaxis: { from: heartRateZones.three.max, to: heartRateZones.three.max },
						color: heartRateZones.three.maxColor }
				]*/
			},
			xaxis: {
				tickFormatter: function (val, axis) {
					if(val < 0){
						return '';
					}else if(val === 0){
						return 'GO!'
					}

					var d = moment.duration((val*100),'ms');

					/*if(d.minutes() < 1){
						return d.seconds() + ' second' + (d.seconds() > 1 ? 's' : '');
					}else if(d.hours() < 1){
						return d.minutes() + ' minute' + (d.minutes() > 1 ? 's' : '');
					}else if(d.days() < 1){
						return d.hours() + ' hour' + (d.hours() > 1 ? 's' : '') + ' ' + d.minutes() + ' minute' + (d.minutes() > 1 ? 's' : '');
					};*/
					return d.hours() + ':' + d.minutes() + ':' + d.seconds() ;
					//return "too long";
				},
				show: true
			},
			yaxis: {//defaults
				//min: 0,//heartRateZones.zero.min,
				//max: 200,//(heartRateZones.three.max+10),//a little padding,
				show: true,
				position: 'left',
				/*ticks: [
					[
						((heartRateZones.one.min+heartRateZones.one.max)/2),
						'Low'
					],
					[
						((heartRateZones.two.min+heartRateZones.two.max)/2),
						''
					],
					[
						((heartRateZones.three.min+heartRateZones.three.max)/2),
						'High'
					]
				],
				tickLength: 0,
				tickColor: '#e8e8e8',*/
				//font:{size:8, lineHeight: 18}
			},
			//yaxes: [],
			legend: {
				show: true,
				position: "nw"
			}
		};

		/*angular.forEach(series, function(serie){
			var max = 100, min = 0;

			switch(serie.dataTypeId){
				case(DATA_TYPES.count):
					max = 200;
					break;
				case(DATA_TYPES.load):
					max = 120;
					break;
				case(DATA_TYPES.speed):
					max = 5;
					break;
				case(DATA_TYPES.raw)://heartrate
					max = maxHR;
					break;
			}

			options.yaxes.push({
				min: min,
				max: max
			});
		});*/

		if (colors != null && colors.length > 0)
			options.colors = colors;

		//logInfo('initChart options', options);
		plot = $.plot(placeHolder, series, options);

		return;
	};
	var loadSensors = function (engine) {
		logInfo('loadSensors');
		$scope.memberSensors = {};
		$scope.countSensors = [];

		angular.forEach(engine.sensors.split(','),function(sensorName, idx){
			var dataType = 3;//count data

			if(sensorName.indexOf('Engine RPM') > -1)
				dataType = 1;//plot data

			if(sensorName.indexOf('GPS') > -1)
				dataType = 2;

			var sensor = {
				sensorLocalId: idx,
				displayName: sensorName,
				unitsLabel: null,
				lineStyle: {show:true, lineWidth:1, fill:false},
				dataTypeId: dataType,
				color: colors[idx],
				vin: engine.vin
			};

			$scope.memberSensors[sensor.sensorLocalId] = sensor;
			$scope.memberSensors[sensor.sensorLocalId].raw = [];
			$scope.memberSensors[sensor.sensorLocalId].children = {};

			if(sensor.dataTypeId === 3)
				$scope.countSensors.push(sensor);
		});

		//logInfo('sensors',$scope.memberSensors);

		//re-init plot
		//try {
			logInfo('re-initChart');

			var ht = $('#workout').height();

			if(ht > 0 )
				$('#flot-container').css('height',ht + 'px');

			initChart(plotContainer, getPlotSeries(), plotColors);
		//} catch (ex) {
		//	logError('Error init plot', ex);
		//	return;//don't let the start button enable
		//}

		$scope.startEnabled = true;
		logInfo('start enabled');

		return;
	};
	var startSensors = function () {
		//var physicalSensors = $filter('physicalSensorFilter')($scope.memberSensors);
		//logInfo('physicalSensorFilter', physicalSensors);

		//var initErrCount = 0;
		/*angular.forEach(physicalSensors, function(physicalSensor){
			physicalSensor.status = 'attempting';
			try{
				//execute the sensors' dataJs to subscribe
				var a = physicalSensor.dataJs + '(\''+physicalSensor.physicalAddress+'\','+gloveLogRate+', '+gloveGravityRange+')';
				logInfo(a);
				eval(a).then(function(){
					physicalSensor.status = 'error';
					physicalSensor.error = 'Could not hold connection. Make sure the device is charged, powered on, and staying on.';
					logError('Could not subscribe to sensorLocalId ' + physicalSensor.sensorLocalId);
					initErrCount++;
				},function(err){
					physicalSensor.status = 'error';
					physicalSensor.error = 'Could not connect. Make sure the device is charged and powered on.';
					logError('Error subscribing to sensorLocalId ' + physicalSensor.sensorLocalId, err);
					initErrCount++;
				}, function(dataVal){
					if($scope.pauseEnabled === true){
						return;
					}

					physicalSensor.status = 'success';
					//save data to db.sensorData
					FightAppData.sensorData.insert(physicalSensor.sensorLocalId, physicalSensor.sensorId, dataVal).then(function(){
						//broadcast receipt of data
						//$scope.$broadcast(DATA_RECEIVED, physicalSensor);
						evaluateData(physicalSensor);
					}, function(err){
						//error logging data
						logError('Error saving data for sensorLocalId ' + physicalSensor.sensorLocalId, err);
					});
				});
			}catch(ex){
				physicalSensor.status = 'error';
				physicalSensor.error = 'An error occurred starting the sensor. Try removing the sensor and adding again.';
				logError('Error trying to subscribe sensorLocalId ' + physicalSensor.sensorLocalId, ex);
				initErrCount++;
			}
		});*/
		
		startPlotting();
		//startCoach();
		$scope.startEnabled = false;
		return;
	};
	var stopSensors = function () {
		if(angular.isDefined(plotInterval)){
			$interval.cancel(plotInterval);
			plotInterval = undefined;
		}

		if(angular.isDefined(coachInterval)){
			$interval.cancel(coachInterval);
			coachInterval = undefined;
		}
		
		if(angular.isDefined(enginPollingInterval)){
			$interval.cancel(enginPollingInterval);
			enginPollingInterval = undefined;
		}

		return;
	};
	var pauseLogging = function(){
		if($scope.pauseEnabled === true){
			$scope.pauseEnabled = false;
			return;
		}

		$scope.pauseEnabled = true;

		/*if(angular.isDefined(plotInterval)){
			$interval.cancel(plotInterval);
			plotInterval = undefined;
		}*/

		//rePlotData(0);
	};
	var getPlotSeries = function() {
		var plotSensors = [];
		var i = getPlotWidth();
		var data = [];
		while (data.length < getPlotWidth()) {
			data.push([i*-1,-1]);
			i--;
		}

		angular.forEach($scope.memberSensors, function (sensor,key) {
			if(sensor.dataTypeId != 1)
				return;

			var plotSensor = {
					label: sensor.displayName,
					data: data,
					lines: sensor.lineStyle,
					sensorLocalId: sensor.sensorLocalId,
					yaxis: (key+1),
					dataTypeId: sensor.dataTypeId,
					color: sensor.color,
					vin: sensor.vin,
					sensorName: sensor.displayName
				};
				
			plotColors.push(sensor.color);
			plotSensors.push(plotSensor);

			//logInfo('plotLength', plotSensor.data.length);
		});

		if(plotSensors.length === 0){
			plotSensors.push({
					label: '',
					data: data
				});
		}

		return plotSensors;
	};
	var getPlotWidth = function () {
		// Determine how many data points to keep based on the placeholder's initial size;
		// this gives us a nice high-res plot while avoiding more than one point per pixel.
		return (plotContainer.outerWidth() / 2);
	};
	var startPlotting = function(){
		//at each internal, add a tick to the plot
		plotInterval = $interval(function(ticks){
			if($scope.pauseEnabled !== true){
				rePlotData(ticks);
			}
		}, plotIntervalRate);
	};
	var rePlotData = function(ticks){
		var dataSeries = plot.getData();
		
		//get the next series of data
		var success = function(queryData){
			if(queryData.length === 0){//stop everything
				stopSensors();
				return;
			}

			angular.forEach(queryData,function(dataPoint, idx){
				var val = parseFloat(dataPoint.datavalue);

				dataSeries.forEach(function(dataSerie){
					if(dataPoint.sensorname != dataSerie.sensorName)
						return;
					
					dataSerie.data.splice(0,1);//remove the first point
					dataSerie.data.push([(dataSerie.data[dataSerie.data.length-1][0])+1, val]);
				});

				$scope.countSensors.forEach(function(countSensor){
					if(dataPoint.sensorname != countSensor.displayName)
						return;
					
					countSensor.raw.push(val);
				});
			});

			/*
			//look for a point between last sample and this one
			var thisSampleTime = moment.utc().valueOf();
			var lastSampleTime = (thisSampleTime - plotIntervalRate);

			//logInfo('thisSampleTime:' + thisSampleTime + ', lastSampleTime: ' + lastSampleTime);
			sensorData.listByTime(dataSerie.vin, dataSerie.sensorName, lastSampleTime).then(function(logData){
				if(logData === null || logData.length < 1){
					//default to zero
					dataSerie.data.push([ticks, 0]);

					//repeat last value
					//dataSerie.data.push([ticks, dataSerie.data[dataSerie.data.length-1][1]]);
					return;
				}

				//logInfo('Timed plot data ' + dataSerie.sensorName, logData);
				var data = logData[logData.length-1];//take the last value provided in log data
				//if(angular.isDefined(data[$scope.memberSettings.units])){
				//	data = data[$scope.memberSettings.units];
				//}

				dataSerie.data.push([ticks, data]);
			}, function(err){
				dataSerie.data.push([ticks, -1]);
			});*/

			workoutMilliseconds += plotIntervalRate;
			plot.setData(dataSeries);
			plot.setupGrid();
			plot.draw();

			startRow = startRow+numRows;
		};
		var error = function(err){
			logError('replot data', err);
		};

		try{
			sensorData.listLastN(vin, startRow, numRows).then(success, error);
		}catch(ex){
			//logError(ex.message, ex);
		}

		return;
	};
	var startCoach = function(){
		//at each interval, add a tick to the plot
		coachInterval = $interval(function(ticks){
			if($scope.pauseEnabled === true){
				return;
			}

			angular.forEach($scope.countSensors, function(countSensor){
				switch(countSensor.displayName){
					case('Eng Oil Temp'):
						if(countSensor.raw[countSensor.raw.length-1] > 159)
							$scope.alarmList.push({title:'High engine oil temp'});
						break;
					case('Eng Oil Pres'):
						if(countSensor.raw[countSensor.raw.length-1] > 40)
							$scope.alarmList.push({title:'High engine oil pressure'});
						break;
					case('Bat Volts ECU'):
						if(countSensor.raw[countSensor.raw.length-1] > 13.50)
							$scope.alarmList.push({title:'High battery volts on ECU'});
						break;
				}
			});
		}, coachIntervalRate);
	};
	var startEnginPolling = function(){
		//at each interval, add a tick to the plot
		enginPollingInterval = $interval(function(ticks){
			//lookup engines
			checkForEngines();
		}, enginPollingIntervalRate);
	};
	var checkForEngines = function(){
		engine.list().then(function(engines){
				engineList = engines;
			},function(err){
				logError('engine polling',err);
				//engineList = [];
				//$interval.cancel(enginPollingInterval);
			});
	};

	//Destroy Scope
	$scope.$on('$destroy', function () {
		stopSensors();
		angular.forEach($filter('physicalSensorFilter')($scope.memberSensors), function(device){
			switch(device.sensorTypeId){
				case(SENSOR_TYPES.heartRate):
					Devices.polar.disconnect(device.physicalAddress).then(function (d) {
					}, function (err) {
						logError('error disconnecting polar', err);
					});
					break;
				case(SENSOR_TYPES.gloveAccel):
					Devices.metaWear.disconnect(device.physicalAddress).then(function (d) {
					}, function (err) {
						logError('error disconnecting metaWear', err);
					});
					break;
			};
		});
	});

	//Local  Variables
	var startRow = 0, numRows = 0, vin=null;
	var colors = ['blue','green','violet','yellow','indigo','orange','purple','black','brown','red','cyan','pink','grey','beige'];
	var engineList = [];
	var alarmDefinitions = [];
	var memberSensors = {};
	var plotContainer = $("#flot-placeholder");
	var plot = null;/*holder for plot*/
	var plotColors = [];
	var plotInterval = undefined;
	var calorieInterval = undefined;
	var coachInterval = undefined;
	var enginPollingInterval = undefined;
	var averageHeartRate = 0;
	var workoutMilliseconds = 0;
	var gloveLogRate = 2.9;
	var gloveGravityRange = 8.0;
	//var DATA_RECEIVED = 'dataReceived';
	//add a tick for 100%, 90%'Max', 80%'Hardcore', 70%'Cardio', 60%'Fitness', 50%'Warm Up', 'Rest'
	var heartRateZones = {
		zero: {min:0,max:0, label:'Rest', maxColor:'#ffffff', minColor:'#ffffff'},
		one: {min:0,max:0, label:'Warm Up', maxColor:'#b3b8ff', minColor:'#e6e7ff'},//0011ff
		two: {min:0,max:0, label:'Fitness', maxColor:'#b3ffbb', minColor:'#e6ffe8'},//00ff1d
		three: {min:0,max:0, label:'Cardio', maxColor:'#ffb3b3', minColor:'#ffe6e6'}//ff0000
	};

	const sampleDataLength = 3;
	const offset1 = 0.5;
	const offset2 = 0;
	const plotIntervalRate = 500; //milliseconds
	const calorieIntervalRate = 10000; //milliseconds
	const coachIntervalRate = 5000; //milliseconds
	const enginPollingIntervalRate = 20000; //milliseconds
	const coachmessageTimeout = 3000; //milliseconds

	//Scope  Variables
	$scope.startEnabled = null;
	$scope.countSensors = [];
	$scope.alarmList = [];
	$scope.memberSettings = null;
	$scope.pauseEnabled = null;
	$scope.grossCaloriesBurnedPerMin = null;
	$scope.coachmessage = '---';

	//Initialize Page
	init();
}])
;

var logInfo = function (msg, obj) { logVerbose('info', msg, obj); };
var logError = function (msg, obj) { logVerbose('error', msg, obj); };
var logWarn = function (msg, obj) { logVerbose('warn', msg, obj); };
var logData = function (sensorNm, data) { logVerbose('data', sensorNm, data); };
var logVerbose = function (type, msg, obj) {
	var msgObj = '';

	if (angular.isDefined(obj) && obj != null) {
		msgObj += (type != 'data' ? '\n' : '') + angular.toJson(obj, (type != 'data'));
	}

	switch (type) {
		case ('error'):
			console.error(msg + msgObj);
			break;
		case ('info'):
			console.info(msg + msgObj);
			break;
		case ('warn'):
			console.warn(msg + msgObj);
			break;
		case ('data'):
			console.info('	DATA	' + msg + '	' + msgObj);
			break;
	};
};