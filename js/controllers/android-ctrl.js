/* global app, angular, webkitURL */
app.controller("AndroidCtrl", ["$scope", "$routeParams", "Mashape", "$filter", "$cacheFactory", function($scope, $routeParams, Mashape, $filter, $cacheFactory) {

	$scope.meta = {
		buildVersion: {
			description: "The next build version number",
			type: "SETTING"
		}
	};

	$scope.packageName = $routeParams.packageName;

	Mashape.getAndroidApp({packageName: $routeParams.packageName}, function(res) {
		angular.extend(true, $scope.meta, $filter("map")(res.androidMeta));
		$scope.filter = "color";
	});

	Mashape.getAvailibleMetaSettings('', function(res) {
		angular.extend(true, $scope.meta, $filter("map")(res));
		$scope.reCss();
	});

	$scope.reCss = function() {
		$scope.screenCss = {
			backgroundColor: $scope.meta.background.value || $scope.meta.background.defaultValue,
			color: $scope.meta.text.value || $scope.meta.text.defaultValue
		};

		$scope.frameCss = {
			backgroundColor: $scope.meta.list_background.value || $scope.meta.list_background.defaultValue
		};
	};

	$scope.show = function(screen) {
		$scope.screenToShow = screen;
	};

	saveMeta = function(callback) {
		var metaKey, model, arrData = [];

		for(metaKey in $scope.meta){
			model = $scope.meta[metaKey];
			if( model.file ){
				Mashape.uploadResource({
					name : metaKey,
					file : model.file,
					packageName : $scope.packageName
				});

			} else if( metaKey == "buildVersion" && $scope.androidForm[metaKey] && $scope.androidForm[metaKey].$dirty){

				Mashape.setBuildNumber({
					packageName: $routeParams.packageName,
					buildNumber: model.value
				});

			} else if( $scope.androidForm[metaKey] && $scope.androidForm[metaKey].$dirty ){
				// only push the meta we have changed
				arrData.push({name: metaKey, value: model.value});
			}
		}

		arrData.length && // if ture, continue

		Mashape.updateAndroidMeta({
			metas : arrData,
			packageName : $scope.packageName
		});

		callback();
	};


	$scope.formInit = function() {
		$scope.androidForm.$removeControl = angular.noop;
	};

	$scope.selectImage = function(event, metaKey) {
		event.preventDefault();

		if(imagePicker){
			parentSource.postMessage({action: imagePicker, args: [ {name: metaKey}, $scope.meta[metaKey].description ]}, parentOrigin)
		} else {
			event.target.control.click();
		}

		return;
	};


	// Generate a application and notifiy the user
	$scope.generate = function() {
		saveMeta(function() {
			$cacheFactory.get("$http").remove("https://feed.p.mashape.com/android/" + $scope.packageName + "/");
			Mashape.generateAndroidApp({packageName : $scope.packageName}, function() {
				alert("The build process has begun. It takes about 1 minute. You will receive a E-mail when it's done!");
			});
		});
	};

	// (Triggerd when changed input file)
	// Creates a blob file/url from the file so it can be displayed using <img>
	// $scope.getImage get triggerd automatlicly afterward...
	$scope.readImage = function(meta) {
		var model = $scope.meta[meta],
			URL =  URL || webkitURL;
		model.src = URL.createObjectURL(model.file);
	};

	// returns:
	// 1) selected image from the input field or
	// 2) the value that he/she has specifed eariler or
	// 3) The default value if non the above is correct or
	// 4) an empty string if non of the data from mashape has been loaded yet or failed
	$scope.getImage = function(meta) {
		var model = $scope.meta[meta];

		return model && (
			model.src ||
			model.value ||
			model.defaultValue ) ||
			"";
	};

}]);
