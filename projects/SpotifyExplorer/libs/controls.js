(function (global, controls, $) {
	//helper functions
	function capitalize(textToFix) {
		return (!textToFix)?"N/A":textToFix.replace(/\b\w/g, function(l) { return l.toUpperCase()});
	}
	
	function getSmallestImage(value) {
		return (value == null || value.length == 0)?"":value[value.length - 1]["url"];
	}
	
	function getMidImage(value) {
		if (!value || value.length == 0) {
			return ""
		}
		else if (value.length == 1) {
			return value[0]["url"];
		}
		else
		{
			return value[value.length - 2]["url"];
		}
	}
	
	//Top tracks - related functions
	controls.clearTopTracks = function() {
		$("." + markups.item_tracks).empty();
	}
	
	controls.togglePlay = function(action, uri) {
		// action can be play or pause
		var player = $("#" + markups.audio_player);
		
		switch (action)
		{
			case "play":
								player.trigger("pause");				
					player.attr("src",uri);
					player.trigger("load");
					
					player.on("loadeddata", function () {
						player.trigger("play"); //play the new track
						player.animate({volume: 1}, 800);
					});
				player.stop(true).animate({volume: 0}, 500, function() { //lower volume, then change tracks

				});
				break;
			case "pause":
				player.stop(true).animate({volume: 0}, 800, function() {
					player.trigger("pause");
				});
				break;
			default:
		}
	}
	
	controls.makeStar = function(target, popularity) { //popularity in base 100
		var pop = Math.round(popularity / 20); //converts to base 5
		// var target = $("#" + parentName);
		target.empty();
		for (var i = 0; i < 5; i++) {
			if (i <= pop) {
				$("<span />", {
					"class":"glyphicon glyphicon-star",
					"aria-hidden":"true"
				}).appendTo(target);
			}
			else {
				$("<span />", {
					"class":"glyphicon glyphicon-star-empty",
					"aria-hidden":"true"
				}).appendTo(target);
			}
		}
	}
	
	controls.updateCurrentArtist = function(params) {
		controls.togglePlay("pause");
		
		var target = $("#" + markups.current_artist);
		
		target.find(".item_url").attr("href", params["external_urls"]["spotify"]);
		target.find(".current_img").attr("src", getMidImage(params["images"]));
		target.find(".item_name").text(params["name"] + " ");
		target.find(".item_genres").text("Genres: " + capitalize(params["genres"].toString()));
		target.find(".item_followers").text(params["followers"]["total"] + " followers");
		
		controls.makeStar(target.find("#artist-pop"), params["popularity"]);
		
		target.css("visibility", "visible");		
	}
	
	controls.updateArtistSmall = function(target, params) {
		if (params) {
			target.find(".item_img").attr("src", getSmallestImage(params["images"]));
			target.find(".item_name").text(params["name"] + " ");
			target.find(".item_genres").text(capitalize(params["genres"].toString()));
			controls.makeStar(target.find("#artist-pop"), params["popularity"]);
		}
	}
	
	controls.addSearchResultItem = function(id, params) {	
		if (params) {
			var list = $("<li />").appendTo($("#" + markups.results_box));
			var item = $("<a />", {
				"class": markups.search_item, // + " list-group-item",
				"id": markups.search_id + id,
				"href": "#"
				}).appendTo(list);
			
			var wrapper = $("<div />", {
				"class": "row"
				}).appendTo(item);
			
			//note to self: don't use "data": id attribute - will cause this to not work. Should use data-id instead as per specs
			
			$("<img />", { //img
				"class": "item_img col-md-5 pull-left item_img",
				}).appendTo(wrapper);
			
			var content = $("<div />", {
				"class": "col-md-7"
				}).appendTo(wrapper);
			
			var head = $("<h4 />", { //name div
				"class": "media-heading",
				}).appendTo(content);
				
			$("<span />", {
				"class": "item_name"
			}).appendTo(head);
			
			var stars = $("<span />", {
				"class": "badge",
				"id": "artist-pop"
			}).appendTo(head);
			
			$("<div />", { //genres div
				"class": "item_genres",
				}).appendTo(content);
				
			controls.updateArtistSmall(item, params);
									
			item.on("click", function() {
				spotify.gotoResult(id);
			});
		}
	}	
	
	controls.clearResultBox = function() {
		$("#" + markups.results_box).empty();
	}
		
	controls.showSearch = function() {
		$("#" +markups.results_box).show("fast")
	}
	
	controls.hideSearch = function() {
		$("#" +markups.results_box).hide("fast")
	}
	
	controls.adjustRelated = function(count) {
		for (var i = 0; i <= 2; i++) {
			if (i + 1 <= count) {
				$("#" + markups.next_artist + i).css("visibility", "visible");	
				if (i > 0) {
					$("#" + markups.next_artist + i).show("fast");
				}
			}
			else {
				if (i > 0) {
					$("#" + markups.next_artist + i).hide("fast");
				}
				else {
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
	}
	
	window.onclick = function(event) {
		if (!event.target.matches("#" + markups.search_box)) {
			controls.hideSearch();
		}
	}
	
	controls.addTopTrack = function(params) {
		var item = $("<li />", {
			"class":"item-indi-track"
		}).appendTo($("." + markups.item_tracks));
		
		var wrapper = $("<div />", {			
		}).appendTo(item);
		
		var btn = $("<div />", {
			"class":"track-btn",
			"data-location":params["preview_url"]
		}).appendTo(wrapper);
		
		$("<span />", {
			"class":"glyphicon glyphicon-play",
			"aria-hidden":"true"
		}).appendTo(btn);
		
		$("<a />", {
			"href":"#",
			"text":params["name"],
		}).appendTo(wrapper);
		
		// audio preview controls
		
		btn.on("click", function() {
			var icon = $(this).find("span");
			if (icon.hasClass("glyphicon-play")) { //is not playing
				controls.togglePlay("play", $(this).attr("data-location"));
				
				// change class of all remaining buttons
				$(".track-btn span").removeClass("glyphicon-pause");
				$(".track-btn span").addClass("glyphicon-play");
				
				// change class of current button
				icon.removeClass("glyphicon-play");
				icon.addClass("glyphicon-pause");
			}
			else {				
				controls.togglePlay("pause");
				icon.removeClass("glyphicon-pause");
				icon.addClass("glyphicon-play");
			}
		});
	}
	
	controls.init = function() {
		$("#" + markups.search_box).on("textInput input focusin", function () {
			spotify.searchFor($("#" + markups.search_box).val());
		});
		$("#" + markups.prev_artist).on("click", spotify.pushPrevArtist);
		for (var i = 0; i <= 2; i++) {
			$("#" + markups.next_artist + i).on("click", function() {
				spotify.pushRelatedArtist(this.id.replace(markups.next_artist,""));
			});
		}
		//auto fade out for audio
		var player = $("#" + markups.audio_player);
		player.on("timeupdate", function() {
			// console.log("Remaining: " + Math.round(player.prop("duration") - player.prop("currentTime"),2));
			// HTML5 specs state audio time update fires at intervals of 15-250ms, must account for this deviation by 0.8+0.25
			if (player.prop("duration") - player.prop("currentTime") <= 1.05) {
				controls.togglePlay("pause");
				
				$(".track-btn span").removeClass("glyphicon-pause");
				$(".track-btn span").addClass("glyphicon-play");
			}
		});
	}
})(global, controls, jQuery)