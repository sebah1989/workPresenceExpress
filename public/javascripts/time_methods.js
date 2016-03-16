/*jslint unparam: true, node: true */
/*globals require, exports, setInterval, Buffer */
(function() {
    "use strict";
    var parseDateToSeconds = function(passed_date) {
    	var splited = passed_date.split(":");
    	if (splited.length === 3) {
    		return parseInt(splited[0], 10) * 60 * 60 + parseInt(splited[1], 10) * 60 + parseInt(splited[2], 10);
    	}
    	return 0;

    };
    exports.calculateTodayWorkTimeLeft = function(presence) {
    	var current_time = new Date().toTimeString().split(" ")[0],
    	presence_time,
    	diff;
    	current_time = parseDateToSeconds(current_time);
    	presence_time = parseDateToSeconds(presence.become_present);
    	diff = 8 * 3600 - (current_time - presence_time);
    	return Math.floor(diff / 3600) + ":" + (Math.floor((diff % 3600) / 60)) + ":" + (diff % 60);
    }
}());