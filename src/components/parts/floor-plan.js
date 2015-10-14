'use strict';
var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            active: 'Kitchen',
            dragging: false,
            rooms:[
                {
                    name: 'Kitchen',
                    width: 5,
                    height: 5,
                    left:0,
                    top:100
                },
                {
                    name: 'Living Room',
                    width: 10,
                    height: 20,
                    left: 50,
                    top:100
                },
                {
                    name: 'Dining Room',
                    width: 10,
                    height: 20,
                    left: 150,
                    top: 100 
                }
            ]
        }
    },
    watchMouse: function(e){

        e.preventDefault();
        if(false === this.state.dragging) return;

        // room data
        var room = this.state.rooms.filter(function(room){
            return room.name === e.currentTarget.dataset.room;
        })[0];

        // index object
        var index = this.state.rooms.map(function(room){
            return room.name;
        }).indexOf(room.name);

        var rooms = this.state.rooms;
        rooms[index].left = e.clientX  - e.target.offsetWidth/2;
        rooms[index].top = e.clientY - e.target.offsetHeight/2;

        console.log(e.clientX, e.clientY, e.target.offsetWidth, e.target.offsetHeight);

        // update states
        this.setState({
            rooms: rooms
        });

    },
    startDrag: function(e){
        e.preventDefault();
        this.setState({
            active: e.currentTarget.dataset.room,
            dragging: true
        });
    },
    stopDrag: function(e){
        e.preventDefault();
        this.setState({
            dragging: false
        });
    },
    render: function () {
        var that = this;
        return (
            <div ref="FloorPlan" className="floor-plan">
                {this.state.rooms.map(function(room){
                    return (
                        <div key={room.name}
                            draggable="true"
                            onMouseMove={that.watchMouse}
                            onMouseDown={that.startDrag}
                            onMouseUp={that.stopDrag}
                            data-room={room.name}
                            className={that.state.active === room.name ? "room active" : "room"} style={
                            {
                                width:room.width*10,
                                height:room.height*10,
                                left: room.left,
                                top: room.top
                            }
                        }>
                            <h3>{room.name}</h3>
                            <p>{room.width * room.height} sqft</p>
                        </div>
                    )
                })}
            </div>
        );
    }
});