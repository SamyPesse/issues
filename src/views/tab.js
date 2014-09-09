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

        initialize: function(options) {
            TabView.__super__.initialize.apply(this, arguments);
        },
        render: function() {
            console.log("render");
            this.options.content.detach();
            return TabView.__super__.render.apply(this, arguments);
        },
        finish: function() {
            console.log("finish", this.options.content);
            this.options.content.$el.appendTo(this.$(".tab-content"));
            return TabView.__super__.finish.apply(this, arguments);
        },
        templateContext: function() {
            return this.options;
        }
    });

    return TabView;
});