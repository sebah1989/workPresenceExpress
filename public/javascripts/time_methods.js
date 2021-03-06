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
        formatTimeFromDate = function(date_object) {
            var hours, minutes, seconds;
            hours = formatDateNumber(date_object.getHours());
            minutes = formatDateNumber(date_object.getMinutes());
            seconds = formatDateNumber(date_object.getSeconds());
            return hours + ":" + minutes + ":" + seconds;
        },
        formatDate = function(date_object) {
            var day = date_object.getDate(),
                month = date_object.getMonth() + 1;
            day = day < 10 ? "0" + day : day;
            month = month < 10 ? "0" + month : month;
            return date_object.getFullYear() + "-" + month + "-" + day;
        },
        getCurrentMonth = function() {
            return formatDateNumber(new Date().getMonth() + 1);
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
                sum = 0,
                presence,
                current_date = new Date();
            for (i = 0; i < length; i += 1) {
                presence = presences[i];
                become_present = presence.become_present || "00:00:00";
                if (presence.become_absent === null && presence.workday === formatDate(current_date)) {
                    become_absent = formatTimeFromDate(current_date);
                } else {
                    become_absent = presence.become_absent || "23:59:59";
                }
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
        },
        calculateGoOutIncludingMonthBalance = function(should_be_worked, actualy_worked) {
            var out_including_balance = new Date(Date.now() + (should_be_worked * 1000 - actualy_worked * 1000)),
                formatted_date = formatDate(out_including_balance),
                formatted_time = formatTimeFromDate(out_including_balance);
            if (formatDate(new Date()) !== formatted_date) {
                return formatted_date + " " + formatted_time;
            }
            return formatted_time;
        },
        calculateTimeShouldBeSubstractedThisMonth = function(daysoff) {
            var i, length = daysoff.length, month, current_month = getCurrentMonth(), time_to_substract = 0;
            for (i = 0; i < length; i += 1) {
                month = daysoff[i].workday.split("-")[1];
                if (month === current_month) {
                    time_to_substract += 28800;
                }
            }
            return time_to_substract;
        };

    exports.calculateTodayWorkTimeLeft = function(presences) {
        var current_time = new Date().toTimeString().split(" ")[0],
            presence_time,
            presence,
            diff;
        if (presences === undefined) {
            return "";
        }
        if (presences.length === 1) {
            presence = presences[0];
        }
        current_time = parseDateToSeconds(current_time);
        presence_time = parseDateToSeconds(presence.become_present);
        diff = 8 * 3600 - (current_time - presence_time);
        return formatTime(diff);
    };

    exports.getCurrentMonth = getCurrentMonth;

    exports.formatDate = formatDate;

    exports.calculateMonthTimeLeft = function(presences, daysoff) {
        var actualy_worked = sumUpTimeSpentInWorkInCurrentMonth(presences),
            days_off = calculateTimeShouldBeSubstractedThisMonth(daysoff),
            should_be_worked = getHoursTimeShouldBeWorked() - days_off;
        return {
            should_be_worked: formatTime(should_be_worked),
            actualy_worked: formatTime(actualy_worked),
            missing_time_in_work: formatTime(should_be_worked - actualy_worked),
            days_off: daysoff,
            go_home_hour_including_month_balance: calculateGoOutIncludingMonthBalance(should_be_worked, actualy_worked)
        };
    };

    exports.checkIfWeekday = function(date) {
        var splited_date = date.split("-"),
            created_date;
        if (splited_date.length !== 3) {
            return false;
        }
        created_date = new Date(splited_date[2], splited_date[1] - 1, splited_date[0]);
        return [0, 6].indexOf(created_date.getDay()) === -1;
    };
}());