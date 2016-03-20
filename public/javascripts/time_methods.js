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

        },
        formatDateNumber = function(number) {
            return number < 10 ? "0" + number : number;
        },
        getWorkedHours = function(date) {
            var curent_date = new Date(),
            weeks,
            days = curent_date.getDate();
            weeks = Math.floor(days / 7);
            console.log(weeks)
        },
        sumUpTimeSpentInWorkInCurrentMonth = function(presences) {
            var i, length = presences.length,
                become_present,
                become_absent,
                sum = 0;
            getWorkedHours();
            for (i = 0; i < length; i += 1) {
                become_present = presences[i].become_present || "00:00:00";
                become_absent = presences[i].become_absent || "23:59:59";
                sum += parseDateToSeconds(become_absent) - parseDateToSeconds(become_present);
            }
            return sum;
        };

    exports.calculateTodayWorkTimeLeft = function(presence) {
        var current_time = new Date().toTimeString().split(" ")[0],
            presence_time,
            diff,
            hours,
            minutes,
            seconds;
        current_time = parseDateToSeconds(current_time);
        presence_time = parseDateToSeconds(presence.become_present);
        diff = 8 * 3600 - (current_time - presence_time);
        hours = formatDateNumber(Math.floor(diff / 3600));
        minutes = formatDateNumber(Math.floor((diff % 3600) / 60));
        seconds = formatDateNumber(diff % 60);
        return hours + ":" + minutes + ":" + seconds;
    };
    exports.formatDate = function(date_object) {
        var day = date_object.getDate(),
            month = date_object.getMonth() + 1;
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        return date_object.getFullYear() + "-" + month + "-" + day;
    };

    exports.getCurrentMonth = function() {
        return formatDateNumber(new Date().getMonth() + 1);
    };



    exports.calcuteMonthTimeLeft = function(presences) {
        sumUpTimeSpentInWorkInCurrentMonth(presences);
    };
}());