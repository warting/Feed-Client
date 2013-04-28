/* global app,angular */
app.directive('input', function() {
	return {
		restrict: 'E',
		require: '?ngModel',
		link: function(scope, element, attr, ctrl) {

			if (
				ctrl &&
				!ctrl.modelValue &&
				attr.placeholder &&
				/range|color/.test(attr.type)
			){
				setTimeout(function() {
					!ctrl.$modelValue &&
					element.val(attr.placeholder);
					scope.$apply();
				},0);
			}

		}
	};
});