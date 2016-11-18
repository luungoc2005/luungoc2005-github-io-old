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
	
	function getSmallestImage(value) {
		return (value == null || value.length == 0)?"":value[value.length - 1]["url"];
	}
	
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
		$.each(currentResults, function(index, value) {
			
		});
	}
	
	spotify.addRelatedArtists = function() {
		if (relatedArtists == null || relatedArtists.length == 0) return;
		var count = 0;
		relatedArtists = $.grep(relatedArtists, function(value, index) {
			return !findHistory(value["uri"]);
		});
		$.each(relatedArtists, function(index, value) {
			controls.updateArtistSmall($("#" + markups.next_artist + index), 
				value["name"], 
				value["genres"].toString(), 
				value["popularity"], 
				getSmallestImage(value["images"]));
				count++;
			if (count > 2) return false;
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
				controls.addSearchResultItem(index, 
					value["name"], 
					value["genres"].toString(), 
					value["popularity"], 
					getSmallestImage(value["images"]));
			});
		}
	}
	
	spotify.setCurrentArtist = function(value) {
		controls.updateCurrentArtist(
			value["name"], 
			value["genres"].toString(), 
			value["popularity"], 
			getSmallestImage(value["images"]), 
			value["external_urls"]["spotify"],
			value["followers"]["total"]);
			
		if (selectedArtists.length > 1) { //set previous artist
			$("#" + markups.prev_artist).css("visibility", "visible");
			var prev = selectedArtists[selectedArtists.length - 2];
			controls.updateArtistSmall($("#" + markups.prev_artist), 
				prev["name"], 
				prev["genres"].toString(), 
				prev["popularity"], 
				getSmallestImage(prev["images"]));
		}
		else {
			$("#" + markups.prev_artist).css("visibility", "hidden");
		}
			
		//find related artists
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