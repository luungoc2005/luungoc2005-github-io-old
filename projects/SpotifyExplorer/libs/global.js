var spotify = spotify || {},
    animations = animations || {},
    global = global || {},
    controls = controls || {};

(function (global, $) {
	defaults = { // constants
		max_results: 6,
        max_tracks: 5
	};

	markups = { // HTML tag IDs
		search_box: "searchBox",
		results_box: "searchResults",
		search_item: "search-item",
		search_id: "search-id-",
		current_artist: "current-artist",
		next_artist: "next-artist-",
		prev_artist: "prev-artist",
		hide_info: "hiddenInfo",
		item_tracks: "item-tracks",
		audio_player: "player"
	};
})(global, jQuery);
