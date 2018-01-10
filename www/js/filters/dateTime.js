angular.module('mean').filter('datetime', function (Settings, $filter) {
	return function (input, format) {
		if(Settings.getTimeZone() == 'device'){
			return navigator.globalization.dateToString(
					new Date(),
					function (date) { return date.value; },
					function () { logError('Error getting dateString') },
					{ formatLength: format, selector: 'date and time' }
			);
		}

		var offset = Settings.getTimeZone();

		if (typeof (input) == undefined || input == null || isNaN(input)) { return ''; }

		var dt = moment(input);

		if (typeof (format) == undefined || format == null || format.length == 0)
			format = 'MM/DD/YYYY';//'MM/DD/YYYY HH:mm:ss a (Z)'

		if (typeof (offset) == undefined || offset == null)
			offset = 'EST';

		return dt.tz(offset).format(format);
	};
});