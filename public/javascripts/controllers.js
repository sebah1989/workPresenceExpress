/*globals angular */
/*jslint unparam: true, node: true */
(function() {
    "use strict";
    var testApp = angular.module("presenceApp", []),
        getTimeLeft = function($http, ctrl_obj, worker_id) {
            $http.get("/worker/" + worker_id + "/presences/work_time_left").success(function(response) {
                ctrl_obj.work_time_left = response.time_in_work_left;
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

            $http.get("/worker/" + worker_id + "/presences/month_work_time_left").success(function(response) {
                workerc.month_work_time_left = response;
            });

            getTimeLeft($http, workerc, worker_id);

            workerc.interval = $interval(function() {
                getTimeLeft($http, workerc, worker_id);
            }, 1000);
        };
    });
}());