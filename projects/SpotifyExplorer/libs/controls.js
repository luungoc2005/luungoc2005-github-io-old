(function (global, controls, $) {
	//helper functions
    function getDuration(duration_ms) {
        var mins = Math.floor(duration_ms / 60000);
        var secs = Math.floor(duration_ms / 1000 - mins * 60);
        if (secs < 10) { secs = "0" + secs; }
        return mins + ":" + secs;
    }
    
	function capitalize(textToFix) {
		return (!textToFix) ? "N/A" : textToFix.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
	}
	
	function getSmallestImage(value) {
		return (!value || value.length === 0) ? "" : value[value.length - 1].url;
	}
	
	function getMidImage(value) {
		if (!value || value.length === 0) {
			return "";
		} else if (value.length === 1) {
			return value[0].url;
		} else {
			return value[value.length - 2].url;
		}
	}
	
	//Top tracks - related functions
	controls.clearTopTracks = function () {
		$("." + markups.item_tracks).empty();
	};
	
	controls.togglePlay = function (action, uri) {
		// action can be play or pause
		var player = $("#" + markups.audio_player);
		
		switch (action) {
        case "play":
            player.stop(true).animate({volume: 0}, 500, function () { //lower volume, then change tracks
                player.trigger("pause");
                player.attr("src", uri);
                player.trigger("load"); // could be unneeded but better be safe than sorry?

                player.on("loadeddata", function () {
                    player.trigger("play"); //play the new track
                    player.animate({volume: 1}, 800);
                });
            });
            break;
        case "pause":
            player.stop(true).animate({volume: 0}, 800, function () {
                player.trigger("pause");
            });
            break;
        default:
		}
	};
	
	controls.makeStar = function (target, popularity) { //popularity in base 100
		var pop = Math.round(popularity / 20),  //converts to base 5
            i;
		target.empty();
		for (i = 0; i < 5; i += 1) {
			if (i <= pop) {
				$("<span />", {
					"class" : "glyphicon glyphicon-star",
					"aria-hidden" : "true"
				}).appendTo(target);
			} else {
				$("<span />", {
					"class" : "glyphicon glyphicon-star-empty",
					"aria-hidden" : "true"
				}).appendTo(target);
			}
		}
	};
	
	controls.updateCurrentArtist = function (params) {
		controls.togglePlay("pause");
		
		var target = $("#" + markups.current_artist);
		
		target.find(".item_url").attr("href", params.external_urls.spotify);
		target.find(".current_img").attr("src", getMidImage(params.images));
		target.find(".item_name").text(params.name + " ");
		target.find(".item_genres").text("Genres: " + capitalize(params.genres.toString()));
		target.find(".item_followers").text(params.followers.total + " followers");
		
		controls.makeStar(target.find("#artist-pop"), params.popularity);
		
		target.css("visibility", "visible");
	};
	
	controls.updateArtistSmall = function (target, params) {
		if (params) {
			target.find(".item_img").attr("src", getSmallestImage(params.images));
			target.find(".item_name").text(params.name + " ");
			target.find(".item_genres").text(capitalize(params.genres.toString()));
			controls.makeStar(target.find("#artist-pop"), params.popularity);
		}
	};
	
	controls.addSearchResultItem = function (id, params) {
		if (params) {
			var list = $("<li />").appendTo($("#" + markups.results_box)),
                
                item = $("<a />", {
				    "class": markups.search_item, // + " list-group-item",
				    "id": markups.search_id + id,
				    "href": "#"
				}).appendTo(list),
                
                wrapper = $("<div />", {
				    "class" : "row"
				}).appendTo(item),
                //note to self: don't use "data": id attribute - will cause this to not work. Should use data-id instead as per specs
                
                content = $("<div />", {
				    "class" : "col-md-7"
				}).appendTo(wrapper),
                
                head = $("<h4 />", { //name div
				    "class" : "media-heading"
				}).appendTo(content),
                
                stars = $("<span />", {
				    "class": "badge",
				    "id": "artist-pop"
                }).appendTo(head);
			
			$("<img />", { //img
				"class": "item_img col-md-5 pull-left item_img"
            }).prependTo(wrapper);
				
			$("<span />", {
				"class": "item_name"
			}).prependTo(head);
			
			$("<div />", { //genres div
				"class": "item_genres"
            }).appendTo(content);
				
			controls.updateArtistSmall(item, params);
									
			item.on("click", function () {
				spotify.gotoResult(id);
			});
		}
	};
	
	controls.clearResultBox = function () {
		$("#" + markups.results_box).empty();
	};
		
	controls.showSearch = function () {
		$("#" + markups.results_box).show("fast");
	};
	
	controls.hideSearch = function () {
		$("#" + markups.results_box).hide("fast");
	};
	
	controls.adjustRelated = function (count) {
        var i;
		for (i = 0; i <= 2; i += 1) {
			if (i + 1 <= count) {
				$("#" + markups.next_artist + i).css("visibility", "visible");
				if (i > 0) {
					$("#" + markups.next_artist + i).show("fast");
				}
			} else {
				if (i > 0) {
					$("#" + markups.next_artist + i).hide("fast");
				} else {
					$("#" + markups.next_artist + i).css("visibility", "hidden");
				}
			}
			//remove all offsets
			$("#" + markups.next_artist + i).removeClass("col-md-offset-2");
			$("#" + markups.next_artist + i).removeClass("col-md-offset-4");
		}
		switch (count) {
        case 1:
            $("#" + markups.next_artist + "0").addClass("col-md-offset-4");
            break;
        case 2:
            $("#" + markups.next_artist + "0").addClass("col-md-offset-2");
            break;
        default:
		}
	};
	
	window.onclick = function (event) {
		if (!event.target.matches("#" + markups.search_box)) {
			controls.hideSearch();
		}
	};
	
	controls.addDetailsPopup = function (target, params) {
		var wrapper = $("<div />"),
            
            innerWrapper = $("<div />", {
                "class" : "media"
            }).appendTo(wrapper),

            // Album image
            imgWrapper = $("<div />", {
                "class" : "media-left"
            }).appendTo(innerWrapper),
            
            content = $("<div />", {
                "class": "media-body",
                "style": "white-space: nowrap; "
			}).appendTo(innerWrapper),
            
            head = $("<h4 />", { //name div
                "class": "media-heading",
                "text": params.name + " "
			}).appendTo(content),
            
            stars = $("<span />", {
                "class": "badge",
                "id": "artist-pop"
            }).appendTo(head);
		
		$("<img />", {
			"class" : "media-object track_img",
			"src" : getSmallestImage(params.album.images)
		}).appendTo(imgWrapper);
		// =====
			
		// Track title			
		$("<span />", {
			"class": "item_name"
		}).appendTo(head);
		
		controls.makeStar(stars, params.popularity);
		
		// Track description
        $("<div />", {
            "text" : "Duration: " + getDuration(params.duration_ms)
        }).appendTo(content);
        
        $("<div />", {
            "text" : "Album: " + params.album.name
        }).appendTo(content);
        
        spotify.getAlbum(params.album.uri.replace("spotify:album:","")).done(function (albumObj) {
            if (albumObj) {
                $("<div />", {
                    "text" : "Release: " + new Date(albumObj.release_date).toLocaleDateString()
                }).appendTo(content);

                $("<div />", {
                    "text" : albumObj.copyrights[0].text
                }).appendTo(content);
            }
            
            // append to target
            target.attr("tabindex", "0");
            target.attr("role", "button");
            target.data("container", ".item-tracks");
            target.data("toggle", "popover");
            target.data("placement", "top");
            target.data("content", wrapper.html());
            target.popover({
                "html" : true,
                "trigger" : "focus"
            });
        });
	};
	
	controls.addTopTrack = function (params) {
		var item = $("<div />", {
				"class" : "item-indi-track list-group-item"
			}).appendTo($("." + markups.item_tracks)),
            
            wrapper = $("<div />").appendTo(item),
            
            btn = $("<div />", {
                "class" : "track-btn",
                "data-location" : params.preview_url
            }).appendTo(wrapper),
            
            audioLink = $("<a />", {
                "class" : "margin-left-10",
                "text" : params.name
            }).appendTo(wrapper);
		
		$("<span />", {
			"class" : "glyphicon glyphicon-play",
			"aria-hidden" : "true"
		}).appendTo(btn);
		
		// audio preview controls
		
		btn.on("click", function () {
			var icon = $(this).find("span");
			if (icon.hasClass("glyphicon-play")) { //is not playing
				controls.togglePlay("play", $(this).attr("data-location"));
				
				// change class of all remaining buttons
				$(".track-btn span").removeClass("glyphicon-pause");
				$(".track-btn span").addClass("glyphicon-play");
				
				// change class of current button
				icon.removeClass("glyphicon-play");
				icon.addClass("glyphicon-pause");
			} else {
				controls.togglePlay("pause");
				icon.removeClass("glyphicon-pause");
				icon.addClass("glyphicon-play");
			}
		});
		
		// add popup
		controls.addDetailsPopup(audioLink, params);
	};
	
	controls.init = function () {
        var i,
            btnRelatedClick = function () {
				spotify.pushRelatedArtist(this.id.replace(markups.next_artist, ""));
            },
            player = $("#" + markups.audio_player);
        
		$("#" + markups.search_box).on("textInput input focusin", function () {
			spotify.searchFor($("#" + markups.search_box).val());
		});
		$("#" + markups.prev_artist).on("click", spotify.pushPrevArtist);
        
		for (i = 0; i <= 2; i += 1) {
			$("#" + markups.next_artist + i).on("click", btnRelatedClick);
		}
        
		//auto fade out for audio
		player.on("timeupdate", function () {
			// console.log("Remaining: " + Math.round(player.prop("duration") - player.prop("currentTime"),2));
			// HTML5 specs state audio time update fires at intervals of 15-250ms, must account for this deviation by 0.8+0.25
			if (player.prop("duration") - player.prop("currentTime") <= 1.05) {
				controls.togglePlay("pause");
				
				$(".track-btn span").removeClass("glyphicon-pause");
				$(".track-btn span").addClass("glyphicon-play");
			}
		});
	};
})(global, controls, jQuery);