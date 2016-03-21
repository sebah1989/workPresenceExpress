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
        getWorkedHoursFromModulo = function(first_day, modulo_days) {
            var sum = first_day + modulo_days;
            if (first_day !== 6 && first_day !== 0) {
                if (sum < 7) {
                    return modulo_days * 8;
                }
                if (sum === 7) {
                    return (modulo_days - 1) * 8;
                }
                return (modulo_days - 2) * 8;
            }
            if (first_day === 0) {
                modulo_days -= 1;
            } else if (first_day === 6) {
                modulo_days -= 2;
            }
            modulo_days = modulo_days < 0 ? 0 : modulo_days;
            return modulo_days * 8;
        },
        getHoursTimeShouldBeWorked = function() {
            var current_date = new Date(),
                modulo_days,
                modulo_hours,
                weeks,
                first_day,
                days = current_date.getDate();
            weeks = Math.floor(days / 7);
            modulo_days = days % 7;
            first_day = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDay();
            modulo_hours = getWorkedHoursFromModulo(first_day, modulo_days);
            return (weeks * 40 + modulo_hours) * 3600;
        },
        sumUpTimeSpentInWorkInCurrentMonth = function(presences) {
            var i, length = presences.length,
                become_present,
                become_absent,
                sum = 0;
            for (i = 0; i < length; i += 1) {
                become_present = presences[i].become_present || "00:00:00";
                become_absent = presences[i].become_absent || "23:59:59";
                sum += parseDateToSeconds(become_absent) - parseDateToSeconds(become_present);
            }
            return sum;
        },
        formatTime = function(seconds) {
            var sign = "",
                hours,
                minutes;
            if (seconds < 0) {
                seconds = Math.abs(seconds);
                sign = "-";
            }
            hours = formatDateNumber(Math.floor(seconds / 3600));
            minutes = formatDateNumber(Math.floor((seconds % 3600) / 60));
            seconds = formatDateNumber(seconds % 60);
            return sign + hours + ":" + minutes + ":" + seconds;
        };

    exports.calculateTodayWorkTimeLeft = function(presence) {
        var current_time = new Date().toTimeString().split(" ")[0],
            presence_time,
            diff;
        current_time = parseDateToSeconds(current_time);
        presence_time = parseDateToSeconds(presence.become_present);
        diff = 8 * 3600 - (current_time - presence_time);
        return formatTime(diff);
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
        var should_be_worked = getHoursTimeShouldBeWorked(),
            actualy_worked = sumUpTimeSpentInWorkInCurrentMonth(presences);
        return {
            should_be_worked: formatTime(should_be_worked),
            actualy_worked: formatTime(actualy_worked),
            missing_time_in_work: formatTime(should_be_worked - actualy_worked)
        };
    };
}());