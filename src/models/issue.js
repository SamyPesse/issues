define([
    "hr/hr",
    "backends/api"
], function(hr, api) {
    /* Documentation: https://developer.github.com/v3/issues/ */

    var Issue = hr.Model.extend({
        idAttribute: "number",
        defaults: {

        }
    });

    return Issue;
});