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
var _explodes = [];
var sizeX = 11;
var map = []

buildMap(0);

function buildMap(players) {
    
    for (var i = 0; i<sizeX; i++){
        map[i]=new Array(sizeX);
    }
    
    for (var i = 0; i<sizeX; i++){
        for (var j = 0; j<sizeX; j++){
            map[i][j] = {type: 'wallTD', x: j*50, y: i*50, player : false}; 
            if(i % 2 == 1 && j % 2 == 1 ){
                map[i][j].type = 'wall'; 
            } else {
                if(Math.random() < 0.2){
                    map[i][j].type = 'floor';
                }
            }
        }
    }
    
    map[0][0].type = 'floor';
    map[0][1].type = 'floor';
    map[1][0].type = 'floor';
    map[sizeX-1][0].type = 'floor';
    map[sizeX-2][0].type = 'floor';
    map[sizeX-1][1].type = 'floor';
    map[sizeX-1][sizeX-1].type = 'floor';
    map[sizeX-2][sizeX-1].type = 'floor';
    map[sizeX-1][sizeX-2].type = 'floor';
    map[0][sizeX-1].type = 'floor';
    map[1][sizeX-1].type = 'floor';
    map[0][sizeX-2].type = 'floor';
    if(players === 1 || players === 2 || players === 3 || players === 4) {
        map[10][0].player = 'player1'
    } else if(players === 2 || players === 3 || players === 4) {
        map[10][10].player = 'player2'
    } else if(players === 3 || players === 4) {
        map[0][10].player = 'player3'
    } else if(players === 4) {
        map[0][0].player = 'player4'
    }
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    if(PLAYERS_ONLINE === 0) {
        socket.x = sizeX-1;
        socket.y = 0;
        socket.player = 'player1'
    } else if(PLAYERS_ONLINE === 1) {
        socket.x = sizeX-1;
        socket.y = sizeX-1;
        socket.player = 'player2'
    } else if(PLAYERS_ONLINE === 2) {
        socket.x = 0;
        socket.y = sizeX-1;
        socket.player = 'player3'
    } else if(PLAYERS_ONLINE === 3) {
        socket.x = 0;
        socket.y = 0;
        socket.player = 'player4'
    } else {
        socket.x = 10;
        socket.y = 0;
    }
    socket.start = {
        x: socket.x,
        y: socket.y
    }
    PLAYERS_ALIVE++;
    PLAYERS_ONLINE++;
    socket.id = Math.random();
    socket.bombTime = 35;
    socket.bombStrength = STARTING_STRENGTH;
    socket.bombLimit = STARTING_BOMB_LIMIT;
    socket.bombsUp = 0;
    SOCKET_LIST[socket.id] = socket
    _socket = socket;
    console.log("new socket connected")
    console.log('Players online: ' + PLAYERS_ONLINE)
    map[socket.x][socket.y].player = socket.player;
    pack = {map: map}
    socket.emit("newPosition", pack)

    generate_events(socket)
})

