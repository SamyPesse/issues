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
            var that = this;

            return api.execute("get:repos/"+repo+"/issues/"+issue.id+"/comments")
            .then(function(comments) {
                comments.unshift({
                    "id": 0,
                    "html_url": issue.get("html_url"),
                    "body": issue.get("body"),
                    "user": issue.get("user"),
                    "created_at": issue.get("created_at"),
                    "updated_at": issue.get("updated_at")
                });

                that.reset(comments);
            });
        }
    });

    return Comments;
});