define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "highlight",
    "collections/comments",
    "text!resources/templates/items/comment.html"
], function(_, $, hr, hljs, Comments, templateMain) {

    var CommentItem = hr.List.Item.extend({
        className: "comment",
        template: templateMain,
        events: {

        },

        initialize: function(options) {
            CommentItem.__super__.initialize.apply(this, arguments);
        },
        templateContext: function() {
            return {
                comment: this.model
            };
        },
        finish: function() {
            this.$('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
            return CommentItem.__super__.finish.apply(this, arguments);
        }
    });

    var CommentsView = hr.List.extend({
        Item: CommentItem,
        className: "comments",
        Collection: Comments
    });

    return CommentsView;
});