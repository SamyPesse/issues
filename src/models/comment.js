define([
    "hr/hr",
    "utils/markdown",
    "backends/api"
], function(hr, markdown, api) {
    /* Documentation: https://developer.github.com/v3/issues/comments/ */

    var Comment = hr.Model.extend({
        defaults: {

        }
    });

    return Comment;
});