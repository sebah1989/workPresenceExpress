/*jslint unparam: true, node: true */
/*globals require, exports, Promise */
(function() {
    "use strict";
    var connection,
        sqlite3 = require('sqlite3').verbose();

    exports.makeConnection = function(e) {
        connection = new sqlite3.Database('./db/workers.db');
        return connection;
    };

    exports.getWorkers = function(e) {
        return new Promise(function(fullfill, reject) {
            connection.all("SELECT id, name, surname FROM workers", function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.getPresences = function(e) {
        return new Promise(function(fullfill, reject) {
            connection.all("SELECT id, become_present, become_absent, workday, worker_id FROM presence", function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.getWorkerPresences = function(worker_id) {
        return new Promise(function(fullfill, reject) {
            connection.all("SELECT become_present, become_absent, workday, worker_id FROM presence WHERE worker_id = ?", [worker_id],
                function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(rows);
                    }
                });
        });
    };

    exports.goHomeHour = function(worker_id) {
        return new Promise(function(fullfill, reject) {
            connection.get("SELECT time(become_present, '+8 hours') as go_home_hour FROM presence WHERE workday = date('now') AND worker_id = ?", [worker_id], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.getWorkerBecamePresent = function(worker_id) {
        return new Promise(function(fullfill, reject) {
            connection.get("SELECT become_present FROM presence WHERE workday = date('now') AND worker_id = ?", [worker_id], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.getWorkerPresencesFromGivenMonth = function(month, worker_id) {
        return new Promise(function(fullfill, reject) {
            connection.all("SELECT become_present, become_absent FROM presence WHERE strftime('%m', workday) = ? AND worker_id = ?", [month, worker_id], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.closeConnection = function(connection) {
        if (connection.open) {
            connection.close(function(e) {
                console.log(e);
            });
        }
    };
}());