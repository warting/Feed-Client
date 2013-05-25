/* global app */
app.controller("LoginCtrl", ["$location", "$rootScope", function($location, $rootScope) {

	var token = $location.search().token;

	if(/^[a-fA-F0-9]{32}$/.test(token)){
	
		$rootScope.ActiveUserToken = localStorage.token = token;
		$rootScope.loggedIn = true;
		$location.path( 'applications', null ).replace();	

		window.callback && parentSource.postMessage({action: callback, args: []}, parentOrigin);
	} else {
		window.callback && parentSource.postMessage({action: callback, args: ["Token is invalid"]}, parentOrigin);
	}
	
	$location.search( 'token', null ).replace();
	
}]);
