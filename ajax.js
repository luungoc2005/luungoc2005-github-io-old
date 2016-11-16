(function (global, controls, spotify, $) {
	var spotifyUri = {
		search: "https://api.spotify.com/v1/search"
	}	
	
	var currentResults;
	var currentArtist;
	
	var searchFor = function (query) {
		if (query == null) return;
		if (query == "") $(markups.results_box).empty();
		
		$.getJSON(spotifyUri.search + "?q=" + encodeURIComponent(query) + "&type=artist", 
			function(result) {
				if (result == null) return;
				$(markups.results_box).empty();
				
				currentResults = result["artists"]["items"] || currentResults;
				
				spotify.addSearchResults();
			});		
	};
	
	spotify.addSearchResults = function() {
		$.each(currentResults, function(index, value) {
			if (index + 1 > defaults.max_results) return false;
			
			controls.addSearchResultItem(value["name"]);
		});
	}
	
	spotify.setCurrentArtist = function (artist) {
		currentArtist = artist;
	}
	
	spotify.gotoResult = function() {
		if (currentResults != null && currentResults.length > 0) setCurrentArtist(currentResults[0]);
	}
	
	spotify.init = function() {
		$(markups.search_box).on("change paste keyup", function () {
			searchFor($(markups.search_box).val());
		});
	};
})(global, controls, spotify, jQuery);