require([
    "hr/utils",
    "hr/dom",
    "hr/promise",
    "hr/hr",
    "hr/args",
    "backends/auth",
    "backends/api",
    "views/grid",
    "text!resources/templates/main.html"
], function(_, $, Q, hr, args, auth, api, GridView, templateMain) {
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
            "": "onRouteChange"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            // Main grid
            this.grid = new GridView({
                columns: 3
            }, this);

            this.grid.addView(new hr.View(), {width: 25});
            this.grid.addView(new hr.View());
            this.grid.addView(new hr.View());
        },

        templateContext: function() {
            return {
                'isAuth': auth.isAuth()
            }
        },

        render: function() {
            this.grid.detach();

            return Application.__super__.render.apply(this, arguments);
        },

        finish: function() {
            if (auth.isAuth()) {
                this.grid.appendTo(this.$(".screen-manager"));
            }

            return Application.__super__.finish.apply(this, arguments);
        },

        // Route change
        onRouteChange: function(path) {
            console.log("route change", arguments);
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
