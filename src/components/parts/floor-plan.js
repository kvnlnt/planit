'use strict';
var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            currentRoom: 'Kitchen',
            dragging: false,
            zIndex:1,
            rooms:[{
                "name": "Kitchen",
                "width": 20,
                "height": 11,
                "left": 420,
                "top": 215
            }, {
                "name": "Master Bedroom",
                "width": 20,
                "height": 15,
                "left": 621,
                "top": 266
            }, {
                "name": "Living Room",
                "width": 10,
                "height": 20,
                "left": 419,
                "top": 326
            }, {
                "name": "Dining Room",
                "width": 10,
                "height": 20,
                "left": 520,
                "top": 326
            }, {
                "name": "Bedroom 1",
                "width": 10,
                "height": 14,
                "left": 177,
                "top": 337
            }, {
                "name": "Bedroom 2",
                "width": 14,
                "height": 11,
                "left": 279,
                "top": 425
            }, {
                "name": "Laundry Room",
                "width": 14,
                "height": 7,
                "left": 279,
                "top": 215.5
            }, {
                "name": "Bathroom",
                "width": 14,
                "height": 10,
                "left": 278,
                "top": 288
            }, {
                "name": "Hallway",
                "width": 14,
                "height": 4,
                "left": 280,
                "top": 386.5
            }]
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        React.findDOMNode(this.refs.state).value = JSON.stringify(this.state);
    },
    updateState: function(){
        var state = JSON.parse(React.findDOMNode(this.refs.state).value);
        this.setState(state); 
    },
    getRoomByName: function(roomName){
        return this.state.rooms.filter(function(room){
            return room.name === roomName;
        })[0];
    },
    getRoomIndexByName: function(roomName){
        return this.state.rooms.map(function(room){
            return room.name;
        }).indexOf(roomName);
    },
    createRoom: function(e){
        e.preventDefault();
        var roomName = React.findDOMNode(this.refs.createName).value;
        var width = React.findDOMNode(this.refs.width).value;
        var height = React.findDOMNode(this.refs.height).value;
        var room = {
            name: roomName,
            width: width,
            height: height,
            left: 0,
            top: 0
        };
        var rooms = this.state.rooms;
        rooms.push(room);
        this.setState({
            currentRoom: roomName,
            rooms: rooms
        });
    },
    deleteRoom: function (e) {
        e.preventDefault();
        var that = this;
        var dimension = e.target.dataset.dimension;
        var room = this.getRoomByName(that.state.currentRoom);
        var index = this.getRoomIndexByName(room.name);
        var rooms = this.state.rooms;
        rooms.splice(index, 1);
        this.setState({
            rooms:rooms
        });
    },
    handleRoomInputClick: function(e){
        e.preventDefault();
        this.setState({
            currentRoom: null,
            dragging: false
        });
    },
    handleBlur: function(e){
        e.preventDefault();
        this.setState({
            currentRoom: null
        });
    },
    handlePreselector: function(e){
        e.preventDefault();
        var rooms = React.findDOMNode(this.refs.preselector).value;
        this.setState({
            rooms: JSON.parse(rooms)
        });
    },
    handleChange: function (e) {
        e.preventDefault();
        if(null === this.state.currentRoom) return;
        var that = this;
        var dimension = e.target.dataset.dimension;
        var room = this.getRoomByName(that.state.currentRoom);
        var index = this.getRoomIndexByName(room.name);
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
        var room = this.getRoomByName(e.currentTarget.dataset.room);
        var index = this.getRoomIndexByName(room.name);
        var rooms = this.state.rooms;
        rooms[index].left = e.clientX  - e.target.offsetWidth/2;
        rooms[index].top = e.clientY - e.target.offsetHeight/2;
        this.setState({ rooms: rooms });
    },
    startDrag: function(e){
        e.preventDefault();
        if(true === this.state.dragging) return;
        var newZ = this.state.zIndex + 1;
        var room = this.getRoomByName(e.currentTarget.dataset.room);
        e.currentTarget.style.zIndex = newZ;
        React.findDOMNode(this.refs.width).value = room.width;
        React.findDOMNode(this.refs.height).value = room.height;
        this.setState({
            currentRoom: e.currentTarget.dataset.room,
            dragging: true,
            zIndex: newZ
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
                SQFT: {this.state.rooms.reduce(function(prev, curr){ return prev + (curr.width*curr.height)}, 0)}
                <br/>
                WIDTH: <select ref="width" data-dimension="width" onChange={that.handleChange}>
                {[...Array(30)].map((x, i) =>
                    <option>{i}</option>
                  )}
                </select>
                &nbsp;
                HEIGHT: <select ref="height" data-dimension="height" onChange={that.handleChange}>
                    {[...Array(31)].map((x, i) =>
                    <option>{i}</option>
                  )}
                </select>
                &nbsp;
                <input onClick={that.handleRoomInputClick} ref="createName" type="text" placeholder="room name" />
                &nbsp;
                <button onClick={that.createRoom} ref="create" className="createRoom">New</button>
                &nbsp;
                <button onClick={that.deleteRoom} ref="delete" className="deleteRoom">Delete</button>
                &nbsp;
                <select ref="preselector" onChange={this.handlePreselector}>
                    <option value='[{"name":"Kitchen","width":20,"height":11,"left":420,"top":215},{"name":"Master Bedroom","width":20,"height":15,"left":621,"top":266},{"name":"Living Room","width":10,"height":20,"left":419,"top":326},{"name":"Dining Room","width":10,"height":20,"left":520,"top":326},{"name":"Bedroom 1","width":10,"height":14,"left":177,"top":337},{"name":"Bedroom 2","width":14,"height":11,"left":279,"top":425},{"name":"Laundry Room","width":14,"height":7,"left":279,"top":215.5},{"name":"Bathroom","width":14,"height":10,"left":278,"top":288},{"name":"Hallway","width":14,"height":4,"left":280,"top":386.5}]'>Hemmi</option>
                    <option value='[{"name":"Kitchen","width":20,"height":11,"left":420,"top":215},{"name":"Master Bedroom","width":20,"height":15,"left":128,"top":215},{"name":"Living Room","width":17,"height":12,"left":329,"top":326},{"name":"Dining Room","width":15,"height":12,"left":501,"top":326},{"name":"Bedroom 1","width":10,"height":15,"left":651,"top":326},{"name":"Bedroom 2","width":14,"height":11,"left":188,"top":366},{"name":"Laundry Room","width":9,"height":11,"left":329,"top":215},{"name":"Bathroom","width":13,"height":11,"left":621,"top":214.5}]'>long</option>
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