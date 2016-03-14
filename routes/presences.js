/*jslint unparam: true, node: true */
/*globals require, exports */

(function() {
    "use strict";
    var express = require('express'),
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

    module.exports = router;
}());