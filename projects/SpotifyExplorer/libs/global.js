var spotify = spotify || {};
var animations = animations || {};
var global = global || {};
var controls = controls || {};

(function (global, $) {
	defaults = { // constants
		max_results: 6
	}

	markups = { // HTML tag IDs
		search_box: "searchBox",
		results_box: "searchResults",
		search_item: "search-item",
		search_id: "search-id-",
		current_artist: "current-artist",
		next_artist: "next-artist-",
		prev_artist: "prev-artist",
		hide_info: "hiddenInfo"
	}
})(global, jQuery)
