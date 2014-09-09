define([
    "hr/hr",
    "utils/hash",
    "backends/auth"
], function(hr, hash, auth) {
    var API_URL = 'https://api.github.com';

    var api = new hr.Backend({
        prefix: "api"
    });

    api.defaultMethod({
        execute: function(args, options, method) {
            options = _.defaults({}, options || {}, {
                dataType: "json",
                auth: null,
                headers: {
                    'Accept': 'application/vnd.github.v3.raw+json',
                    'Content-type': 'application/json;charset=UTF-8'
                }
            });

            // Extract HHTP method and path
            method = method.split(":");
            var httpMethod = method.shift().toLowerCase();
            method = method.join(":");

            // Get auth infos for the request
            var authInfos = null;
            if (auth.isAuth()) auth.get();
            if (options.auth) authInfos = options.auth;
            if (authInfos) options.headers['Authorization'] = 'Basic ' + hash.btoa(authInfos.username + ':' + authInfos.password)

            console.log(httpMethod, method);
            return hr.Requests[httpMethod](API_URL+"/"+method, args? JSON.stringify(args) : null, {
                dataType: options.dataType,
                options: {
                    headers: options.headers
                }
            });
        }
    });

    return api;
});