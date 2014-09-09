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
        }
    });

    var app = new Application();
    app.run();
});
