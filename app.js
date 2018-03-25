var express = require('express');
var app = express();
var serv = require('http').Server(app)
require('./variables.js');

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/3d', function(req, res) {
    console.log(req.path)
})
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server started');

var SOCKET_LIST = {}
var room = {link: '3bnr5t', players: {}}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    PLAYERS_ONLINE++;
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 495;
    SOCKET_LIST[socket.id] = socket
    console.log("new socket connected")
    console.log('Players online: ' + PLAYERS_ONLINE)

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id]
        console.log("socket disconnected");
        PLAYERS_ONLINE--;
    })  

    socket.on('move', function(data) {
        if(data.directory === 'left') {
            socket.x -= SPEED;
        } else if(data.directory === 'right') {
            socket.x += SPEED;
        }
    })
})

setInterval(function() {
    var pack = [];
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        pack.push({
            x: socket.x,
            y: socket.y
        })
    }
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('newPosition', pack)
    }
}, 1000/25)