/* global app, angular */

// This is a module for cloud persistance in mongolab - https://mongolab.com
app.factory('Mashape', ["$resource", "$cacheFactory", "$http", "$rootScope", function($resource, $cacheFactory, $http, $rootScope) {


	function defConf (method, extraConf) {
		return angular.extend({
			method: method,
			transformResponse: getOnlyPayload,
			transformRequest: transformRequest,
			headers: {
				"X-Mashape-Authorization": "AlHAMu3Tk42kdY1DUTKfnCE0WdNFqwpI"
			}
		}, extraConf || {});
	}

	function mash(url, defaultParam) {
		return $resource('https://feed.p.mashape.com/'+url, defaultParam || {}, {
			get: defConf("GET"),
			store: defConf("GET", {cache: $cacheFactory}),
			storeArray: defConf("GET", {cache: $cacheFactory, isArray: true}),
			update: defConf("PUT"),
			save: defConf("POST"),
			query: defConf("GET", {isArray: true}),
			remove: defConf("DELETE")
		});
	}

	function transformRequest (data, headersGetter) {
		headersGetter().token = $rootScope.ActiveUserToken;
		if(data && data.packageName){
			delete data.packageName;
		}
		return JSON.stringify(data);
	}

	function getOnlyPayload (data) {
		return JSON.parse(data).payload;
	}

	var feedApi = {
		createAndroidApp: mash("android/:packageName", {packageName: "@packageName"}).update,

		generateAndroidApp: mash("android/:packageName/generate").get,

		getAndroidApp: mash("android/:packageName").store,

		getAndroidApps: mash("android").storeArray,

		getAvailibleMetaSettings: mash("android/meta/availibleSettings").storeArray,

		// getFileInfo: angular.noop,

		getUser: mash("user").store,

		publishBeta: mash("android/:packageName/publish", {packageName: "@packageName"}).save,

		pushAndroid: mash("android/:packageName/push").get,

		setBuildNumber: mash("android/:packageName/:buildNumber", {packageName: "@packageName", buildNumber: "@buildNumber"}).save,

		updateAndroidMeta: mash("android/meta/:packageName", {packageName: "@packageName"}).save,

		deleteAndroidApp: mash("android/:packageName").remove,

		uploadResource: function(data) {
			var payload = new FormData(),
				url = "https://feed.p.mashape.com/android/file/"+data.packageName+"/uploadimage/";

			payload.append("name", data.name);
			payload.append("file", data.file, "bild.png");

			return $http.post(url, payload, {
				headers: {
					"Content-Type": false,
					token: $rootScope.ActiveUserToken || localStorage.token,
					"X-Mashape-Authorization": "k0ivjgqqhpct7gpnhupp9m3dl1i5d9"
				},
				transformRequest: function(data){ return data; }
			});
		}
	};

	return feedApi;

}]);


