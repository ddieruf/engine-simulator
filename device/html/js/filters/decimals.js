angular.module('mean').filter('decimals', function ($filter) {
	return function (input, decimals) {
		if (typeof (input) === undefined || input === null || isNaN(input)) { return input; }

		if (typeof (decimals) === undefined || decimals === null)
			decimals = 0;

		return $filter('number')(input, decimals);
	};
});