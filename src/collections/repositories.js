define([
    "hr/hr",
    "backends/api",
    "models/repository"
], function(hr, api, Repository) {
    /* Documentation: https://developer.github.com/v3/repos/ */

    var Repositories = hr.Collection.extend({
        model: Repository,

        // Load list of repositories for a user
        loadForUser: function() {
            return api.execute("get:user/repos").then(this.reset.bind(this));
        }
    });

    return Repositories;
});