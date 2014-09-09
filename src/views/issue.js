define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "models/issue",
    "text!resources/templates/items/issue.html"
], function(_, $, hr, Issue, templateMain) {

    var IssueView = hr.View.extend({
        className: "issue",
        template: templateMain,

        initialize: function(options) {
            IssueView.__super__.initialize.apply(this, arguments);
        },
        templateContext: function() {
            return {
                issue: this.model
            }
        }
    });

    return IssueView;
});