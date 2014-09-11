define([
    "hr/utils",
    "hr/dom",
    "hr/hr"
], function(_, $, hr) {
    var DialogView = hr.View.extend({
        className: "dialog-container",
        defaults: {
            keyboard: true,
            keyboardEnter: true,

            View: hr.View,
            view: {},
            size: "medium"
        },
        events: {
            "click": "close",
            "click .dialog": "stopPropagation",
            "keydown": "keydown"
        },

        initialize: function(options) {
            DialogView.__super__.initialize.apply(this, arguments);

            // Bind keyboard
            this.keydownHandler = _.bind(this.keydown, this)
            if (this.options.keyboard) $(document).bind("keydown", this.keydownHandler);

            this.$dialog = $("<div>", {'class': "dialog"});
            this.$dialog.appendTo(this.$el);

            // Adapt style
            this.$dialog.addClass("size-"+this.options.size);

            // Build view
            this.view = new options.View(this.options.view, this);
        },

        render: function() {
            this.view.render();
            this.view.appendTo(this.$dialog);

            return this.ready();
        },

        finish: function() {
            this.open();
            return DialogView.__super__.finish.apply(this, arguments);
        },

        open: function() {
            if (DialogView.current != null) DialogView.current.close();

            this.$el.appendTo($("body"));
            DialogView.current = this;

            this.trigger("open");

            return this;
        },

        close: function(e, force) {
            if (e) e.preventDefault();

            // Unbind document keydown
            $(document).unbind("keydown", this.keydownHandler);

            // Hide modal
            this.trigger("close", force);
            this.remove();

            DialogView.current = null;
        },

        keydown: function(e) {
            if (!this.options.keyboard) return;

            var key = e.keyCode || e.which;

            // Enter: valid
            if (key == 13 && this.options.keyboardEnter) {
                this.close(e);
            } else
            // Esc: close
            if (key == 27) {
                this.close(e, true);
            }
        },

        stopPropagation: function(e) {
            e.stopPropagation();
        }
    }, {
        current: null,
    });

    return DialogView;
});