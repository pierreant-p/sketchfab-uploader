'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var DndTargetView = Backbone.View.extend({

    events: {
        'dragenter': 'onDragEnter',
        'dragleave': 'onDragLeave',
        'dragover': 'onDragOver',
        'drop': 'onDrop'
    },

    onDragEnter: function() {
        this.$el.addClass('over');
    },

    onDragLeave: function() {
        this.$el.removeClass('over');
    },

    onDragOver: function( e ) {
        e.stopPropagation();
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'copy';
    },

    onDrop: function( e ) {
        e.stopPropagation();
        e.preventDefault();

        console.log( 'drop' );

        this.$el.removeClass('over');

        var files = e.originalEvent.dataTransfer.files;
        var file;
        for (var i=0,l=files.length; i<l; i++) {
            file = files[i];
            this.model.createTask([{
                file: file.path,
                name: file.name,
                type: file.type,
                size: file.size
            }]);
        }
    }

});

module.exports = DndTargetView;
