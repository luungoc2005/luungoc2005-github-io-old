(function (global, controls, spotify, $) {
	var spotifyUri = {
		search: "https://api.spotify.com/v1/search"
	}	
	
	var currentResults;
	var currentArtist;
	
	spotify.searchFor = function (query) {
		if (query == null) return;
		if (query == "") controls.clearResultBox();
		
		$.getJSON(spotifyUri.search + "?q=" + encodeURIComponent(query) + "&type=artist" + "&limit=" + defaults.max_results, 
			function(result) {
				if (result == null) return;
				controls.clearResultBox();
				
				currentResults = result["artists"]["items"] || currentResults;
				
				spotify.addSearchResults();
			});		
	};
	
	spotify.addSearchResults = function() {
		$.each(currentResults, function(index, value) {
			//if (index + 1 > defaults.max_results) return false;
			
			var imageUrl = (value["images"] == null || value["images"].length == 0)?"":value["images"][value["images"].length - 1]["url"];
			controls.addSearchResultItem(index, value["name"], value["genres"].toString(), value["popularity"], imageUrl);
		});
	}
	
	spotify.setCurrentArtist = function (id) {
		currentArtist = (currentResults != null && currentResults.length>0)?
						currentResults[id]:null;
	}
	
	spotify.gotoResult = function() {
		if (currentResults != null && currentResults.length > 0) setCurrentArtist(currentResults[0]);
	}
	
})(global, controls, spotify, jQuery);