define([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "collections/comments",
    "text!resources/templates/items/comment.html"
], function(_, $, hr, Comments, templateMain) {

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
        }
    });

    var CommentsView = hr.List.extend({
        Item: CommentItem,
        className: "comments",
        Collection: Comments
    });

    return CommentsView;
});