(function (global, controls, spotify, $) {
	var spotifyUri = {
		search: "https://api.spotify.com/v1/search?",
		artist: "https://api.spotify.com/v1/artists/", // followed by Id of artist
		top_tracks: "https://api.spotify.com/v1/artists/{id}/top-tracks?country=US",
		related_artists: "https://api.spotify.com/v1/artists/{id}/related-artists"
	}	
	
	var currentResults = [];
	var selectedArtists = [];
	var relatedArtists = [];
	var topTracks = [];
	var prevQuery = "";
		
	function findHistory(uri) {
		if (selectedArtists == null || selectedArtists.length == 0) return false;
		
		for (var i = 0; i < selectedArtists.length; i++) {
			if (selectedArtists[i]["uri"] == uri) return true;
		}
		
		return false;
	}
	
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
				var params = {
					"query":query,
					"type":"artist",
					"limit":defaults.max_results
				};
				$.getJSON(spotifyUri.search + $.param(params), function(result) {
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
		
		$.getJSON(spotifyUri.top_tracks.replace("{id}", artistID),
			function(result) {
				if (result == null || result["tracks"].length == 0) {
					topTracks = [];
				}
				else {
					topTracks = result["tracks"];
					spotify.addTopTracks();
				}
			});
	}
	
	spotify.getRelatedArtists = function (artistID) {		
		if (artistID == null || artistID == "") return;
		
		controls.adjustRelated(0); //temporary measure. TODO: animations/load notifier?
		$.getJSON(spotifyUri.related_artists.replace("{id}", artistID),
			function(result) {
				if (result == null || result["artists"].length == 0) {
					relatedArtists = [];
				}
				else {
					relatedArtists = result["artists"];
					spotify.addRelatedArtists();
				}
			});
	}
	
	spotify.addTopTracks = function() {
		controls.clearTopTracks();
		$.each(topTracks, function(index, value) {
			controls.addTopTrack(value);
		});
	}
	
	spotify.addRelatedArtists = function() {
		if (relatedArtists == null || relatedArtists.length == 0) return;
		var count = 0;
		relatedArtists = $.grep(relatedArtists, function(value, index) {
			return !findHistory(value["uri"]);
		});
		$.each(relatedArtists, function(index, value) {
			controls.updateArtistSmall($("#" + markups.next_artist + index), value);
				count++;
			if (count > 2) return false; //max-related
		});
		// console.log(relatedArtists.length);
		controls.adjustRelated(count);
	}
	
	spotify.addSearchResults = function() {
		if (currentResults == null || currentResults.length == 0) {
			controls.hideSearch();
		}
		else {
			controls.showSearch();
			$.each(currentResults, function(index, value) {
				//if (index + 1 > defaults.max_results) return false;
				controls.addSearchResultItem(index, value);
			});
		}
	}
	
	spotify.setCurrentArtist = function(value) {
		controls.updateCurrentArtist(value);
			
		if (selectedArtists.length > 1) { //set previous artist
			$("#" + markups.prev_artist).css("visibility", "visible");
			controls.updateArtistSmall($("#" + markups.prev_artist), selectedArtists[selectedArtists.length - 2]);
		}
		else {
			$("#" + markups.prev_artist).css("visibility", "hidden");
		}
			
		//find related artists
		spotify.getTopTracks(value["uri"].replace("spotify:artist:",""));
		spotify.getRelatedArtists(value["uri"].replace("spotify:artist:",""));
	}
	
	spotify.pushCurrentArtist = function (value) {
/* 		currentArtist = (currentResults != null && currentResults.length>0)?
						currentResults[id]:null; */
		if (value != null) {
			selectedArtists.push(value);
			spotify.setCurrentArtist(value);
		}		
	}
	
	spotify.pushRelatedArtist = function (id) {
		spotify.pushCurrentArtist(relatedArtists[id]);
	}
	
	spotify.pushPrevArtist = function() {
		if (selectedArtists.length > 1) {
			selectedArtists.pop();
			spotify.setCurrentArtist(selectedArtists[selectedArtists.length - 1]);
		}
	}
	
	spotify.gotoResult = function(index) {
		if (currentResults != null && currentResults.length > 0) {
			spotify.pushCurrentArtist(currentResults[index]);
			controls.hideSearch();
		}
	}
	
})(global, controls, spotify, jQuery);