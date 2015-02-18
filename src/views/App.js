'use strict';

var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
var querystring = require('querystring');
var request = require('superagent');
Backbone.$ = $;

var DndTargetView = require('./DndTarget.js');
var TaskListView = require('./TaskList.js');
var Sketchfab = require('node-sketchfab');

var AppView = Backbone.View.extend({

    el: 'body',

    events: {
        'click .clear': 'onClickClear',
        'change input[name="token"]': 'onTokenChange',
        'click .login': 'login',
        'click .logout': 'logout'
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
        });

        var auth = this.config.getAuth();
        if ( auth && auth.type == 'token' ) {
            this.$el.find('input[name="token"]').val(auth.token);
        } else if ( auth && auth.type == 'oauth2' ) {
            this.whoAmI( auth.token );
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
        var auth = {
            type: 'token',
            token: token
        };
        this.uploadManager.setAuth(auth);
        this.config.setAuth(auth);
    },

    login: function() {

        var state = "12345678912345678";
        var oauthUrl = "https://thing.fatvertex.com/oauth2/authorize?state=" + state + "&client_id=12345678&response_type=code";

        var gui = window.require('nw.gui');
        var new_win = gui.Window.get(
            window.open(oauthUrl)
        );
        new_win.focus();

        var self = this;

        // hack begins
        new_win.on( 'loaded', function () {
            var pathname = this.window.location.pathname;
            if ( pathname === "/something" ) {
                var qp = querystring.parse(this.window.location.search);
                var token = qp.code;
                console.log( token );

                request
                    .post('https://thing.fatvertex.com/oauth2/token/?grant_type=authorization_code&client_id=12345678&client_secret=1234567890&code=' + token + '&redirect_uri=https://thing.fatvertex.com/something').send({})
                    .end(function(error, res){

                        var access_token = res.body['access_token'];

                        new_win.close();

                        var auth = {
                            type: 'oauth2',
                            token: access_token
                        };
                        self.config.setAuth(auth);
                        self.uploadManager.setAuth(auth);
                        self.whoAmI( access_token );

                    });
            }


        } );

    },

    whoAmI: function( access_token ) {

        this.uploadManager._client.me( function (error, data ) {
            $('.login').addClass('hidden');
            $('.logout').removeClass('hidden');
            $('.username').html(data.username);
        } );

    },

    logout: function () {
        var gui = window.require('nw.gui');
        var new_win = gui.Window.get(
            window.open('https://thing.fatvertex.com/logout')
        );
        new_win.on('loaded', function() {
            this.close();
            $('.login').removeClass('hidden');
            $('.logout').addClass('hidden');
            $('.username').html('');
        } );
        this.model.cleanup();

    }

});

module.exports = AppView;
