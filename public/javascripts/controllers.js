/*globals angular, $, alert*/
/*jslint unparam: true, node: true */
(function() {
    "use strict";
    var testApp = angular.module("presenceApp", []),
        getTimeLeft = function($http, ctrl_obj, worker_id) {
            $http.get("/worker/" + worker_id + "/presences/work_time_left").success(function(response) {
                ctrl_obj.work_time_left = response.time_in_work_left || "Absent";
            });
            $http.get("/worker/" + worker_id + "/presences/month_work_time_left").success(function(response) {
                ctrl_obj.month_work_time_left = response;
            });
        },
        updateDaysOff = function(worker_id, $http, workerc) {
            $http.get("/worker/" + worker_id + "/presences/get_worker_days_off").success(function(response) {
                workerc.days_off = response;
            });
        },
        addWorkerDayOff = function(worker_id, day, $http, workerc) {
            if (day === "") {
                alert("You have to select date!");
            } else {
                $.ajax({
                    url: "presences/add_worker_day_off",
                    method: "POST",
                    data: {
                        date: day,
                        worker_id: worker_id
                    }
                }).done(function(response) {
                    updateDaysOff(worker_id, $http, workerc);
                });
            }
        },
        deleteWorkerDayOff = function(day_off_id, worker_id, $http, workerc) {
            $.ajax({
                url: "presences/delete_worker_day_off",
                method: "POST",
                data: {
                    dayoff_id: day_off_id
                }
            }).done(function() {
                updateDaysOff(worker_id, $http, workerc);
            });
        };

    testApp.controller("WorkerPresenceListCtrl", function($scope, $http, $interval) {
        var workerc = this;
        workerc.presences = [];
        workerc.current_selected = 0;
        workerc.tab = 1;
        workerc.interval = null;

        $http.get("/workers").success(function(response) {
            workerc.workers = response;
        });

        workerc.get = function(worker_id) {
            $interval.cancel(workerc.interval);
            workerc.current_selected = worker_id;
            $http.get("/worker/" + worker_id + "/presences").success(function(response) {
                workerc.presences = response;
            });

            $http.get("/worker/" + worker_id + "/presences/became_present").success(function(response) {
                workerc.became_present = response.become_present;
            });

            $http.get("/worker/" + worker_id + "/presences/go_home_hour").success(function(response) {
                workerc.go_home_hour = response.go_home_hour;
            });

            updateDaysOff(worker_id, $http, this);

            getTimeLeft($http, workerc, worker_id);

            $scope.myDate = new Date();

            workerc.interval = $interval(function() {
                getTimeLeft($http, workerc, worker_id);
            }, 1000);
        };

        workerc.addDayOff = function() {
            addWorkerDayOff(this.current_selected, $(".calendar-input").val(), $http, this);
        };

        workerc.deleteDayOff = function(dayoff_id) {
            deleteWorkerDayOff(dayoff_id, this.current_selected, $http, this);
        };
    });
}());