define([
    "hr/hr",
    "backends/api"
], function(hr, api) {
    /* Documentation: https://developer.github.com/v3/issues/ */

    var Issue = hr.Model.extend({
        idAttribute: "number",
        defaults: {

        },

        // Return repo id for this issue
        repoId: function() {
            var url = this.get("url");
            url = url.split("/");
            return url[4]+"/"+url[5];
        },

        // Load a specific issue
        loadByNumber: function(repo, issue) {
            return api.execute("get:repos/"+repo+"/issues/"+issue).then(this.set.bind(this));
        },

        // Post a comment on an issue
        postComment: function(body) {
            return api.execute("post:repos/"+this.repoId()+"/issues/"+this.id+"/comments", {
                'body': body
            });
        }
    });

    return Issue;
});