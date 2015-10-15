'use strict';
var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            currentRoom: 'Kitchen',
            dragging: false,
            rooms:[
                {
                    name: 'Kitchen',
                    width: 5,
                    height: 5,
                    left:20,
                    top:170
                },
                {
                    name: 'Living Room',
                    width: 10,
                    height: 20,
                    left: 75,
                    top:170
                },
                {
                    name: 'Dining Room',
                    width: 10,
                    height: 20,
                    left: 180,
                    top: 170 
                }
            ]
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        React.findDOMNode(this.refs.state).value = JSON.stringify(this.state);
    },
    updateState: function(){
        var state = JSON.parse(React.findDOMNode(this.refs.state).value);
        this.setState(state); 
    },
    handleChange: function (e) {
        e.preventDefault();
        var that = this;
        var dimension = e.target.dataset.dimension;
        var room = this.state.rooms.filter(function(room){
            return room.name === that.state.currentRoom;
        })[0];
        var index = this.state.rooms.map(function(room){
            return room.name;
        }).indexOf(room.name);
        var val = parseInt(e.target.value);
        var rooms = this.state.rooms;
        if(dimension === "width"){
            rooms[index].width = val;
        } else {
            rooms[index].height = val;
        }
        this.setState({
            rooms:rooms
        });
        
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

        // update states
        this.setState({
            rooms: rooms
        });

    },
    startDrag: function(e){
        e.preventDefault();
        var room = this.state.rooms.filter(function(room){
            return room.name === e.currentTarget.dataset.room;
        })[0];
        React.findDOMNode(this.refs.width).value = room.width;
        React.findDOMNode(this.refs.height).value = room.height;
        this.setState({
            currentRoom: e.currentTarget.dataset.room,
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
                <div>
                SQFT: {this.state.rooms.reduce(function(prev, curr){ return prev + (curr.width*curr.height)}, 0)}</div>
                WIDTH: <select ref="width" data-dimension="width" onChange={that.handleChange}>
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                </select> &nbsp;
                HEIGHT: <select ref="height" data-dimension="height" onChange={that.handleChange}>
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                </select>
                <hr/>
                {this.state.rooms.map(function(room){
                    return (
                        <div key={room.name}
                            draggable="true"
                            onMouseMove={that.watchMouse}
                            onMouseDown={that.startDrag}
                            onMouseUp={that.stopDrag}
                            data-room={room.name}
                            className={that.state.currentRoom === room.name ? "room active" : "room"} style={
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
                <textarea ref="state">
                    {JSON.stringify(this.state)}
                </textarea>
                <button onClick={that.updateState} className="stateUpdater" ref="updateState">update</button>
            </div>
        );
    }
});