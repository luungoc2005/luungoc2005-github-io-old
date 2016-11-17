(function (global, controls, spotify, $) {
	var spotifyUri = {
		search: "https://api.spotify.com/v1/search?q={query}&type=artist",
		artist: "https://api.spotify.com/v1/artists/", // followed by Id of artist
		top_tracks: "https://api.spotify.com/v1/artists/{id}/top-tracks?country=US",
		related_artists: "https://api.spotify.com/v1/artists/{id}/related-artists"
	}	
	
	var currentResults = [];
	var selectedArtists = [];
	var relatedArtists = [];
	var topTracks = [];
	var prevQuery = "";
	
	spotify.searchFor = function (query) {
		if (query == null) return;
		if (query == "") {
			controls.hideSearch();
			controls.clearResultBox();
		}
		else {
			if (prevQuery == query && currentResults != null && currentResults.length > 0) {
				controls.showSearch();
			}
			else {			
				$.getJSON(spotifyUri.search.replace("{query}", encodeURIComponent(query)) + "&limit=" + defaults.max_results, 
				function(result) {
					if (result == null) return;					
					controls.clearResultBox();					
					currentResults = result["artists"]["items"] || currentResults;					
					spotify.addSearchResults();					
					prevQuery = query;
				});				
			}
		}
	};
	
	spotify.getTopTracks = function (artistID) {
		if (artistID == null || artistID == "") return;
		
		$.getJSON(spotifyUri.top_tracks.replace("{id}", artistId),
			function(result) {
				topTracks = (result == null)?null:result["tracks"];
			});
	}
	
	spotify.getRelatedArtists = function (artistID) {		
		if (artistID == null || artistID == "") return;
		
		$.getJSON(spotifyUri.related_artists.replace("{id}", artistId),
			function(result) {
				relatedArtists = (result == null)?null:result["artists"];
			});
	}
	
	spotify.addTopTracks = function() {
		$.each(currentResults, function(index, value) {
			
		});
	}
	
	spotify.addRelatedArtists = function() {
		$.each(currentResults, function(index, value) {
			
		});
	}
	
	spotify.addSearchResults = function() {
		if (currentResults == null || currentResults.length == 0) {
			controls.hideSearch();
		}
		else {
			controls.showSearch();
			$.each(currentResults, function(index, value) {
				//if (index + 1 > defaults.max_results) return false;			
				var imageUrl = (value["images"] == null || value["images"].length == 0)?"":value["images"][value["images"].length - 1]["url"];
				controls.addSearchResultItem(index, 
					value["name"], 
					value["genres"].toString(), 
					value["popularity"], 
					imageUrl);
			});
		}
	}
	
	spotify.pushCurrentArtist = function (value) {
/* 		currentArtist = (currentResults != null && currentResults.length>0)?
						currentResults[id]:null; */
		if (value != null) selectedArtists.push(value);
		var imageUrl = (value["images"] == null || value["images"].length == 0)?"":value["images"][value["images"].length - 1]["url"];
		controls.updateCurrentArtist(
			value["name"], 
			value["genres"].toString(), 
			value["popularity"], 
			imageUrl, 
			value["external_urls"]["spotify"],
			value["followers"]["total"]);
	}
	
	spotify.gotoResult = function(index) {
		if (currentResults != null && currentResults.length > 0) {
			selectedArtists = [];
			spotify.pushCurrentArtist(currentResults[index]);
			controls.hideSearch();
		}
	}
	
})(global, controls, spotify, jQuery);