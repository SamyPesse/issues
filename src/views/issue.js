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
            "click .action-toggle": "onToggleIssue",
            "submit .issue-controls form": "onSubmitComment",
            "keyup .issue-controls textarea": "onKeyupComment"
        },

        initialize: function(options) {
            IssueView.__super__.initialize.apply(this, arguments);

            this.model = new Issue();
            this.comments = new CommentsView({}, this);

            this.listenTo(this.model, "set clear", this.update);
        },

        templateContext: function() {
            return {
                issue: this.model
            }
        },

        render: function() {
            this.comments.detach();
            if (this.model.get("id")) this.comments.collection.loadForIssue(hr.app.currentRepo, this.model);
            return IssueView.__super__.render.apply(this, arguments);
        },
        finish: function() {
            this.comments.$el.appendTo(this.$(".issue-comments"));
            return IssueView.__super__.finish.apply(this, arguments);
        },

        // When the current issue change
        onIssueChange: function(issue) {
            if (!issue) {
                return this.model.clear();
            }
            return this.model.loadByNumber(hr.app.currentRepo, issue);
        },

        // When submiting comment form
        onSubmitComment: function(e) {
            if (e) e.preventDefault();

            return this.model.postComment(this.$(".issue-controls textarea").val())
            .then(this.update.bind(this))
            .fail(alert);
        },

        // When typing in the comment area
        onKeyupComment: function(e) {
            this.$(".issue-controls .action-toggle").text((this.model.isOpen()? "Close" : "Open")+(($(e.currentTarget).val().length > 0)? " and comment" : " issue"));
        },

        // When toggling issue
        onToggleIssue: function(e) {
            if (e) e.preventDefault();

            var that = this;

            Q()
            .then(function() {
                if (that.$(".issue-controls textarea").val().length > 0) {
                    return that.onSubmitComment();
                }
            })
            .then(function() {
                return that.model.toggleIssue();
            })
            .then(function() {
                return that.onIssueChange(that.model.id);
            });
        }
    });

    return IssueView;
});