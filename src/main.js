require([
    "hr/utils",
    "hr/dom",
    "hr/promise",
    "hr/hr",
    "hr/args",
    "backends/auth",
    "backends/api",
    "views/grid",
    "views/repositories",
    "views/issues",
    "views/issue",
    "views/tab",
    "text!resources/templates/main.html",
    "utils/date"
], function(_, $, Q, hr, args, auth, api, GridView, RepositoriesView, IssuesView, IssueView, TabView, templateMain) {
    // Configure hr
    hr.configure(args);

    hr.Resources.addNamespace("templates", {
        loader: "text"
    });

    // Define base application
    var Application = hr.Application.extend({
        name: "GitHub Issues Manager",
        template: templateMain,
        events: {
            "submit .screen-login .form": "onLoginSubmit"
        },
        routes: {
            ":login/:repo": "onRepoChange",
            ":login/:repo/issues/:issue": "onissueChange"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            // Current states
            this.currentRepo = null;
            this.currentIssue = null;

            // Main grid
            this.grid = new GridView({
                columns: 3
            }, this);

            // List of repositories
            this.repositories = new RepositoriesView();
            this.tabRepos = new TabView({
                title: "Repos",
                content: this.repositories
            });
            this.grid.addView(this.tabRepos, { width: 20 });

            // List of issues
            this.issues = new IssuesView();
            this.issues.listenTo(this, "state:repo", function(repo) {
                this.collection.loadForRepo(repo);
            });
            this.tabIssues = new TabView({
                title: "Issues",
                content: this.issues,
                actions: [
                    {
                        position: "right",
                        title: "New Issue",
                        icon: "plus",
                        click: function() {

                        }
                    }
                ]
            });
            this.grid.addView(this.tabIssues, { width: 35 });

            // Current issue
            this.issue = new IssueView();
            this.issue.listenTo(this, "state:issue", this.issue.onIssueChange);
            this.grid.addView(this.issue);
        },

        templateContext: function() {
            return {
                'isAuth': auth.isAuth()
            }
        },

        render: function() {
            if (!hr.History.started) this.router.start();

            this.grid.detach();

            return Application.__super__.render.apply(this, arguments);
        },

        finish: function() {
            if (auth.isAuth()) {
                this.grid.appendTo(this.$(".screen-manager"));
                this.repositories.collection.loadForUser();
                this.tabRepos.update();
                this.tabIssues.update();
                this.issue.update();
            }

            return Application.__super__.finish.apply(this, arguments);
        },

        // Define current repo
        setCurrentRepo: function(repo) {
            if (this.currentRepo == repo) return;

            this.currentRepo = repo;
            this.trigger("state:repo", this.currentRepo);
        },

        // Define current issue
        setCurrentIssue: function(issue) {
            if (this.currentIssue == issue) return;

            this.currentIssue = issue;
            this.trigger("state:issue", this.currentIssue);
        },

        // Routes changements:
        onRepoChange: function(login, repo) {
            this.setCurrentRepo(login+"/"+repo);
            this.setCurrentIssue(null);
        },
        onissueChange: function(login, repo, issue) {
            this.setCurrentRepo(login+"/"+repo);
            this.setCurrentIssue(issue);
        },

        // Submit on login form
        onLoginSubmit: function(e) {
            if (e) e.preventDefault();

            var that = this;
            var username = this.$(".screen-login input[name='username']").val();
            var password = this.$(".screen-login input[name='password']").val();

            api.execute("get:user", null, {
                auth: {
                    username: username,
                    password: password
                }
            })
            .then(function() {
                auth.set(username, password);

                return that.update();
            }, function() {
                that.$(".screen-login .form-message").text("Invalid username or password.").show();
            });
        }
    });

    var app = new Application();

    auth.init()
    .then(app.run.bind(app));
});
