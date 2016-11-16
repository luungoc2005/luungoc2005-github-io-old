(function (global, controls, $) {
	controls.addSearchResultItem = function(id, name, genres, pop, img) {	
		if (name != null && name != "") {
			var item = $("<a />", {
				"class": markups.search_item,
				"id": markups.search_id + id,
				"href": "javascript:void(0)"
			}).appendTo($("#" + markups.results_box));
			
			var wrapper = $("<div />").appendTo(item);
			
			//note to self: somehow "data": id attribute will cause this to not work
			
			$("<div />", { //name div
				"text": name,
				"class": "item_name",
			}).appendTo(wrapper);
			
			$("<div />", { //genres div
				"text": genres,
				"class": "item_genres",
			}).appendTo(wrapper);
			
			$("<img />", { //img
				"src": img,
				"class": "item_img",
			}).appendTo(wrapper);
						
			wrapper.click(function() {
				spotify.setCurrentArtist(wrapper.attr("data"));
			});
		}
	}
	
	controls.updateCurrentArtist = function() {
		
	}
	
	controls.clearResultBox = function() {
		$("#" + markups.results_box).empty();
	}
	
	controls.init = function() {
		$("#" +markups.search_box).on("change paste keyup", function () {
			spotify.searchFor($("#" + markups.search_box).val());
		});
	}
})(global, controls, jQuery)