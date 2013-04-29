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
		var packageName = prompt("What package name do you want?\nOnly use: [a-z] _ .", defaultPackageName || "");

		if($scope.validatePackageName(packageName, true) == false) {
			$scope.createApp();
			return;
		}

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

	$scope.validatePackageName = function(packageName, warn) {
	    if(packageName.length < 3) {
	       if(warn) alert('to short!');
	       return false;
	    }
	    
	    if(packageName.indexOf(".") == -1) {
	        if(warn) alert('must contain at least one . (dot)');
	        return false;
	    }
	    
	    if(packageName.indexOf("..") !== -1) {
	        if(warn) alert('must not contain two . in a row');
	        return false;
	    }
	    
	    
	    if(packageName.indexOf("_.") !== -1) {
	        if(warn) alert('must not contain _.');
	        return false;
	    }
	    
	    if(packageName.indexOf("._") !== -1) {
	        if(warn) alert('must not contain ._');
	        return false;
	    }


	    if(packageName.indexOf(".0") !== -1) {
	        if(warn) alert('must not contain .0');
	        return false;
	    }
	    if(packageName.indexOf(".1") !== -1) {
	        if(warn) alert('must not contain .1');
	        return false;
	    }
	    if(packageName.indexOf(".2") !== -1) {
	        if(warn) alert('must not contain .2');
	        return false;
	    }
	    if(packageName.indexOf(".3") !== -1) {
	        if(warn) alert('must not contain .3');
	        return false;
	    }
	    if(packageName.indexOf(".4") !== -1) {
	        if(warn) alert('must not contain .4');
	        return false;
	    }
	    if(packageName.indexOf(".5") !== -1) {
	        if(warn) alert('must not contain .5');
	        return false;
	    }
	    if(packageName.indexOf(".6") !== -1) {
	        if(warn) alert('must not contain .6');
	        return false;
	    }
	    if(packageName.indexOf(".7") !== -1) {
	        if(warn) alert('must not contain .7');
	        return false;
	    }
	    if(packageName.indexOf(".8") !== -1) {
	        if(warn) alert('must not contain .8');
	        return false;
	    }
	    if(packageName.indexOf(".9") !== -1) {
	        if(warn) alert('must not contain .9');
	        return false;
	    }
	    
	    if(/^[0-9a-z._]*$/.test(packageName) == false) {
	        if(warn) alert('packagename contains invalid character, valid characters is: 0-9a-z . _');
	        return false;
	    }
	    
	    var firstChar = packageName.charAt(0);
	    var lastChar = packageName.charAt(packageName.length-1);

	    if($scope.isNumber(firstChar)) {
	        if(warn) alert('first character in packageName cannot be numeric');
	    	return false;
	    }

	    if(firstChar == '.') {
	        if(warn) alert('packageName cannot start with a . (dot)');
	        return false;
	    }
	    if(firstChar == '_') {
	        if(warn) alert('packageName cannot start with a _ (underscore)');
	        return false;
	    }
	    if(lastChar == '.') {
	        if(warn) alert('packageName cannot end with a . (dot)');
	        return false;
	    }
	    if(lastChar == '_') {
	        if(warn) alert('packageName cannot end with a _ (underscore)');
	        return false;
	    }
	    
	    return true; // valid
	};

	$scope.isNumber = function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

}]);