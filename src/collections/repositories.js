define([
    "hr/hr",
    "hr/utils",
    "hr/promise",
    "backends/api",
    "models/repository"
], function(hr, _, Q, api, Repository) {
    /* Documentation: https://developer.github.com/v3/repos/ */

    var Repositories = hr.Collection.extend({
        model: Repository,
        comparator: function(m) {
            return -m.get("open_issues_count");
        },

        // Load list of repositories for a user
        loadForUser: function() {
            var that = this;

            return api.execute("get:user/repos")
            .then(function(repos) {
                that.reset(repos);

                return api.execute("get:user/orgs");
            })
            .then(function(orgs) {
                return _.reduce(orgs, function(prev, org) {
                    return prev.then(function() {
                        return api.execute("get:orgs/"+org.login+"/repos")
                    })
                    .then(function(repos) {
                        that.add(repos);
                    });
                }, Q())
            });
        }
    });

    return Repositories;
});