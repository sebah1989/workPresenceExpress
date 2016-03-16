/*jslint unparam: true, node: true */
/*globals require, exports */
(function() {
    "use strict";
    var express = require('express'),
        t_methods = require("../public/javascripts/time_methods.js"),
        router = express.Router({
            mergeParams: true
        }),
        db = require('../public/javascripts/db'),
        getWorkTimeLeft = function(presence) {
            var today = new Date(),
            hours = today.getHours(),
            minutes = today.getMinutes(),
            seconds = today.getSeconds();
            console.log(Math.abs((hours + ":" + minutes + ":" + seconds) - presence.become_present));
        };

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
        db.getWorkerBecomePresent(req.params.worker_id).then(function(result) {
            res.send({"time_in_work_left": t_methods.calculateTodayWorkTimeLeft(result)});
        }).catch(
            function(error) {
                console.log(error)
                res.send([]);
            });
    });

    module.exports = router;
}());