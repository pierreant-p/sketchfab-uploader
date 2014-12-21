'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var DndTargetView = require('./DndTarget.js');
var TaskListView = require('./TaskList.js');
var Sketchfab = require('node-sketchfab');

var AppView = Backbone.View.extend({

    el: 'body',

    events: {
        'click .clear': 'onClickClear',
        'change input[name="token"]': 'onTokenChange'
    },

    initialize: function(options) {
        this.uploadManager = options.uploadManager;
        this.config = options.config;

        new DndTargetView({
            el: this.el,
            model: this.model
        });
        new TaskListView({
            el: this.$el.find('.tasks'),
            model: this.model,
            uploadManager: this.uploadManager
        })

        if (this.config.getToken()) {
            this.$el.find('input[name="token"]').val(this.config.getToken());
        }

        this.render();
    },

    render: function() {
        return this;
    },

    onClickClear: function() {
        this.model.cleanup();
    },

    onTokenChange: function() {
        var token = this.$el.find('input[name="token"]').val().trim();
        this.uploadManager.setToken(token);
        this.config.setToken(token);
    }

});

module.exports = AppView;
