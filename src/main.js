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
    "text!resources/templates/main.html"
], function(_, $, Q, hr, args, auth, api, GridView, RepositoriesView, IssuesView, IssueView, templateMain) {
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
            this.grid.addView(this.repositories, { width: 20 });

            // List of issues
            this.issues = new IssuesView();
            this.issues.listenTo(this, "state:repo", function(repo) {
                this.collection.loadForRepo(repo);
            });
            this.grid.addView(this.issues, { width: 35 });

            // Current issue
            this.issue = new IssueView();
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
