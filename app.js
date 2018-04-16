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


serv.listen(process.env.PORT || 2000);
console.log('Server started');

var SOCKET_LIST = {}
var bombs = []
var room = {link: '3bnr5t', players: {}}
var _socket = {}

var map = [
    [{type: 'floor', x: 0, y: 0},   {type: 'floor', x: 50, y: 0},   {type: 'floor', x: 100, y: 0},   {type: 'floor', x: 150, y: 0},   {type: 'floor', x: 200, y: 0},   {type: 'floor', x: 250, y: 0},   {type: 'floor', x: 300, y: 0},   {type: 'floor', x: 350, y: 0},   {type: 'floor', x: 400, y: 0},   {type: 'floor', x: 450, y: 0}, {type: 'floor', x: 500, y: 0}],
    [{type: 'floor', x: 0, y: 50},  {type: 'wall', x: 50, y: 50},   {type: 'floor', x: 100, y: 50},  {type: 'wall', x: 150, y: 50},   {type: 'floor', x: 200, y: 50},  {type: 'wall', x: 250, y: 50},   {type: 'floor', x: 300, y: 50},  {type: 'wall', x: 350, y: 50},   {type: 'floor', x: 400, y: 50},  {type: 'wall', x: 450, y: 50}, {type: 'floor', x: 500, y: 50}],
    [{type: 'floor', x: 0, y: 100}, {type: 'floor', x: 50, y: 100}, {type: 'floor', x: 100, y: 100}, {type: 'floor', x: 150, y: 100}, {type: 'floor', x: 200, y: 100}, {type: 'floor', x: 250, y: 100}, {type: 'floor', x: 300, y: 100}, {type: 'floor', x: 350, y: 100}, {type: 'floor', x: 400, y: 100}, {type: 'floor', x: 450, y: 100}, {type: 'floor', x: 500, y: 100}],
    [{type: 'floor', x: 0, y: 150}, {type: 'wall', x: 50, y: 150},  {type: 'floor', x: 100, y: 150}, {type: 'wall', x: 150, y: 150},  {type: 'floor', x: 200, y: 150}, {type: 'wall', x: 250, y: 150},  {type: 'floor', x: 300, y: 150}, {type: 'wall', x: 350, y: 150},  {type: 'floor', x: 400, y: 150}, {type: 'wall', x: 450, y: 150}, {type: 'floor', x: 500, y: 150}],
    [{type: 'floor', x: 0, y: 200}, {type: 'floor', x: 50, y: 200}, {type: 'floor', x: 100, y: 200}, {type: 'floor', x: 150, y: 200}, {type: 'floor', x: 200, y: 200}, {type: 'floor', x: 250, y: 200}, {type: 'floor', x: 300, y: 200}, {type: 'floor', x: 350, y: 200}, {type: 'floor', x: 400, y: 200}, {type: 'floor', x: 450, y: 200}, {type: 'floor', x: 500, y: 200}],
    [{type: 'floor', x: 0, y: 250}, {type: 'wall', x: 50, y: 250},  {type: 'floor', x: 100, y: 250}, {type: 'wall', x: 150, y: 250},  {type: 'floor', x: 200, y: 250}, {type: 'wall', x: 250, y: 250},  {type: 'floor', x: 300, y: 250}, {type: 'wall', x: 350, y: 250},  {type: 'floor', x: 400, y: 250}, {type: 'wall', x: 450, y: 250}, {type: 'floor', x: 500, y: 250}],
    [{type: 'floor', x: 0, y: 300}, {type: 'floor', x: 50, y: 300}, {type: 'floor', x: 100, y: 300}, {type: 'floor', x: 150, y: 300}, {type: 'floor', x: 200, y: 300}, {type: 'floor', x: 250, y: 300}, {type: 'floor', x: 300, y: 300}, {type: 'floor', x: 350, y: 300}, {type: 'floor', x: 400, y: 300}, {type: 'floor', x: 450, y: 300}, {type: 'floor', x: 500, y: 300}],
    [{type: 'floor', x: 0, y: 350}, {type: 'wall', x: 50, y: 350},  {type: 'floor', x: 100, y: 350}, {type: 'wall', x: 150, y: 350},  {type: 'floor', x: 200, y: 350}, {type: 'wall', x: 250, y: 350},  {type: 'floor', x: 300, y: 350}, {type: 'wall', x: 350, y: 350},  {type: 'floor', x: 400, y: 350}, {type: 'wall', x: 450, y: 350}, {type: 'floor', x: 500, y: 350}],
    [{type: 'floor', x: 0, y: 400}, {type: 'floor', x: 50, y: 400}, {type: 'floor', x: 100, y: 400}, {type: 'floor', x: 150, y: 400}, {type: 'floor', x: 200, y: 400}, {type: 'floor', x: 250, y: 400}, {type: 'floor', x: 300, y: 400}, {type: 'floor', x: 350, y: 400}, {type: 'floor', x: 400, y: 400}, {type: 'floor', x: 450, y: 400}, {type: 'floor', x: 500, y: 400}],
    [{type: 'floor', x: 0, y: 450}, {type: 'wall', x: 50, y: 450},  {type: 'floor', x: 100, y: 450}, {type: 'wall', x: 150, y: 450},  {type: 'floor', x: 200, y: 450}, {type: 'wall', x: 250, y: 450},  {type: 'floor', x: 300, y: 450}, {type: 'wall', x: 350, y: 450},  {type: 'floor', x: 400, y: 450}, {type: 'wall', x: 450, y: 450}, {type: 'floor', x: 500, y: 450}],
    [{type: 'floor', x: 0, y: 500, player: true}, {type: 'floor', x: 50, y: 500}, {type: 'floor', x: 100, y: 500}, {type: 'floor', x: 150, y: 500}, {type: 'floor', x: 200, y: 500}, {type: 'floor', x: 250, y: 500}, {type: 'floor', x: 300, y: 500}, {type: 'floor', x: 350, y: 500}, {type: 'floor', x: 400, y: 500}, {type: 'floor', x: 450, y: 500}, {type: 'floor', x: 500, y: 500}],
]

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    PLAYERS_ONLINE++;
    socket.id = Math.random();
    socket.x = 10;
    socket.y = 0;
    socket.bombTime = 35;
    socket.bombStrength = 1;
    socket.bombLimit = 1;
    socket.bombsUp = 0;
    SOCKET_LIST[socket.id] = socket
    _socket = socket;
    console.log("new socket connected")
    console.log('Players online: ' + PLAYERS_ONLINE)

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id]
        console.log("socket disconnected");
        PLAYERS_ONLINE--;
    })  

    socket.on('move', function(data) {
        socket = _socket
        if(data.directory === 'left') {
            if(!(socket.y - 1 < 0 || map[socket.x][socket.y - 1].type === 'wall')) {
                map[socket.x][socket.y].player = false;
                socket.y -= 1
                map[socket.x][socket.y].player = true;
            }
        } else if(data.directory === 'right') {
            if(!(socket.y + 1 > 10 || map[socket.x][socket.y + 1].type === 'wall')) {
                map[socket.x][socket.y].player = false;
                socket.y += 1
                map[socket.x][socket.y].player = true;
            }
        } else if(data.directory === 'up') {
            if(!(socket.x - 1 < 0 || map[socket.x - 1][socket.y].type === 'wall')) {
                map[socket.x][socket.y].player = false;
                socket.x -= 1
                map[socket.x][socket.y].player = true
            }
        } else if(data.directory === 'down') {
            if(!(socket.x + 1 > 10 || map[socket.x + 1][socket.y].type === 'wall')) {
                map[socket.x][socket.y].player = false;
                socket.x += 1;
                map[socket.x][socket.y].player = true
            }
        }
    })

    socket.on('put_bomb', function(data) {
        if(socket.bombsUp < socket.bombLimit) {
            map[socket.x][socket.y].bomb = true
            bombs.push({
                x: socket.x,
                y: socket.y,
                timeToExplode: socket.bombTime,
                owner: socket
            })
            socket.bombsUp++;
        }
    })
})

setInterval(function() {
    for(var i in bombs) {
        var bomb = bombs[i];
        bomb.timeToExplode--;
        if(bomb.timeToExplode <= 0) {
            map[bomb.x][bomb.y].bomb = false
            _socket.bombsUp--;
            SOCKET_LIST[_socket.id] = _socket
            delete bombs[i]
        }
    }
    var pack = {map: map};
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('newPosition', pack)
    }
}, 1000/25)