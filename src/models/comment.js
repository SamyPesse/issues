define([
    "hr/hr",
    "backends/api"
], function(hr, api) {
    /* Documentation: https://developer.github.com/v3/issues/comments/ */

    var Comment = hr.Model.extend({
        defaults: {

        }
    });

    return Comment;
});