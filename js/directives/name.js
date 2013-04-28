/* global app */
/*
 Usefull if you need to add validation to a input
 element that is repeated and you want it to belong
 to the parent form
*/
app.directive('uiName', ['$interpolate', function($interpolate){
	return {
		restrict: 'A',
		require: ['ngModel', '^?form'],
		link: function(scope, element, attrs, ctrl){
			var ex, modelCtrl, formCtrl;
			ex = $interpolate(element.attr(attrs.$attr.uiName));
			modelCtrl = ctrl[0];
			modelCtrl.$name = ex(scope);
			formCtrl = ctrl[1];
			return formCtrl.$addControl(modelCtrl);
		}
	};
}]);