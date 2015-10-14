'use strict';
var React = require('react');
var Menu = require('../parts/menu');
var FloorPlan = require('../parts/floor-plan');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="page">
                <Menu />
                <FloorPlan />
            </div>
        );
    }
});