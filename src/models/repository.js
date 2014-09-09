define([
    "hr/hr",
    "backends/api"
], function(hr, api) {
    /* Documentation: https://developer.github.com/v3/repos/ */

    var Repository = hr.Model.extend({
        defaults: {

        }
    });

    return Repository;
});