define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "collections/repositories",
    "text!resources/templates/repository.html"
], function(_, $, hr, Repositories, templateMain) {
    var RepositoryItem = hr.List.Item.extend({
        className: "repository-item",
        template: templateMain,
        events: {
            "click": "onClick"
        },

        initialize: function(options) {
            RepositoryItem.__super__.initialize.apply(this, arguments);

            this.listenTo(hr.app, "state:repo", this.onActiveChange);
            this.onActiveChange(hr.app.currentRepo);
        },
        templateContext: function() {
            return {
                repo: this.model
            };
        },

        // When active repo changed
        onActiveChange: function(repo) {
            this.$el.toggleClass("active", this.model.id == repo);
        },

        // When click on the repo
        onClick: function(e) {
            if (e) e.preventDefault();

            hr.History.navigate(this.model.id);
        }
    });

    var RepositoriesView = hr.List.extend({
        Item: RepositoryItem,
        className: "repositories",
        Collection: Repositories
    });

    return RepositoriesView;
});