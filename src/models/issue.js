define([
    "hr/hr",
    "backends/api"
], function(hr, api) {
    /* Documentation: https://developer.github.com/v3/issues/ */

    var Issue = hr.Model.extend({
        idAttribute: "number",
        defaults: {

        },

        // Load a specific issue
        loadByNumber: function(repo, issue) {
            return api.execute("get:repos/"+repo+"/issues/"+issue).then(this.set.bind(this));
        }
    });

    return Issue;
});