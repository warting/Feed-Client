/* global app */
app.filter('map', function(){
	return function(array, key){

		return array.reduce(function ( total, current ) {
			var keyName = current[key || "name"];
			if(!keyName){ return total; }
			delete current[key || "name"];
			total[ keyName ] = current;
			return total;
		}, {});

	};
});