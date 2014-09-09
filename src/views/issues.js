define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "collections/issues",
    "text!resources/templates/items/issue.html"
], function(_, $, hr, Issues, templateMain) {

    var IssueItem = hr.List.Item.extend({
        className: "issue-item",
        template: templateMain,
        events: {
            "click": "onClick"
        },

        initialize: function(options) {
            IssueItem.__super__.initialize.apply(this, arguments);

            this.listenTo(hr.app, "state:issue", this.onActiveChange);
            this.onActiveChange(hr.app.currentIssue);
        },
        templateContext: function() {
            return {
                issue: this.model
            };
        },

        // When active repo changed
        onActiveChange: function(issue) {
            this.$el.toggleClass("active", this.model.id == issue);
        },

        // When click on the repo
        onClick: function(e) {
            if (e) e.preventDefault();

            hr.History.navigate(hr.app.currentRepo+"/issues/"+this.model.id);
        }
    });

    var IssuesView = hr.List.extend({
        Item: IssueItem,
        className: "issues",
        Collection: Issues
    });

    return IssuesView;
});