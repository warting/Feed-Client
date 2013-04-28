/* global app */
app.controller("MainCtrl", ["$rootScope", "$location", "$http", function($rootScope, $location, $http) {

	$rootScope.ActiveUserToken = localStorage.token;
	$rootScope.loggedIn = !!localStorage.token;

	$rootScope.isLoading = function() {
		return !!$http.pendingRequests.length;
	};

	$rootScope.navClass = function(url){
		return $location.path() == url ? "active" : "";
	};

	$rootScope.logout = function() {
		delete localStorage.token;
		$rootScope.loggedIn = false;
		$location.path("/login");
	};

	$rootScope.Login = function(token) {
		$rootScope.ActiveUserToken = localStorage.token = token;
		$rootScope.loggedIn = true;

		window.loginCallback && parentSource &&
		parentSource.postMessage({action: loginCallback, args: []}, parentOrigin);
	};

}]);
