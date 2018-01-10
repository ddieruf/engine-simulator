angular.module('mean').provider('modal', [function () {
	this.$get = ['ngDialog',function (ngDialog) {
		var open = function (scope, templateUrl, controller, size, paramObj, onClose) {
			var win = ngDialog.open({
				scope: scope,
				template: templateUrl,
				controller: controller,
				className: 'ngdialog-theme-default',
				data: paramObj,
				showClose: true,
				closeByEscape: false,
				closeByNavigation: true,
				closeByDocument: false,
				cache: false,
				preserveFocus: true
			});

			win.closePromise.then(function (winObj) {
				//winObj.id
				//winObj.value
				//winObj.$dialog

				if(angular.isDefined(winObj.value) && winObj.value !== null && (
						winObj.value === '$escape'
						|| winObj.value === '$closeButton'
						|| winObj.value === '$document')){
					return; //don't do anything as the window was closed by "other forces"
				}

				if (onClose)//run provided function if window was close properly
					onClose(winObj.value);
			});

			return win;
		};

		return {
			open:open
		}
	}];

	this.init = function () {

	};
}]);