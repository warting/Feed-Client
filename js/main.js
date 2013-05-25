"use strict";

window.app = angular.module("feed", ["ngResource"/*, "ngMockE2E"*/]);

/* to fake a backend
app.run(['$httpBackend', function($httpBackend) {

	var offline = {"payload":[{"id":66001,"packageName":"com.warting.blogg.endless2","buildNumber":2,"betaVersion":null,"releaseVersion":null,"androidMeta":null},{"id":67001,"packageName":"com.warting.blogg.endless","buildNumber":1,"betaVersion":null,"releaseVersion":null,"androidMeta":null}],"status":200,"message":"ok"};
	var feed = {"data":{"responseData":{"feed":{"feedUrl":"http://feed.nu/feed","title":"Feed.nu - Blog to app generator","link":"http://feed.nu","author":"","description":"Blog to app generator","type":"rss20","entries":[{"title":"API is live!","link":"http://feed.nu/2013/02/05/api-is-live/","author":"admin","publishedDate":1360075776000,"contentSnippet":"The new API for generating apps is live and ready to use. Read the getting started guide at mashape if you are intrested in ...","content":"<p>The new API for generating apps is live and ready to use. Read the getting started guide at <a href=\"https://www.mashape.com/warting/feed-nu#getting-started\">mashape</a> if you are intrested in developing feed.nu for other systems than wordpress.</p>\n<p>The work to implement the API to the wordpress plugin has already been started.</p>","categories":["Features","Plugin news","Site News"]},{"title":"Searching for beta testers","link":"http://feed.nu/2013/02/01/searching-for-beta-testers/","author":"admin","publishedDate":1359758575000,"contentSnippet":"When signing up for a blog at feed.nu you are now required to enter your API key from http://api.feed.nu/. This implementation ...","content":"<p>When signing up for a blog at feed.nu you are now required to enter your API key from <a href=\"http://api.feed.nu/\">http://api.feed.nu/</a>. This implementation helps protect me from spammers and the new API key is a part of the upcoming version of the app.<br>\nThis site will work more like a blog hosting platform and the core functionality that actually building the app has been separated to an API provided via <a href=\"http://mashape.com/\">http://mashape.com/</a>.</p>\n<p>We are now looking for beta testers that know how to call a JSON based rest service and maybe want to implement feed.nu into different CMS system besides WordPress.</p>\n<p>Please leave a comment if you are interested and I will invite you to use the API at M.</p>","categories":["Features","Plugin news","Site News"]},{"title":"Build agent bot in IRC chat","link":"http://feed.nu/2012/11/05/build-agent-bot-in-irc-chat/","author":"admin","publishedDate":1352117003000,"contentSnippet":"A bot has joined the chat and tells you what the build server is doing and if it fails or not. Check it ...","content":"<p>A bot has joined the chat and tells you what the build server is doing and if it fails or not.</p>\n<p>Check it out: <a href=\"http://feed.nu/chat/\">http://feed.nu/chat/</a> or join #feed @ chat.freenode.net</p>","categories":["Features"]},{"title":"Support chat","link":"http://feed.nu/2012/11/01/support-chat/","author":"admin","publishedDate":1351758039000,"contentSnippet":"In almost all cases of support questions I need to do some investigation to detect what kind of problem you run in to and ask ...","content":"<p>In almost all cases of support questions I need to do some investigation to detect what kind of problem you run in to and ask questions back. It has been very hard to answer all questions that arrived. Therefor I’m trying to help you on a live-chat instead.</p>\n<p>Use the <a title=\"Chat\" href=\"http://feed.nu/chat/\">webclient</a> or join #feed on irc.freenode.net</p>","categories":["Bug fixes","Features","Plugin news","Site News"]}]}},"responseDetails":null,"responseStatus":200}}
	// returns the current list of phones
	// $httpBackend.whenGET(/^./).passThrough();

	$httpBackend.whenGET(/^\//).passThrough();
	$httpBackend.whenGET('https://feed.p.mashape.com/android/').respond(JSON.stringify(offline));
	$httpBackend.whenJSONP(/^./).respond(JSON.stringify(feed.data));

}]);
*/

