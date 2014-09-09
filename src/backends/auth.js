define([
    "hr/hr",
    "hr/promise"
], function(hr, Q) {
    var username, password;

    // Return true if the user if authenticated
    var isAuth = function() {
        return (username && password);
    };

    // Return auth infos
    var get = function() {
        return {
            username: username,
            password: password
        };
    };

    // Initialize the auth backend
    var init = function() {
        username = hr.Storage.get("username");
        password = hr.Storage.get("password");

        return Q(isAuth());
    };

    return {
        init: init,
        get: get,
        isAuth: isAuth
    };
});