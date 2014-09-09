define([
    "hr/hr",
    "hr/utils",
    "hr/promise",
    "backends/api",
    "models/comment"
], function(hr, _, Q, api, Comment) {
    /* Documentation: https://developer.github.com/v3/issues/comments/ */

    var Comments = hr.Collection.extend({
        model: Comment,

        // Load comments for an issue
        loadForIssue: function(repo, issue) {
            return api.execute("get:repos/"+repo+"/issues/"+issue+"/comments").then(this.reset.bind(this));
        }
    });

    return Comments;
});