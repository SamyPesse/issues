define([
    "hr/hr"
], function(hr) {
    var api = new hr.Backend({
        prefix: "api"
    });

    api.defaultMethod({
        execute: function(args, options, method) {
            method = method.replace(".md", ".json");

            return hr.Requests.getJSON(window.gitbook.hostname+"/json/book/"+window.gitbook.id+"/"+method+"?callback=?");
        }
    });

    return api;
});