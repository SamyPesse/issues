require([
    "hr/utils",
    "hr/dom",
    "hr/promise",
    "hr/hr",
    "hr/args",
    "backends/auth",
    "backends/api",
    "text!resources/templates/main.html"
], function(_, $, Q, hr, args, auth, api, templateMain) {
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
        },

        templateContext: function() {
            return {
                'isAuth': auth.isAuth()
            }
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
            });
        }
    });

    var app = new Application();

    auth.init()
    .then(app.run.bind(app));
});
