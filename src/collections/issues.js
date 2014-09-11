define([
    "hr/hr",
    "hr/utils",
    "hr/promise",
    "backends/api",
    "models/issue"
], function(hr, _, Q, api, Issue) {
    /* Documentation: https://developer.github.com/v3/repos/ */

    var Issues = hr.Collection.extend({
        model: Issue,

        // Load list of issues for a repo
        loadForRepo: function(repo, filter) {
            return api.execute("get:repos/"+repo+"/issues", filter).then(this.reset.bind(this));
        }
    });

    return Issues;
});