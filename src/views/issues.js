define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "utils/dialogs",
    "collections/issues",
    "text!resources/templates/items/issue.html"
], function(_, $, hr, dialogs, Issues, templateMain) {

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
        Collection: Issues,

        initialize: function() {
            IssuesView.__super__.initialize.apply(this, arguments);

            this.issuesFilter = {
                labels: "",
                state: "open"
            };
        },

        // Message when there is no issues
        displayEmptyList: function() {
            return $("<div>", {
                "class": "tab-empty",
                "html": '<div class="icon"><span class="octicon octicon-repo"></span></div>Select a repsoitory'
            });
        },

        // Load issues with a specific filter
        loadIssues: function(repo, filter) {
            repo = repo || hr.app.currentRepo;
            if (filter) {
                this.issuesFilter = filter;
            }

            filter = {
                labels: this.issuesFilter.labels,
                state: this.issuesFilter.state
            };
            return this.collection.loadForRepo(repo, filter);
        },

        // Filter issues
        onFilterIssues: function() {
            return dialogs.schema({
                title: "Filter Issues",
                properties: {
                    labels: {
                        description: "Labels",
                        type: "string"
                    },
                    state: {
                        description: "State",
                        type: "string",
                        'enum': {
                            'open': "Open",
                            'close': "Close",
                            'all': "All"
                        }
                    }
                }
            }, this.issuesFilter, { ok: "Filter" })
            .then(this.loadIssues.bind(this, hr.app.currentRepo));
        },

        // Create new issue
        onCreateNewIssue: function() {
            var that = this;

            return dialogs.schema({
                title: "New Issue",
                properties: {
                    title: {
                        description: "Title",
                        type: "string"
                    },
                    body: {
                        description: "Message",
                        type: "string",
                        textarea: true
                    },
                    labels: {
                        description: "Labels",
                        type: "string"
                    }
                }
            }, {}, { ok: "Submit new issue" })
            .then(function(issue) {
                return that.collection.createIssue(hr.app.currentRepo, issue)
                .then(function() {
                    return that.loadIssues();
                })
                .fail(dialogs.error);
            });
        }
    });

    return IssuesView;
});