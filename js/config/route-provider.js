app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', { templateUrl: '/views/news.html', controller: 'NewsCtrl'})
		.when('/applications', { templateUrl: '/views/applications.html', controller: 'ApplicationsCtrl'})
		.when('/settings', { templateUrl: '/views/settings.html', controller: 'SettingsCtrl'})
		.when('/android/:packageName', { templateUrl: '/views/android.html', controller: 'AndroidCtrl'})
		.when('/login', { templateUrl: '/views/login.html', controller: 'LoginCtrl' });

}]);