!function() {
	var orgExtend = angular.extend,

	extendDeep = function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				extendDeep(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	};

	angular.extend = function() {
		// if first argument is true it calls extendDeep, otherwice the default one
		var args = Array.prototype.slice.call(arguments);
		return [(args[0] === true && args.shift()) ? extendDeep : orgExtend][0].apply(this, args);
	};
}();



app.filter('newlines', function () {
    return function(text) {
        return text && text.replace(/\n/g, '<br/>');
    }
})

app.filter('noHTML', function () {
    return function(text) {
        return text && text
                .replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;');
    }
});



var parentOrigin;
var parentSource;
var imagePicker;
var defaultPackageName;

window.addEventListener('message', function(event) {
	var data = event.data;
	var elm = angular.element(document);
	var Mashape = elm.injector().get("Mashape");
	var $root = elm.scope().$root;


	// We allow every domain to post message to us!
	// if(e.origin !== 'http://feeder.nu'){ return }
	if(!parentOrigin){
		parentOrigin = event.origin;
		parentSource = event.source;
	}

	if(parentOrigin !== event.origin){
		throw "We only alow one origin at the time to communicate with us!";
	}

	if(data.login){
		var token = angular.isArray(data.login) ? data.login[0] : data.login;
		var callback = angular.isArray(data.login) && angular.isString(data.login[1]) && data.login[1];
		window.loginCallback = callback;

		if(/^[a-fA-F0-9]{32}$/.test(token)){
			$root.loggedIn = true;
			$root.ActiveUserToken = token;
			$root.$apply();
			callback && parentSource.postMessage({action: callback, args: []}, parentOrigin);
		} else {
			callback && parentSource.postMessage({action: callback, args: ["Token is invalid"]}, parentOrigin);
		}
	}

	if(data.defaultPackageName){
		defaultPackageName = data.defaultPackageName;
	}

	if(data.createApp && angular.isArray(data.createApp) && data.createApp.length === 2){
		var packageName = data.createApp[0].packageName;
		var buildNumber = data.createApp[0].buildNumber;
		var meta = data.createApp[0].meta;
		var callback = data.createApp[1];

		Mashape.createAndroidApp({packageName: packageName}).$then(function(res){
			// var metaKey, model, arrData = [];

			if(res.data && res.data.packageName){
				// for(metaKey in defaultMeta){
				// 	model = defaultMeta[metaKey];
				// 	if( model.blob ){
				// 		Mashape.uploadResource({
				// 			name : metaKey,
				// 			file : model.blob,
				// 			packageName : packageName
				// 		});
				// 	} else if( metaKey == "buildVersion" ){

						Mashape.setBuildNumber({
							packageName: packageName,
							buildNumber: buildNumber
						});

				// 	} else if( model.value ){
				// 		// only push the meta we have changed
				// 		arrData.push({name: metaKey, value: model.value});
				// 	}
				// }

				// arrData.length && // if ture, continue

				Mashape.updateAndroidMeta({
					metas : meta,
					packageName : packageName
				});

				callback && parentSource.postMessage({action: callback, args: []}, parentOrigin);

			} else {
				// alert('app already exist');
				callback && parentSource.postMessage({action: callback, args: ['App already exist']}, parentOrigin);
			}
		});
		elm.scope().$apply();
	}

	if(data.imagePicker){
		imagePicker = data.imagePicker;
	}

	if(data.updateMeta){
		var $scope = angular.element(androidForm).scope(),
			metaKey = event.data.updateMeta.name;

		$scope.meta[metaKey].file = data.blob;
		$scope.readImage(metaKey);
		$scope.$apply();
	}



}, false);


// TODO: implement jsplump