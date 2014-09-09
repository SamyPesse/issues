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
        },
        templateContext: function() {
            return {
                repo: this.model
            };
        },

        // On click on th repo
        onClick: function(e) {
            if (e) e.preventDefault();

            hr.History.navigate(this.model.get("full_name"));
        }
    });

    var RepositoriesView = hr.List.extend({
        Item: RepositoryItem,
        className: "repositories",
        Collection: Repositories
    });

    return RepositoriesView;
});