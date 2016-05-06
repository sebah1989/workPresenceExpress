/*jslint unparam: true, node: true */
/*globals $, document, alert, angular */
(function() {
    "use strict";
    $(document).on("ready", function() {
        $("#date").datepicker({
            format: 'dd-mm-yyyy',
            weekStart: 1
        });
    });
}());