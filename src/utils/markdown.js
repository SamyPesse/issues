define([
    'hr/hr',
    'marked'
], function (hr, marked) {
    var parse = function(c) {
        return marked(c);
    };

    var markdown = {
        'parse': parse
    };

    hr.Template.extendContext({
        '$markdown': markdown
    });

    return markdown;
});