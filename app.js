var express = require('express');
<<<<<<< HEAD
<<<<<<< HEAD
var app = express();	
=======
var app = express();
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
var app = express();
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
var serv = require('http').createServer(app)
require('./variables.js');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/menu.html');
})

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));
app.use('/client', express.static(__dirname + '/client'));


serv.listen(process.env.PORT || 2000);
console.log('Server started');

var SOCKET_LIST = {}
var bombs = []
var room = { link: '3bnr5t', players: {} }
var _socket = {}
var _explodes = [];
var sizeX = 11;
var map = []

buildMap(0);
<<<<<<< HEAD

function buildMap(players) {

    for (var i = 0; i < sizeX; i++) {
        map[i] = new Array(sizeX);
    }

    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeX; j++) {
            map[i][j] = { type: 'wallTD', x: j * 50, y: i * 50, player: false };
            if (i % 2 == 1 && j % 2 == 1) {
                map[i][j].type = 'wall';
            } else {
                if (Math.random() < 0.2) {
                    map[i][j].type = 'floor';
                }
            }
        }
    }

    map[0][0].type = 'floor';
    map[0][1].type = 'floor';
    map[1][0].type = 'floor';
    map[sizeX - 1][0].type = 'floor';
    map[sizeX - 2][0].type = 'floor';
    map[sizeX - 1][1].type = 'floor';
    map[sizeX - 1][sizeX - 1].type = 'floor';
    map[sizeX - 2][sizeX - 1].type = 'floor';
    map[sizeX - 1][sizeX - 2].type = 'floor';
    map[0][sizeX - 1].type = 'floor';
    map[1][sizeX - 1].type = 'floor';
    map[0][sizeX - 2].type = 'floor';
    if (players === 1) {
        map[10][0].player = 'player1'
    } else if (players === 2) {
        map[10][0].player = 'player1'
        map[10][10].player = 'player2'
    } else if (players === 3) {
        map[10][0].player = 'player1'
        map[10][10].player = 'player2'
        map[0][10].player = 'player3'
    } else if (players === 4) {
        map[10][0].player = 'player1'
        map[10][10].player = 'player2'
        map[0][10].player = 'player3'
        map[0][0].player = 'player4'
    }
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    if (PLAYERS_ONLINE === 0) {
        socket.x = sizeX - 1;
        socket.y = 0;
        socket.player = 'player1'
<<<<<<< HEAD
    } else if(PLAYERS_ONLINE === 1) {
        socket.x = sizeX-1;
        socket.y = sizeX-1;
=======

function buildMap(players) {

    for (var i = 0; i < sizeX; i++) {
        map[i] = new Array(sizeX);
    }

    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeX; j++) {
            map[i][j] = { type: 'wallTD', x: j * 50, y: i * 50, player: false };
            if (i % 2 == 1 && j % 2 == 1) {
                map[i][j].type = 'wall';
            } else {
                if (Math.random() < 0.2) {
                    map[i][j].type = 'floor';
                }
            }
        }
    }

    map[0][0].type = 'floor';
    map[0][1].type = 'floor';
    map[1][0].type = 'floor';
    map[sizeX - 1][0].type = 'floor';
    map[sizeX - 2][0].type = 'floor';
    map[sizeX - 1][1].type = 'floor';
    map[sizeX - 1][sizeX - 1].type = 'floor';
    map[sizeX - 2][sizeX - 1].type = 'floor';
    map[sizeX - 1][sizeX - 2].type = 'floor';
    map[0][sizeX - 1].type = 'floor';
    map[1][sizeX - 1].type = 'floor';
    map[0][sizeX - 2].type = 'floor';
    if (players === 1) {
        map[10][0].player = 'player1'
    } else if (players === 2) {
        map[10][0].player = 'player1'
        map[10][10].player = 'player2'
    } else if (players === 3) {
        map[10][0].player = 'player1'
        map[10][10].player = 'player2'
        map[0][10].player = 'player3'
    } else if (players === 4) {
        map[10][0].player = 'player1'
        map[10][10].player = 'player2'
        map[0][10].player = 'player3'
        map[0][0].player = 'player4'
    }
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    if (PLAYERS_ONLINE === 0) {
        socket.x = sizeX - 1;
        socket.y = 0;
        socket.player = 'player1'
    } else if (PLAYERS_ONLINE === 1) {
        socket.x = sizeX - 1;
        socket.y = sizeX - 1;
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
        socket.player = 'player2'
    } else if (PLAYERS_ONLINE === 2) {
        socket.x = 0;
<<<<<<< HEAD
        socket.y = sizeX-1;
=======
        socket.y = sizeX - 1;
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
    } else if (PLAYERS_ONLINE === 1) {
        socket.x = sizeX - 1;
        socket.y = sizeX - 1;
        socket.player = 'player2'
    } else if (PLAYERS_ONLINE === 2) {
        socket.x = 0;
        socket.y = sizeX - 1;
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        socket.player = 'player3'
    } else if (PLAYERS_ONLINE === 3) {
        socket.x = 0;
        socket.y = 0;
        socket.player = 'player4'
    } else {
<<<<<<< HEAD
<<<<<<< HEAD
        socket.x = sizeX-1;
=======
        socket.x = sizeX - 1;
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
        socket.x = sizeX - 1;
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        socket.y = 0;
    }
    socket.start = {
        x: socket.x,
        y: socket.y
    }
    PLAYERS_ALIVE++;
    PLAYERS_ONLINE++;
    socket.id = Math.random();
    socket.bombTime = 40;
    socket.bombStrength = STARTING_STRENGTH;
    socket.bombLimit = STARTING_BOMB_LIMIT;
    socket.bombsUp = 0;
    SOCKET_LIST[socket.id] = socket
    _socket = socket;
