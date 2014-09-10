define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "models/issue",
    "text!resources/templates/tab.html"
], function(_, $, hr, Issue, templateMain) {

    var TabView = hr.View.extend({
        className: "tab",
        template: templateMain,
        defaults: {
            content: new hr.View(),
            actions: []
        },
        events: {
            "click .action": "onClickAction"
        },

        initialize: function(options) {
            TabView.__super__.initialize.apply(this, arguments);
        },
        render: function() {
            this.options.content.detach();
            return TabView.__super__.render.apply(this, arguments);
        },
        finish: function() {
            this.options.content.$el.appendTo(this.$(".tab-content"));
            return TabView.__super__.finish.apply(this, arguments);
        },
        templateContext: function() {
            return {
                title: this.options.title,
                actions: this.options.actions,
                cid: this.cid
            };
        },

        // When clicking on an action
        onClickAction: function(e) {
            e.preventDefault();
            var i = Number($(e.currentTarget).data("action"));
            this.options.actions[i].click();
        }
    });

    return TabView;
});