function generate_events(socket) {
    socket.on('disconnect', function() {
        map[socket.x][socket.y].player = false
        delete SOCKET_LIST[socket.id]
        console.log("socket disconnected");
        PLAYERS_ONLINE--;
    })  

    socket.on('move', function(data) {
        _socket = socket
        if(data.directory === 'left') {
            if(!(socket.y - 1 < 0 || 
                map[socket.x][socket.y - 1].type === 'wall' ||
                map[socket.x][socket.y - 1].type === 'wallTD' || 
                map[socket.x][socket.y - 1].player || 
                map[socket.x][socket.y - 1].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.y -= 1
                    map[socket.x][socket.y].player = socket.player;
            }
        } else if(data.directory === 'right') {
            if(!(socket.y + 1 > sizeX-1 || 
                map[socket.x][socket.y + 1].type === 'wall' ||
                map[socket.x][socket.y + 1].type === 'wallTD' || 
                map[socket.x][socket.y + 1].player || 
                map[socket.x][socket.y + 1].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.y += 1
                    map[socket.x][socket.y].player = socket.player;
            }
        } else if(data.directory === 'up') {
            if(!(socket.x - 1 < 0 || 
                map[socket.x - 1][socket.y].type === 'wall' ||
                map[socket.x - 1][socket.y].type === 'wallTD' || 
                map[socket.x - 1][socket.y].player || 
                map[socket.x - 1][socket.y].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.x -= 1
                    map[socket.x][socket.y].player = socket.player
            }
        } else if(data.directory === 'down') {
            if(!(socket.x + 1 > sizeX-1 || 
                map[socket.x + 1][socket.y].type === 'wall' ||
                map[socket.x + 1][socket.y].type === 'wallTD' || 
                map[socket.x + 1][socket.y].player || 
                map[socket.x + 1][socket.y].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.x += 1;
                    map[socket.x][socket.y].player = socket.player
            }
        }
        check_if_user_is_on_field_with_boost();
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
}

var game;

function startInterval() {
    game = setInterval(forInterval, 1000/25)
}

startInterval();

function stopInterval() {
    clearInterval(game)
}

function forInterval() {
    if(_explodes) {
        check_if_user_is_in_explosion_area();
    }
    for(var i in bombs) {
        var bomb = bombs[i];
        bomb.timeToExplode--;
        if(bomb.timeToExplode <= 0) {
            map[bomb.x][bomb.y].bomb = false
            _socket.bombsUp--;
            SOCKET_LIST[_socket.id] = _socket
            delete bombs[i]
            generateExplode(bomb)
        }
    }
    for(var i in _explodes) {
        if(_explodes[i][0].timeToDisappear > 0) {
            _explodes[i][0].timeToDisappear--;
        } else {
            for(var j in _explodes[i][1]) {
                map[_explodes[i][1][j].x][_explodes[i][1][j].y].explode = false
            }
            delete _explodes[i]
        }
    }
    var pack = {map: map};
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('newPosition', pack)
    }
}

function generateExplode(bomb) {
    var wallUp, wallDown, wallLeft, wallRight;
    map[bomb.x][bomb.y].explode = true
    var explodes = [{timeToDisappear: 15}]
    var explodesToSend = [];
    explodesToSend.push({
        x: bomb.x,
        y: bomb.y
    })
    for(var i=0; i<bomb.owner.bombStrength+1; i++) {
        if(!(bomb.x - i < 0)) {
            if(map[bomb.x - i][bomb.y].type === 'wall' || wallUp === true) {
                wallUp = true;
            } else if(map[bomb.x - i][bomb.y].type === 'wallTD' && wallUp !== true) {
                map[bomb.x - i][bomb.y].explode = true
                explodesToSend.push({
                    x: bomb.x - i,
                    y: bomb.y
                })
                wallUp = true        
            } else {
                map[bomb.x - i][bomb.y].explode = true
                explodesToSend.push({
                    x: bomb.x - i,
                    y: bomb.y
                })
            }
        }
        if(!(bomb.x + i > 10)) {
            if(map[bomb.x + i][bomb.y].type === 'wall' || wallDown === true) {
                wallDown = true;
            } else if(map[bomb.x + i][bomb.y].type === 'wallTD' && wallDown !== true) {
                map[bomb.x + i][bomb.y].explode = true
                explodesToSend.push({
                    x: bomb.x + i,
                    y: bomb.y
                })
                wallDown = true;
            } else {
                map[bomb.x + i][bomb.y].explode = true
                explodesToSend.push({
                    x: bomb.x + i,
                    y: bomb.y
                })
            }
        }
        if(!(bomb.y + i > 10)) {
            if(map[bomb.x][bomb.y + i].type === 'wall' || wallRight === true) {
                wallRight = true;
            } else if(map[bomb.x][bomb.y + i].type === 'wallTD' && wallRight !== true) {
                map[bomb.x][bomb.y + i].explode = true
                explodesToSend.push({
                    x: bomb.x,
                    y: bomb.y + i
                })
                wallRight = true;
            } else {
                map[bomb.x][bomb.y + i].explode = true
                explodesToSend.push({
                    x: bomb.x,
                    y: bomb.y + i
                })
            }
        }
        if(!(bomb.y - i < 0)) {
            if(map[bomb.x][bomb.y - i].type === 'wall' || wallLeft === true) {
                wallLeft = true;
            } else if(map[bomb.x][bomb.y - i].type === 'wallTD' && wallLeft !== true) {
                map[bomb.x][bomb.y - i].explode = true
                explodesToSend.push({
                    x: bomb.x,
                    y: bomb.y - i
                })
                wallLeft = true;        
            } else {
                map[bomb.x][bomb.y - i].explode = true
                explodesToSend.push({
                    x: bomb.x,
                    y: bomb.y - i
                })
            }
        }
    }
    explodes.push(
        explodesToSend
    )
    _explodes.push(explodes);

    check_if_wallTD_is_in_explosion_area();
    check_if_user_is_in_explosion_area();
}

function check_if_user_is_in_explosion_area() {
    for(var socket_num in SOCKET_LIST) {
        var socket = SOCKET_LIST[socket_num]
        for(var i in _explodes) {
            for(var j in _explodes[i][1]) {
                if(socket.x === _explodes[i][1][j].x && socket.y === _explodes[i][1][j].y) {
                    PLAYERS_ALIVE--;
                    map[socket.x][socket.y].player = false
                    SOCKET_LIST[socket_num].dead = true;
                }
            }
        }
    }
    if(PLAYERS_ONLINE > 1) {
        if(PLAYERS_ALIVE <= 1) {
            reset_map()
        }
    } else {
        if(PLAYERS_ALIVE <= 0) {
            reset_map();
        }
    }
}

function reset_map() {
    stopInterval();
    map = [
        [{type: 'floor', x: 0, y: 0},   {type: 'floor', x: 50, y: 0},   {type: 'wallTD', x: 100, y: 0},   {type: 'wallTD', x: 150, y: 0},   {type: 'wallTD', x: 200, y: 0},   {type: 'wallTD', x: 250, y: 0},   {type: 'wallTD', x: 300, y: 0},   {type: 'wallTD', x: 350, y: 0},   {type: 'wallTD', x: 400, y: 0},   {type: 'floor', x: 450, y: 0}, {type: 'floor', x: 500, y: 0}],
        [{type: 'floor', x: 0, y: 50},  {type: 'wall', x: 50, y: 50},   {type: 'wallTD', x: 100, y: 50},  {type: 'wall', x: 150, y: 50},   {type: 'wallTD', x: 200, y: 50},  {type: 'wall', x: 250, y: 50},   {type: 'wallTD', x: 300, y: 50},  {type: 'wall', x: 350, y: 50},   {type: 'wallTD', x: 400, y: 50},  {type: 'wall', x: 450, y: 50}, {type: 'floor', x: 500, y: 50}],
        [{type: 'wallTD', x: 0, y: 100}, {type: 'wallTD', x: 50, y: 100}, {type: 'floor', x: 100, y: 100}, {type: 'wallTD', x: 150, y: 100}, {type: 'wallTD', x: 200, y: 100}, {type: 'wallTD', x: 250, y: 100}, {type: 'wallTD', x: 300, y: 100}, {type: 'wallTD', x: 350, y: 100}, {type: 'floor', x: 400, y: 100}, {type: 'wallTD', x: 450, y: 100}, {type: 'wallTD', x: 500, y: 100}],
        [{type: 'wallTD', x: 0, y: 150}, {type: 'wall', x: 50, y: 150},  {type: 'wallTD', x: 100, y: 150}, {type: 'wall', x: 150, y: 150},  {type: 'wallTD', x: 200, y: 150}, {type: 'wall', x: 250, y: 150},  {type: 'wallTD', x: 300, y: 150}, {type: 'wall', x: 350, y: 150},  {type: 'wallTD', x: 400, y: 150}, {type: 'wall', x: 450, y: 150}, {type: 'wallTD', x: 500, y: 150}],
        [{type: 'wallTD', x: 0, y: 200}, {type: 'wallTD', x: 50, y: 200}, {type: 'wallTD', x: 100, y: 200}, {type: 'wallTD', x: 150, y: 200}, {type: 'wallTD', x: 200, y: 200}, {type: 'wallTD', x: 250, y: 200}, {type: 'wallTD', x: 300, y: 200}, {type: 'wallTD', x: 350, y: 200}, {type: 'wallTD', x: 400, y: 200}, {type: 'wallTD', x: 450, y: 200}, {type: 'wallTD', x: 500, y: 200}],
        [{type: 'wallTD', x: 0, y: 250}, {type: 'wall', x: 50, y: 250},  {type: 'wallTD', x: 100, y: 250}, {type: 'wall', x: 150, y: 250},  {type: 'wallTD', x: 200, y: 250}, {type: 'wall', x: 250, y: 250},  {type: 'wallTD', x: 300, y: 250}, {type: 'wall', x: 350, y: 250},  {type: 'wallTD', x: 400, y: 250}, {type: 'wall', x: 450, y: 250}, {type: 'wallTD', x: 500, y: 250}],
        [{type: 'wallTD', x: 0, y: 300}, {type: 'wallTD', x: 50, y: 300}, {type: 'wallTD', x: 100, y: 300}, {type: 'wallTD', x: 150, y: 300}, {type: 'wallTD', x: 200, y: 300}, {type: 'wallTD', x: 250, y: 300}, {type: 'wallTD', x: 300, y: 300}, {type: 'wallTD', x: 350, y: 300}, {type: 'wallTD', x: 400, y: 300}, {type: 'wallTD', x: 450, y: 300}, {type: 'wallTD', x: 500, y: 300}],
        [{type: 'wallTD', x: 0, y: 350}, {type: 'wall', x: 50, y: 350},  {type: 'wallTD', x: 100, y: 350}, {type: 'wall', x: 150, y: 350},  {type: 'wallTD', x: 200, y: 350}, {type: 'wall', x: 250, y: 350},  {type: 'wallTD', x: 300, y: 350}, {type: 'wall', x: 350, y: 350},  {type: 'wallTD', x: 400, y: 350}, {type: 'wall', x: 450, y: 350}, {type: 'wallTD', x: 500, y: 350}],
        [{type: 'wallTD', x: 0, y: 400}, {type: 'wallTD', x: 50, y: 400}, {type: 'floor', x: 100, y: 400}, {type: 'wallTD', x: 150, y: 400}, {type: 'wallTD', x: 200, y: 400}, {type: 'wallTD', x: 250, y: 400}, {type: 'wallTD', x: 300, y: 400}, {type: 'wallTD', x: 350, y: 400}, {type: 'floor', x: 400, y: 400}, {type: 'wallTD', x: 450, y: 400}, {type: 'wallTD', x: 500, y: 400}],
        [{type: 'floor', x: 0, y: 450}, {type: 'wall', x: 50, y: 450},  {type: 'wallTD', x: 100, y: 450}, {type: 'wall', x: 150, y: 450},  {type: 'wallTD', x: 200, y: 450}, {type: 'wall', x: 250, y: 450},  {type: 'wallTD', x: 300, y: 450}, {type: 'wall', x: 350, y: 450},  {type: 'wallTD', x: 400, y: 450}, {type: 'wall', x: 450, y: 450}, {type: 'floor', x: 500, y: 450}],
        [{type: 'floor', x: 0, y: 500}, {type: 'floor', x: 50, y: 500}, {type: 'wallTD', x: 100, y: 500}, {type: 'wallTD', x: 150, y: 500}, {type: 'wallTD', x: 200, y: 500}, {type: 'wallTD', x: 250, y: 500}, {type: 'wallTD', x: 300, y: 500}, {type: 'wallTD', x: 350, y: 500}, {type: 'wallTD', x: 400, y: 500}, {type: 'floor', x: 450, y: 500}, {type: 'floor', x: 500, y: 500}],
    ]
    PLAYERS_ALIVE = 0;
    for(var i in SOCKET_LIST) {
        // PLAYERS_ONLINE--
        // SOCKET_LIST[i].emit('finish')
        SOCKET_LIST[i].x = SOCKET_LIST[i].start.x
        SOCKET_LIST[i].y = SOCKET_LIST[i].start.y
        map[SOCKET_LIST[i].x][SOCKET_LIST[i].y].player = SOCKET_LIST[i].player;
        SOCKET_LIST[i].bombLimit = STARTING_BOMB_LIMIT;
        SOCKET_LIST[i].bombStrength = STARTING_STRENGTH;
        SOCKET_LIST[i].bombsUp = 0;
        PLAYERS_ALIVE++;
    }
    buildMap(1);
    startInterval();
}

function check_if_wallTD_is_in_explosion_area() {
    for(var i in _explodes) {
        for(var j in _explodes[i][1]) {
            if(map[_explodes[i][1][j].x][_explodes[i][1][j].y].type === 'wallTD') {
                map[_explodes[i][1][j].x][_explodes[i][1][j].y].type = 'floor';
                random = Math.floor((Math.random() * 100) + 1); // Generate random number to know if there should be boost or not
                                                                // 1-15 - bombBoost, 16-30 - strengthBoost
                if(random >= 1 && random <= 15) {
                    map[_explodes[i][1][j].x][_explodes[i][1][j].y].bombBoost = true;
                } else if(random >= 16 && random <= 30) {
                    map[_explodes[i][1][j].x][_explodes[i][1][j].y].strengthBoost = true;
                }
            }
        }
    }
}

function check_if_user_is_on_field_with_boost() {
    if(map[_socket.x][_socket.y].bombBoost) {
        map[_socket.x][_socket.y].bombBoost = false;
        _socket.bombLimit++;
        SOCKET_LIST[_socket.id] = _socket
    } else if(map[_socket.x][_socket.y].strengthBoost) {
        map[_socket.x][_socket.y].strengthBoost = false;
        _socket.bombStrength++;
        SOCKET_LIST[_socket.id] = _socket
    }
}