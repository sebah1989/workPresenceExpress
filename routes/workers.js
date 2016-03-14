/*jslint unparam: true, node: true */
/*globals require, exports */

(function() {
    "use strict";
    var express = require('express'),
        router = express.Router(),
        db = require('../public/javascripts/db');

    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

    router.get('/workers', function(req, res, next) {
        db.getWorkers().then(function(result) {
            res.send(result);
        }).catch(
            function() {
                res.send([]);
            });
    });

    router.post('/', function(req, res, next) {
        res.render('index', {
            title: 'Post request'
        });
    });

    module.exports = router;
}());