/*jslint unparam: true, node: true */
/*globals require, exports */
(function() {
    "use strict";
    var express = require('express'),
        t_methods = require("../public/javascripts/time_methods.js"),
        router = express.Router({
            mergeParams: true
        }),
        db = require('../public/javascripts/db');

    router.get('/', function(req, res, next) {
        db.getWorkerPresences(req.params.worker_id).then(function(result) {
            res.send(result);
        }).catch(
            function() {
                res.send([]);
            });

    });

    router.get('/all', function(req, res) {
        db.getPresences().then(function(result) {
            res.send(result);
        }).catch(
            function() {
                res.send([]);
            });
    });

    router.get('/go_home_hour', function(req, res) {
        db.goHomeHour(req.params.worker_id).then(function(result) {
            res.send(result);
        }).catch(
            function() {
                res.send([]);
            });
    });

    router.get('/work_time_left', function(req, res) {
        db.getWorkerBecamePresent(req.params.worker_id).then(function(result) {
            res.send({
                "time_in_work_left": t_methods.calculateTodayWorkTimeLeft(result)
            });
        }).catch(
            function(error) {
                console.log(error)
                res.send([]);
            });
    });

    router.get('/month_work_time_left', function(req, res) {
        db.getWorkerPresencesFromGivenMonth(t_methods.getCurrentMonth(), req.params.worker_id).then(function(presences) {
            db.getWorkerDaysOff(req.params.worker_id).then(function(daysoff) {
                res.send(t_methods.calculateMonthTimeLeft(presences, daysoff));
            })
        }).catch(
            function(error) {
                console.log(error)
                res.send([]);
            });
    });

    router.get('/became_present', function(req, res) {
        db.getWorkerBecamePresent(req.params.worker_id).then(function(result) {
            res.send(result[0]);
        }).catch(
            function(error) {
                console.log(error)
                res.send([]);
            });
    });

    router.post('/add_worker_day_off', function(req, res) {
        db.addWorkerDayOff(req.body.date, req.body.worker_id).then(function(result) {
            res.send(result);
        }).catch(function(error) {
            res.send(error);
        });
    });

    router.get('/get_worker_days_off', function(req, res) {
        db.getWorkerDaysOff(req.params.worker_id).then(function(result) {
            res.send(result);
        }).catch(function(error) {
            res.send([]);
        })
    });

    router.post('/delete_worker_day_off', function(req, res) {
        db.deleteWorkerDayOff(req.body.dayoff_id).then(function(result) {
            res.send(result);
        }).catch(function(error) {
            res.send(error);
        });
    });

    module.exports = router;
}());