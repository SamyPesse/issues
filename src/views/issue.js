define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "models/issue",
    "views/comments",
    "text!resources/templates/issue.html"
], function(_, $, hr, Issue, CommentsView, templateMain) {

    var IssueView = hr.View.extend({
        className: "issue",
        template: templateMain,
        events: {
            "submit .issue-controls form": "onSubmitComment",
            "keyup .issue-controls textarea": "onKeyupComment"
        },

        initialize: function(options) {
            IssueView.__super__.initialize.apply(this, arguments);

            this.model = new Issue();
            this.comments = new CommentsView({}, this);

            this.listenTo(this.model, "set", this.update);
        },

        templateContext: function() {
            return {
                issue: this.model
            }
        },

        render: function() {
            this.comments.detach();
            this.comments.collection.loadForIssue(hr.app.currentRepo, this.model);
            return IssueView.__super__.render.apply(this, arguments);
        },
        finish: function() {
            this.comments.$el.appendTo(this.$(".issue-comments"));
            return IssueView.__super__.finish.apply(this, arguments);
        },

        // When the current issue change
        onIssueChange: function(issue) {
            return this.model.loadByNumber(hr.app.currentRepo, issue);
        },

        // When submiting comment form
        onSubmitComment: function(e) {
            if (e) e.preventDefault();

            this.model.postComment(this.$(".issue-controls textarea").val())
            .then(this.update.bind(this))
            .fail(alert);
        },

        // When typing in the comment area
        onKeyupComment: function(e) {
            this.$(".issue-controls .action-close").text(($(e.currentTarget).val().length > 0)? "Close and comment" : "Close issue");
        }
    });

    return IssueView;
});