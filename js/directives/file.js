/* global app,angular */
app.directive('input', function() {
	function map(obj, iterator, context) {
		var results = [];
		angular.forEach(obj, function(value, index, list) {
			results.push(iterator.call(context, value, index, list));
		});
		return results;
	}

	return {
		restrict: 'E',
		require: '?ngModel',
		link: function(scope, element, attr, ctrl) {

			if (!ctrl || !attr.type || (attr.type && attr.type.toLowerCase() !== "file") ){
				return;
			}

			// TODO: Need validation
			ctrl.$render=function(){};

			element.bind('change', function() {
				scope.$apply(function() {
					var

					viewValue,
					files = element[0].files,
					isValid = true;

					if (attr.accept) {
						var i, j, acceptType, fileType,
						types = map(attr.accept.split(','), function(t) { return t.trim().split('/'); });

						for (i = 0; i < files.length && isValid; ++i) {
							fileType = files[i].type.split('/');
							isValid = false;
							for (j = 0; j < types.length && !isValid; ++j) {
								acceptType = types[j];
								isValid = acceptType[0] === fileType[0] && (acceptType[1] === '*' || acceptType[1] === fileType[1]);
							}
						}
					}

					ctrl.$setValidity('file', isValid);

					if (isValid) { viewValue = attr.multiple ? files : files[0]; }
					ctrl.$setViewValue(viewValue);
				});
			});

		}
	};
});