(function (global, controls, spotify, $) {
	var spotifyUri = {
		search: "https://api.spotify.com/v1/search?",
		artist: "https://api.spotify.com/v1/artists/", // followed by Id of artist
		top_tracks: "https://api.spotify.com/v1/artists/{id}/top-tracks?country=US",
		related_artists: "https://api.spotify.com/v1/artists/{id}/related-artists",
        album: "https://api.spotify.com/v1/albums/{id}"
	},
        currentResults = [],
        selectedArtists = [],
        relatedArtists = [],
        topTracks = [],
        prevQuery = "";
		
	function findHistory(uri) {
        var i;
        
		if (!selectedArtists) { return false; }
		
		for (i = 0; i < selectedArtists.length; i += 1) {
			if (selectedArtists[i].uri === uri) { return true; }
		}
		
		return false;
	}
	
	spotify.searchFor = function (query) {
		if (query === null) { return; }
		if (query === "") {
			controls.hideSearch();
			controls.clearResultBox();
		} else {
			if (prevQuery === query && currentResults) {
				controls.showSearch();
			} else {
				var params = {
					"query" : query,
					"type" : "artist",
					"limit" : defaults.max_results
				};
				$.getJSON(spotifyUri.search + $.param(params), function (result) {
					if (!result) { return; }
					controls.clearResultBox();
					currentResults = result.artists.items || currentResults;
					spotify.addSearchResults();
					prevQuery = query;
				});
			}
		}
	};
	
	spotify.getTopTracks = function (artistID) {
		if (!artistID) { return; }
		
		$.getJSON(spotifyUri.top_tracks.replace("{id}", artistID),
			function (result) {
				if (!result || !result.tracks) {
					topTracks = [];
				} else {
					topTracks = result.tracks;
					spotify.addTopTracks();
				}
			});
	};
    
    spotify.getAlbum = function (albumUri) {
        if (!albumUri) { return; }
        
        return $.getJSON(spotifyUri.album.replace("{id}", albumUri))
            .done(function (result) {
                return result;
            });
    };
	
	spotify.getRelatedArtists = function (artistID) {
		if (!artistID) { return; }
		
		controls.adjustRelated(0); //temporary measure. TODO: animations/load notifier?
		$.getJSON(spotifyUri.related_artists.replace("{id}", artistID),
			function (result) {
				if (!result || !result.artists) {
					relatedArtists = [];
				} else {
					relatedArtists = result.artists;
					spotify.addRelatedArtists();
				}
			});
	};
	
	spotify.addTopTracks = function () {
		controls.clearTopTracks();
		$.each(topTracks, function (index, value) {
			controls.addTopTrack(value);
            if (index + 1 >= defaults.max_tracks) {
                return false;
            }
		});
	};
	
	spotify.addRelatedArtists = function () {
		if (!relatedArtists) { return; }
		var count = 0;
		relatedArtists = $.grep(relatedArtists, function (value, index) {
			return !findHistory(value.uri);
		});
		$.each(relatedArtists, function (index, value) {
			controls.updateArtistSmall($("#" + markups.next_artist + index), value);
            count += 1;
			if (count > 2) { return false; } //max-related
		});
		// console.log(relatedArtists.length);
		controls.adjustRelated(count);
	};
	
	spotify.addSearchResults = function () {
		if (!currentResults) {
			controls.hideSearch();
		} else {
			controls.showSearch();
			$.each(currentResults, function (index, value) {
				//if (index + 1 > defaults.max_results) return false;
				controls.addSearchResultItem(index, value);
			});
		}
	};
	
	spotify.setCurrentArtist = function (value) {
		controls.updateCurrentArtist(value);
			
		if (selectedArtists.length > 1) { //set previous artist
			$("#" + markups.prev_artist).css("visibility", "visible");
			controls.updateArtistSmall($("#" + markups.prev_artist), selectedArtists[selectedArtists.length - 2]);
		} else {
			$("#" + markups.prev_artist).css("visibility", "hidden");
		}
        
		//find related artists
		spotify.getTopTracks(value.uri.replace("spotify:artist:", ""));
		spotify.getRelatedArtists(value.uri.replace("spotify:artist:", ""));
	};
	
	spotify.pushCurrentArtist = function (value) {
		if (value) {
			selectedArtists.push(value);
			spotify.setCurrentArtist(value);
		}
	};
	
	spotify.pushRelatedArtist = function (id) {
		spotify.pushCurrentArtist(relatedArtists[id]);
	};
	
	spotify.pushPrevArtist = function () {
		if (selectedArtists.length > 1) {
			selectedArtists.pop();
			spotify.setCurrentArtist(selectedArtists[selectedArtists.length - 1]);
		}
	};
	
	spotify.gotoResult = function (index) {
		if (currentResults && currentResults.length > 0) {
			spotify.pushCurrentArtist(currentResults[index]);
			controls.hideSearch();
		}
	};
	
})(global, controls, spotify, jQuery);