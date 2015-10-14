'use strict';

// Packages
var React     = require('react');

// Components
var Router    = require('./lib/router.js');
var Css       = require('./main.css');
var Dashboard = require('./components/pages/dashboard');

// Controller
var Controller = {
    dashboard: function(){
        React.render(<Dashboard />, document.getElementById('main'));
    }, 
    error: function(){
        React.render(<Error />, document.getElementById('main'));
    }
};

// Router
var router = new Router([
    { route: '',            controller: Controller.dashboard },
    { route: '/error',      controller: Controller.error }
]).start();