<<<<<<< HEAD
<<<<<<< HEAD
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('updatePlayers', {players: PLAYERS_ONLINE})
=======
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('updatePlayers', { players: PLAYERS_ONLINE })
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        socket.emit('updatePlayers', { players: PLAYERS_ONLINE })
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
    }
    console.log("new socket connected")
    map[socket.x][socket.y].player = socket.player;
    pack = { map: map }
    socket.emit("newPosition", pack)

    generate_events(socket)
})

function generate_events(socket) {
<<<<<<< HEAD
<<<<<<< HEAD
    socket.on('disconnect', function() {
=======
    socket.on('disconnect', function () {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        PLAYERS_ONLINE--;
        for (var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i]
<<<<<<< HEAD
            socket.emit('updatePlayers', {players: PLAYERS_ONLINE})
=======
    socket.on('disconnect', function () {
        PLAYERS_ONLINE--;
        for (var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i]
            socket.emit('updatePlayers', { players: PLAYERS_ONLINE })
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
            socket.emit('updatePlayers', { players: PLAYERS_ONLINE })
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        }
        map[socket.x][socket.y].player = false
        delete SOCKET_LIST[socket.id]
        console.log("socket disconnected");
<<<<<<< HEAD
<<<<<<< HEAD
    })  
=======
    })
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f

    socket.on('move', function (data) {
        if (socket.dead !== true) {
            _socket = socket
            if (data.directory === 'left') {
                if (!(socket.y - 1 < 0 ||
                    map[socket.x][socket.y - 1].type === 'wall' ||
                    map[socket.x][socket.y - 1].type === 'wallTD' ||
                    map[socket.x][socket.y - 1].player ||
                    map[socket.x][socket.y - 1].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.y -= 1
                    map[socket.x][socket.y].player = socket.player;
                }
            } else if (data.directory === 'right') {
                if (!(socket.y + 1 > sizeX - 1 ||
                    map[socket.x][socket.y + 1].type === 'wall' ||
                    map[socket.x][socket.y + 1].type === 'wallTD' ||
                    map[socket.x][socket.y + 1].player ||
                    map[socket.x][socket.y + 1].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.y += 1
                    map[socket.x][socket.y].player = socket.player;
                }
            } else if (data.directory === 'up') {
                if (!(socket.x - 1 < 0 ||
                    map[socket.x - 1][socket.y].type === 'wall' ||
                    map[socket.x - 1][socket.y].type === 'wallTD' ||
                    map[socket.x - 1][socket.y].player ||
                    map[socket.x - 1][socket.y].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.x -= 1
                    map[socket.x][socket.y].player = socket.player
<<<<<<< HEAD
            }
        } else if(data.directory === 'down') {
            if(!(socket.x + 1 > sizeX-1 || 
                map[socket.x + 1][socket.y].type === 'wall' ||
                map[socket.x + 1][socket.y].type === 'wallTD' || 
                map[socket.x + 1][socket.y].player || 
                map[socket.x + 1][socket.y].bomb)) {
=======
    })

    socket.on('move', function (data) {
        if (socket.dead !== true) {
            _socket = socket
            if (data.directory === 'left') {
                if (!(socket.y - 1 < 0 ||
                    map[socket.x][socket.y - 1].type === 'wall' ||
                    map[socket.x][socket.y - 1].type === 'wallTD' ||
                    map[socket.x][socket.y - 1].player ||
                    map[socket.x][socket.y - 1].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.y -= 1
                    map[socket.x][socket.y].player = socket.player;
                }
            } else if (data.directory === 'right') {
                if (!(socket.y + 1 > sizeX - 1 ||
                    map[socket.x][socket.y + 1].type === 'wall' ||
                    map[socket.x][socket.y + 1].type === 'wallTD' ||
                    map[socket.x][socket.y + 1].player ||
                    map[socket.x][socket.y + 1].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.y += 1
                    map[socket.x][socket.y].player = socket.player;
                }
            } else if (data.directory === 'up') {
                if (!(socket.x - 1 < 0 ||
                    map[socket.x - 1][socket.y].type === 'wall' ||
                    map[socket.x - 1][socket.y].type === 'wallTD' ||
                    map[socket.x - 1][socket.y].player ||
                    map[socket.x - 1][socket.y].bomb)) {
                    map[socket.x][socket.y].player = false;
                    socket.x -= 1
                    map[socket.x][socket.y].player = socket.player
=======
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
                }
            } else if (data.directory === 'down') {
                if (!(socket.x + 1 > sizeX - 1 ||
                    map[socket.x + 1][socket.y].type === 'wall' ||
                    map[socket.x + 1][socket.y].type === 'wallTD' ||
                    map[socket.x + 1][socket.y].player ||
                    map[socket.x + 1][socket.y].bomb)) {
<<<<<<< HEAD
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
                    map[socket.x][socket.y].player = false;
                    socket.x += 1;
                    map[socket.x][socket.y].player = socket.player
                }
            }
            check_if_user_is_on_field_with_boost();
        }
    })

    socket.on('put_bomb', function (data) {
        if (socket.dead !== true) {
            if (socket.bombsUp < socket.bombLimit) {
                map[socket.x][socket.y].bomb = true
                bombs.push({
                    x: socket.x,
                    y: socket.y,
                    timeToExplode: socket.bombTime,
                    owner: socket
                })
                socket.bombsUp++;
            }
        }
    })
}

var game;

function startInterval() {
    game = setInterval(forInterval, 1000 / 25)
}

startInterval();

function stopInterval() {
    clearInterval(game)
}

function forInterval() {
    if (_explodes) {
        check_if_user_is_in_explosion_area();
    }
<<<<<<< HEAD
<<<<<<< HEAD
    for(var i in _explodes) {
        if(_explodes[i][0].timeToDisappear > 0) {
=======
    for (var i in _explodes) {
        if (_explodes[i][0].timeToDisappear > 0) {
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
    for (var i in _explodes) {
        if (_explodes[i][0].timeToDisappear > 0) {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
            _explodes[i][0].timeToDisappear--;
        } else {
            for (var j in _explodes[i][1]) {
                map[_explodes[i][1][j].x][_explodes[i][1][j].y].explode = false
            }
            delete _explodes[i]
        }
    }
<<<<<<< HEAD
<<<<<<< HEAD
    for(var i in bombs) {
=======
    for (var i in bombs) {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        var bomb = bombs[i];
        if (bomb) {
            bomb.timeToExplode--;
<<<<<<< HEAD
            if(bomb.timeToExplode <= 0) {
=======
    for (var i in bombs) {
        var bomb = bombs[i];
        if (bomb) {
            bomb.timeToExplode--;
            if (bomb.timeToExplode <= 0) {
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
            if (bomb.timeToExplode <= 0) {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
                map[bomb.x][bomb.y].bomb = false
                _socket.bombsUp--;
                SOCKET_LIST[_socket.id] = _socket
                delete bombs[i]
                generateExplode(bomb)
            }
        }
    }
<<<<<<< HEAD
<<<<<<< HEAD
    var pack = {map: map};
    for(var i in SOCKET_LIST) {
=======
    var pack = { map: map };
    for (var i in SOCKET_LIST) {
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
    var pack = { map: map };
    for (var i in SOCKET_LIST) {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        var socket = SOCKET_LIST[i]
        socket.emit('newPosition', pack)
    }
}

function generateExplode(bomb) {
    var wallUp, wallDown, wallLeft, wallRight;
    map[bomb.x][bomb.y].explode = true
    var explodes = [{ timeToDisappear: 15 }]
    var explodesToSend = [];
    explodesToSend.push({
        x: bomb.x,
        y: bomb.y
    })
    for (var i = 0; i < bomb.owner.bombStrength + 1; i++) {
        if (!(bomb.x - i < 0)) {
            if (map[bomb.x - i][bomb.y].type === 'wall' || wallUp === true) {
                wallUp = true;
            } else if (map[bomb.x - i][bomb.y].type === 'wallTD' && wallUp !== true) {
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
        if (!(bomb.x + i > 10)) {
            if (map[bomb.x + i][bomb.y].type === 'wall' || wallDown === true) {
                wallDown = true;
            } else if (map[bomb.x + i][bomb.y].type === 'wallTD' && wallDown !== true) {
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
        if (!(bomb.y + i > 10)) {
            if (map[bomb.x][bomb.y + i].type === 'wall' || wallRight === true) {
                wallRight = true;
            } else if (map[bomb.x][bomb.y + i].type === 'wallTD' && wallRight !== true) {
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
        if (!(bomb.y - i < 0)) {
            if (map[bomb.x][bomb.y - i].type === 'wall' || wallLeft === true) {
                wallLeft = true;
            } else if (map[bomb.x][bomb.y - i].type === 'wallTD' && wallLeft !== true) {
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
<<<<<<< HEAD
    check_if_wallTD_is_in_explosion_area();
=======
    check_if_wallTD_or_bonus_is_in_explosion_area();
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
    check_if_user_is_in_explosion_area();
    check_if_bomb_is_in_explosion_area();
}

function check_if_bomb_is_in_explosion_area() {
<<<<<<< HEAD
<<<<<<< HEAD
    for(var bomb_num in bombs) {
        var bomb = bombs[bomb_num]
        for(var i in _explodes) {
            if(_explodes[i]) {
                for(var j in _explodes[i][1]) {
                    if(_explodes[i]) {
                        if(bomb.x === _explodes[i][1][j].x && bomb.y === _explodes[i][1][j].y) {
=======
    for (var bomb_num in bombs) {
        var bomb = bombs[bomb_num]
=======
    for (var bomb_num in bombs) {
        var bomb = bombs[bomb_num]
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        for (var i in _explodes) {
            if (_explodes[i]) {
                for (var j in _explodes[i][1]) {
                    if (_explodes[i]) {
                        if (bomb.x === _explodes[i][1][j].x && bomb.y === _explodes[i][1][j].y) {
<<<<<<< HEAD
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
                            map[bomb.x][bomb.y].bomb = false
                            _socket.bombsUp--;
                            SOCKET_LIST[_socket.id] = _socket
                            delete bombs[bomb_num]
                            generateExplode(bomb)
                        }
                    }
                }
            }
        }
    }
}

function check_if_user_is_in_explosion_area() {
    for (var socket_num in SOCKET_LIST) {
        var socket = SOCKET_LIST[socket_num]
        for (var i in _explodes) {
            for (var j in _explodes[i][1]) {
                if (socket.x === _explodes[i][1][j].x && socket.y === _explodes[i][1][j].y) {
                    PLAYERS_ALIVE--;
                    map[socket.x][socket.y].player = false
<<<<<<< HEAD
<<<<<<< HEAD
                    socket.x = -50
                    socket.y = -50
=======
                    socket.x = undefined
                    socket.y = undefined
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
                    SOCKET_LIST[socket_num].x = 1;
                    SOCKET_LIST[socket_num].x = 1;
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
                    SOCKET_LIST[socket_num].dead = true;
                }
            }
        }
    }
<<<<<<< HEAD
<<<<<<< HEAD
    if(PLAYERS_ONLINE > 1) {
        if(PLAYERS_ALIVE <= 1) {
            reset_map()
        }
    } else {
        if(PLAYERS_ALIVE <= 0) {
=======
    if (PLAYERS_ONLINE > 1) {
        if (PLAYERS_ALIVE <= 1) {
            reset_map()
        }
    } else {
        if (PLAYERS_ALIVE <= 0) {
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
    if (PLAYERS_ONLINE > 1) {
        if (PLAYERS_ALIVE <= 1) {
            reset_map()
        }
    } else {
        if (PLAYERS_ALIVE <= 0) {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
            reset_map();
        }
    }
}

function reset_map() {
    stopInterval();
    PLAYERS_ALIVE = 0;
    _explodes = []
    bombs = []
    buildMap(PLAYERS_ALIVE);
<<<<<<< HEAD
<<<<<<< HEAD
    for(var i in SOCKET_LIST) {
=======
    for (var i in SOCKET_LIST) {
>>>>>>> abaa4a282d4a253d8adf8bac272c75fdd6e597cf
=======
    for (var i in SOCKET_LIST) {
>>>>>>> 6914f7d8d660bbe3ea61534c56732799bbe73d3f
        // PLAYERS_ONLINE--
        // SOCKET_LIST[i].emit('finish')
        SOCKET_LIST[i].x = SOCKET_LIST[i].start.x
        SOCKET_LIST[i].y = SOCKET_LIST[i].start.y
        SOCKET_LIST[i].dead = false;
        map[SOCKET_LIST[i].x][SOCKET_LIST[i].y].player = SOCKET_LIST[i].player;
        SOCKET_LIST[i].bombLimit = STARTING_BOMB_LIMIT;
        SOCKET_LIST[i].bombStrength = STARTING_STRENGTH;
        SOCKET_LIST[i].bombsUp = 0;
        PLAYERS_ALIVE++;
    }
    startInterval();
}

function check_if_wallTD_or_bonus_is_in_explosion_area() {
    for (var i in _explodes) {
        for (var j in _explodes[i][1]) {
            if (map[_explodes[i][1][j].x][_explodes[i][1][j].y].type === 'wallTD') {
                map[_explodes[i][1][j].x][_explodes[i][1][j].y].type = 'floor';
                random = Math.floor((Math.random() * 100) + 1); // Generate random number to know if there should be boost or not
                // 1-15 - bombBoost, 16-30 - strengthBoost
                if (random >= 1 && random <= 15) {
                    map[_explodes[i][1][j].x][_explodes[i][1][j].y].bombBoost = true;
                } else if (random >= 16 && random <= 30) {
                    map[_explodes[i][1][j].x][_explodes[i][1][j].y].strengthBoost = true;
                }
            } else if (map[_explodes[i][1][j].x][_explodes[i][1][j].y].bombBoost === true) {
                map[_explodes[i][1][j].x][_explodes[i][1][j].y].bombBoost = false
            } else if (map[_explodes[i][1][j].x][_explodes[i][1][j].y].strengthBoost === true) {
                map[_explodes[i][1][j].x][_explodes[i][1][j].y].strengthBoost = false
            }
        }
    }
}

function check_if_user_is_on_field_with_boost() {
    if (map[_socket.x][_socket.y].bombBoost) {
        map[_socket.x][_socket.y].bombBoost = false;
        _socket.bombLimit++;
        SOCKET_LIST[_socket.id] = _socket
    } else if (map[_socket.x][_socket.y].strengthBoost) {
        map[_socket.x][_socket.y].strengthBoost = false;
        _socket.bombStrength++;
        SOCKET_LIST[_socket.id] = _socket
    }
}