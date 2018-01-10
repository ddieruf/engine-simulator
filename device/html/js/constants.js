angular.module('mean')
.constant('ApiUrl', 'http://fortunetellerservice.app.cloudyaws.io/')
.constant('USER_ROLES', {
	guest: 1,
	manager: 2,
	user: 3
})
.constant('USER_TYPES', {
	subscribed: 1
})
.constant('SESSION_EVENTS', {
})
.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized',
	badScript: 'auth-bad-script',
	lockScreen: 'lock-screen',
	logOut: 'logout'
})
.constant('APP_MEDIAQUERY', {
	'desktopLG': 1200,
	'desktop': 992,
	'tablet': 768,
	'mobile': 480
})
.constant('APP_REQUIRES', {
	scripts: {
		'flot-chart': ['lib/bower_components/Flot/jquery.flot.js',
										'lib/bower_components/Flot/excanvas.min.js'],
		'flot-chart-plugins': ['lib/bower_components/Flot/jquery.flot.categories.js',
														'lib/bower_components/Flot/jquery.flot.crosshair.js',
                            'lib/bower_components/Flot/jquery.flot.pie.js',
                            'lib/bower_components/Flot/jquery.flot.resize.js',
                            'lib/bower_components/Flot/jquery.flot.selection.js',
                            'lib/bower_components/Flot/jquery.flot.time.js'
														//'vendor/flot/jquery.flot.tooltip.min.js',
                            //'vendor/flot/js/jquery.flot.spline.min.js'
													],
		'inputmask': ['lib/inputmask/jquery.inputmask.bundle.min.js'],
		'parsley': ['lib/bower_components/parsleyjs/dist/parsley.min.js'],
		'loaders': ['lib/bower_components/loaders.css/loaders.min.css'],
		'fa': ['lib/fa/css/font-awesome.min.css'],
		'modernizr': ['lib/modernizr/modernizr.min.js'],
		'ngTable': ['lib/ngtable/ng-table.min.css',
								'lib/ngtable/ng-table.min.css.map',
								'lib/ngtable/ng-table.min.js.map',
								'lib/ngtable/ng-table.min.js'],
		'moment': ['lib/bower_components/moment/min/moment-with-locales.min.js'],
		'math-js': ['lib/bower_components/mathjs/dist/math.min.js']
	},
	modules: [
    {
    	name: 'toaster', files: ['lib/bower_components/AngularJS-Toaster/toaster.min.js',
																'lib/bower_components/AngularJS-Toaster/toaster.min.css']
		}/*,
		{
    	name: 'ngCordovaBluetoothle', files: ['lib/ng-cordova-bluetoothle/ng-cordova-bluetoothle.js']
    }*/
	]
})
;