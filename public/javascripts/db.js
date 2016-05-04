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
            connection.all(
                "SELECT become_present, become_absent, workday, worker_id, time(strftime('%s', become_absent) - strftime('%s', become_present), 'unixepoch')" +
                " as difference FROM presence WHERE worker_id = ?", [worker_id],
                function(err, rows) {
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
            connection.all("SELECT become_present, become_absent FROM presence WHERE workday = date('now') AND worker_id = ?", [worker_id], function(err, rows) {
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
            connection.all("SELECT become_present, become_absent, workday FROM presence WHERE strftime('%m', workday) = ? AND worker_id = ?", [month, worker_id], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.addWorkerDayOff = function(date, worker_id) {
        return new Promise(function(fullfill, reject) {
            connection.run("INSERT INTO dayoff(workday, worker_id) VALUES (?, ?)", [date, worker_id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    fullfill("OK");
                }
            });
        });
    };

    exports.getWorkerDaysOff = function(worker_id) {
        return new Promise(function(fullfill, reject) {
            connection.all("SELECT id, workday FROM dayoff WHERE worker_id = ?", worker_id, function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    fullfill(rows);
                }
            });
        });
    };

    exports.deleteWorkerDayOff = function(dayoff_id) {
        return new Promise(function(fullfill, reject) {
            connection.run("DELETE FROM dayoff WHERE id = ?", dayoff_id, function(err) {
                if (err) {
                    reject(err);
                } else {
                    fullfill("OK");
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