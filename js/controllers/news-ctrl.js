/* global app:true */
app.controller("NewsCtrl", ["$scope", "$http", function($scope, $http) {

	$scope.feed =
		sessionStorage.feeds && JSON.parse(sessionStorage.feeds) ||
		$http.jsonp("//ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=JSON_CALLBACK&q=http://feed.nu/feed").success(function(res) {

			res.responseData.feed.entries.forEach(function(entrie) {
				entrie.publishedDate = new Date(entrie.publishedDate).getTime();
			});

			sessionStorage.feeds = JSON.stringify({data: res});
	});
}]);