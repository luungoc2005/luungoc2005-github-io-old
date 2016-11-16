(function (global, controls, $) {
	controls.addSearchResultItem = function(name) {
		if (name != null && name != "") {
			$("<div />", {
				"text": name
			}).appendTo($(markups.results_box));
		}
	}
})(global, controls, jQuery)