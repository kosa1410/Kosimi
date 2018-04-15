var express = require('express');
var app = express();
var serv = require('http').Server(app)
require('./variables.js');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/menu.html');
})

app.get('/game', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));
app.use('/client',express.static(__dirname + '/client'));


serv.listen(2000);
console.log('Server started');

var SOCKET_LIST = {}
var bombs = []
var room = {link: '3bnr5t', players: {}}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    PLAYERS_ONLINE++;
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 500;
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
            if(!(socket.x - FIELD < 0)) {
                socket.x -= FIELD;
            }
        } else if(data.directory === 'right') {
            if(!(socket.x + FIELD > 500)) {
                socket.x += FIELD;
            }
        } else if(data.directory === 'up') {
            if(!(socket.y - FIELD < 0)) {
                socket.y -= FIELD;
            }
        } else if(data.directory === 'down') {
            if(!(socket.y + FIELD > 500)) {
                socket.y += FIELD;
            }
        }
    })

    socket.on('put_bomb', function(data) {
        bombs.push({
            x: socket.x,
            y: socket.y
        })
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
    bomb_pack = [];
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        bomb_pack.push({
            x: socket.x,
            y: socket.y
        })
    }
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('newPosition', pack)
        socket.emit('bombs_positions', bomb_pack)
    }
}, 1000/25)