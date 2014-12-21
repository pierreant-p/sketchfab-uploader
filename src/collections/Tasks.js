'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var Task = require('../models/Task.js');

var Tasks = Backbone.Collection.extend({
    model: Task,

    createTask: function(file) {
        this.add(file);
    },

    cleanup: function() {
        var removable = this.filter(function(model) {
            return (
                model.get('status') === Task.STATUS.FINISHED ||
                model.get('status') === Task.STATUS.ERROR
            );
        });
        for (var i = 0; i < removable.length; i++) {
            this.remove(removable[i]);
        }
    }
});

module.exports = Tasks;
