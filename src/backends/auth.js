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

    // Define auth infos
    var set = function(_username, _password) {
        username = _username;
        password = _password;

        hr.Storage.set("username", username);
        hr.Storage.set("password", password);
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
        set: set,
        isAuth: isAuth
    };
});