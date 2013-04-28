/* global app:true, prompt */
app.controller("ApplicationsCtrl", ["$scope", "$filter", "Mashape", "$cacheFactory", function($scope, $filter, Mashape, $cacheFactory) {

	$scope.apps = Mashape.getAndroidApps();

	$scope.removeApp = function(packageName) {

		var proceed = confirm("Are you sure you want to delete this app?")
		if(!proceed && window.confirm){
			return;
		}

		$scope.apps = $filter('filter')($scope.apps, {packageName: "!"+packageName});
		Mashape.deleteAndroidApp({packageName: packageName});

		// clear some memory
		$cacheFactory.get("$http").remove("https://feed.p.mashape.com/android/");
		Mashape.getAndroidApps();
	};

	$scope.publish = function(packageName) {
		// clear some memory
		$cacheFactory.get("$http").remove("https://feed.p.mashape.com/android/");

		Mashape.publishBeta({packageName: packageName}, function() {
			Mashape.getAndroidApps(function(response) {
				$scope.apps = response;
			});
		});
	};

	$scope.push = function(packageName) {
		Mashape.pushAndroid({packageName: packageName});
	};

	$scope.generate = function(packageName) {
		Mashape.generateAndroidApp({packageName : packageName}, function() {
			alert("The build process has begun. It takes about 1 minute. You will receive a E-mail when it's done!");
		});
	};

	$scope.createApp = function() {
		var packageName = prompt("What package name do you want?\nOnly use: [A-Z] [a-z] _ .", defaultPackageName || "");

		if(packageName){
			Mashape.createAndroidApp({packageName: packageName}, function(res) {
				if(!res){
					alert("packageName already exist");
				}
				// want to do a new request (so clear memory)
				$cacheFactory.get("$http").remove("https://feed.p.mashape.com/android/");

				Mashape.getAndroidApps(function(response) {
					$scope.apps = response;
				});
			});
		}
	};

}]);