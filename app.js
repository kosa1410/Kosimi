var express = require('express');
var app = express();
var serv = require('http').createServer(app)
require('./variables.js');

var t=1;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/menu.html');
})

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/client/menu.html');
});

app.post('/game', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.post('/random', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
    randomMode = true;
});

app.get('/random', function (req, res) {
    res.sendFile(__dirname + '/client/menu.html');
});

app.post('/battle', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
    battleRoyalMode = true;
    zone = 0;
});

app.get('/battle', function (req, res) {
    res.sendFile(__dirname + '/client/menu.html');
});

app.use(express.static(__dirname + '/client'));
app.use('/client', express.static(__dirname + '/client'));


serv.listen(process.env.PORT || 2000);
console.log('Server started');

var zone;
var battleRoyalMode = false;
var randomMode = false;
var SOCKET_LIST = {}
var bombs = []
var room = { link: '3bnr5t', players: {} }
var _socket = {}
var _explodes = [];
var sizeX = 11;
var map = [];
var interval = false;

buildMap(0);

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

function checkIfPlayerIsTaken(player) {
    for (var socket in SOCKET_LIST) {
        if (SOCKET_LIST[socket].player === player) {
            return true;
        }
    }
    return false;
}

const players = {
    player1: {
        x: sizeX - 1,
        y: 0,
        player: 'player1'
    },
    player2: {
        x: sizeX - 1,
        y: sizeX - 1,
        player: 'player2'
    },
    player3: {
        x: 0,
        y: sizeX - 1,
        player: 'player3'
    },
    player4: {
        x: 0,
        y: 0,
        player: 'player4'
    }
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    if (PLAYERS_ONLINE === 0) {
        if (interval === false) {
            startInterval();
        }
        socket.x = players.player1.x;
        socket.y = players.player1.y;
        socket.player = players.player1.player;
    } else if (PLAYERS_ONLINE === 1) {
        if (!checkIfPlayerIsTaken('player2')) {
            socket.x = players.player2.x;
            socket.y = players.player2.y;
            socket.player = players.player2.player;
        } else {
            socket.x = players.player1.x;
            socket.y = players.player1.y;
            socket.player = players.player1.player;
        }
    } else if (PLAYERS_ONLINE === 2) {
        if(!checkIfPlayerIsTaken('player3')) {
            socket.x = players.player3.x;
            socket.y = players.player3.y;
            socket.player = players.player3.player;
        } else if (!checkIfPlayerIsTaken('player2')) {
            socket.x = players.player2.x;
            socket.y = players.player2.y;
            socket.player = players.player2.player;
        } else {
            socket.x = players.player1.x;
            socket.y = players.player1.y;
            socket.player = players.player1.player;
        }
    } else if (PLAYERS_ONLINE === 3) {
        if (!checkIfPlayerIsTaken('player4')) {
            socket.x = players.player4.x;
            socket.y = players.player4.y;
            socket.player = players.player4.player;
        } else if (!checkIfPlayerIsTaken('player3')) {
            socket.x = players.player3.x;
            socket.y = players.player3.y;
            socket.player = players.player3.player;
        } else if (!checkIfPlayerIsTaken('player2')) {
            socket.x = players.player2.x;
            socket.y = players.player2.y;
            socket.player = players.player2.player;
        } else {
            socket.x = players.player1.x;
            socket.y = players.player1.y;
            socket.player = players.player1.player;
        }
    } else {
        socket.x = sizeX - 1;
        socket.y = 0;
    }

    
    socket.emit('setPlayer', { player: socket.player });
    socket.start = {
        x: socket.x,
        y: socket.y
    }
    socket.dead = false;
    PLAYERS_ALIVE++;
    PLAYERS_ONLINE++;
    socket.id = Math.random();
    socket.bombTime = 2;
    socket.bombStrength = STARTING_STRENGTH;
    socket.bombLimit = STARTING_BOMB_LIMIT;
    socket.bombsUp = 0;
    socket.score = 0;
    SOCKET_LIST[socket.id] = socket
    _socket = socket;
    io.emit('updatePlayers', { players: PLAYERS_ONLINE })
    io.emit('updatePlayersAlive', { players: PLAYERS_ALIVE })

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]
        io.emit('setScore',{ player: socket.player, score: socket.score})
        io.emit('setBombLimit', { player: socket.player, bL: socket.bombLimit})
        io.emit('setBombStrength', { player: socket.player, bS: socket.bombStrength})
    }
    console.log("new socket connected")
    map[socket.x][socket.y].player = socket.player;
    pack = { map: map }
    io.emit("newPosition", pack)

    generate_events(socket)
})

function generate_events(socket) {
    socket.on('disconnect', function () {
        PLAYERS_ONLINE--;
        PLAYERS_ALIVE--;
        io.emit('updatePlayers', { players: PLAYERS_ONLINE })
        io.emit('updatePlayersAlive', { players: PLAYERS_ALIVE })

        // for (var i in SOCKET_LIST) {
        //     var socket = SOCKET_LIST[i]
        //     socket.emit('updatePlayers', { players: PLAYERS_ONLINE })
        // }
        map[socket.x][socket.y].player = false
        delete SOCKET_LIST[socket.id]
        var pack = { map: map };
        io.emit('newPosition', pack);
        console.log("socket disconnected");
    })

    socket.on('move', function (data) {
        if (socket.dead != true) {
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
                }
            } else if (data.directory === 'down') {
                if (!(socket.x + 1 > sizeX - 1 ||
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
    check_if_user_is_in_explosion_area();
    var pack = { map: map };
    io.emit('newPosition', pack);
    // for (var i in SOCKET_LIST) {
    //     var thsSck = SOCKET_LIST[i]
    //     socket.emit('newPosition', pack)
    // }
            //
           // check_if_user_is_on_field_with_boost();
        }
    })

    socket.on('put_bomb', function (data) {
        if (socket.dead !== true) {
            if (socket.bombsUp < socket.bombLimit) {
                map[socket.x][socket.y].bomb = true
                bombs.push({
                    x: socket.x,
                    y: socket.y,
                    timeToExplode: t+socket.bombTime,
                    owner: socket
                })
                socket.bombsUp++;
                io.emit('newPosition', pack);
            }
        }
    })
}

var game;

function startInterval() {
    interval = true;
    game = setInterval(forInterval, 1000)
}


function stopInterval() {
    interval = false;
    clearInterval(game)
}


function forInterval(){
    if(PLAYERS_ONLINE<1){
        if (interval === true) {
            stopInterval();
        }
        t=0;
        battleRoyalMode = false;
        randomMode = false;
    }
    t=t+1;
    io.emit('updateTime',t);

    if(PLAYERS_ONLINE>=1 && randomMode == true && t % 10 == 0 ){
        randomizeMap();
    }
    if(PLAYERS_ONLINE>=1 && battleRoyalMode == true && t % 25 == 0){
        battleRoyal(zone);
        zone++;
    }
    

    for (var i in bombs) {
                var bomb = bombs[i];
                if (bomb) {
                    if (bomb.timeToExplode <= t) {
                        map[bomb.x][bomb.y].bomb = false
                        bomb.owner.bombsUp--;
                        //SOCKET_LIST[_socket.id] = _socket
                        delete bombs[i]
                        generateExplode(bomb)
                    }
                }
            }
            for (var i in _explodes) {
                        if (_explodes[i][0].timeToDisappear <= t) {
                        for (var j in _explodes[i][1]) {
                                map[_explodes[i][1][j].x][_explodes[i][1][j].y].explode = false
                            }
                            delete _explodes[i];
                            pack = {map: map};
                            io.emit('newPosition', pack);
                        }
                    }
}

// function forInterval() {
//     if (_explodes) {
//         check_if_user_is_in_explosion_area();
//     }
//     for (var i in _explodes) {
//         if (_explodes[i][0].timeToDisappear > 0) {
//             _explodes[i][0].timeToDisappear--;
//         } else {
//             for (var j in _explodes[i][1]) {
//                 map[_explodes[i][1][j].x][_explodes[i][1][j].y].explode = false
//             }
//             delete _explodes[i]
//         }
//     }
//     for (var i in bombs) {
//         var bomb = bombs[i];
//         if (bomb) {
//             bomb.timeToExplode--;
//             if (bomb.timeToExplode <= 0) {
//                 map[bomb.x][bomb.y].bomb = false
//                 _socket.bombsUp--;
//                 SOCKET_LIST[_socket.id] = _socket
//                 delete bombs[i]
//                 generateExplode(bomb)
//             }
//         }
//     }
//     var pack = { map: map };
//     io.emit('newPosition', pack)
//     // for (var i in SOCKET_LIST) {
//     //     var socket = SOCKET_LIST[i]
//     //     socket.emit('newPosition', pack)
//     // }
// }

function generateExplode(bomb) {
    var wallUp, wallDown, wallLeft, wallRight;
    map[bomb.x][bomb.y].explode = true
    var explodes = [{ timeToDisappear: t+1 }]
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
    check_if_wallTD_or_bonus_is_in_explosion_area();
    check_if_user_is_in_explosion_area();
    check_if_bomb_is_in_explosion_area();
    pack = {map: map};
    io.emit('newPosition', pack);
}

function check_if_bomb_is_in_explosion_area() {
    for (var bomb_num in bombs) {
        var bomb = bombs[bomb_num]
        for (var i in _explodes) {
            if (_explodes[i]) {
                for (var j in _explodes[i][1]) {
                    if (_explodes[i]) {
                        if (bomb.x === _explodes[i][1][j].x && bomb.y === _explodes[i][1][j].y) {
                            map[bomb.x][bomb.y].bomb = false
                            bomb.owner.bombsUp--;
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
                    SOCKET_LIST[socket_num].x = 1;
                    SOCKET_LIST[socket_num].x = 1;
                    SOCKET_LIST[socket_num].dead = true;
                }
            }
        }
    }
    if (PLAYERS_ONLINE > 1) {
        if (PLAYERS_ALIVE <= 1) {
            for (var i in SOCKET_LIST){
                if (SOCKET_LIST[i].dead === false){
                    SOCKET_LIST[i].score++;
                }
           }        
           reset_map();
        }
    } else {
        if (PLAYERS_ALIVE <= 0) {
            reset_map();
        }
    }
}

function reset_map() {
    //stopInterval();
    var scores = [0,0,0,0];
    PLAYERS_ALIVE = 0;
    _explodes = []
    bombs = []
    var j=0;
    buildMap(PLAYERS_ALIVE);
    for (var i in SOCKET_LIST) {
        // PLAYERS_ONLINE--
        // SOCKET_LIST[i].emit('finish')
        //scores[j]=SOCKET_LIST[i].score
        j++;
        SOCKET_LIST[i].x = SOCKET_LIST[i].start.x
        SOCKET_LIST[i].y = SOCKET_LIST[i].start.y
        SOCKET_LIST[i].dead = false;
        map[SOCKET_LIST[i].x][SOCKET_LIST[i].y].player = SOCKET_LIST[i].player;
        SOCKET_LIST[i].bombLimit = STARTING_BOMB_LIMIT;
        SOCKET_LIST[i].bombStrength = STARTING_STRENGTH;
        SOCKET_LIST[i].bombsUp = 0;
        PLAYERS_ALIVE++;
    
        var socket = SOCKET_LIST[i]
        io.emit('setScore',{ player: socket.player, score: socket.score})
        io.emit('setBombLimit', { player: socket.player, bL: socket.bombLimit})
        io.emit('setBombStrength', { player: socket.player, bS: socket.bombStrength})
        
    }
    
    //startInterval();
}

function randomizeMap(){
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeX; j++) {
                  
            if (map[i][j].player == false && map[checkRange(i-1)][j].player == false && map[checkRange(i+1)][j].player == false && map[i][checkRange(j-1)].player == false  && map[i][checkRange(j+1)].player == false){
                map[i][j] = { type: 'wallTD', x: j * 50, y: i * 50, player: false};
                if (i % 2 == 1 && j % 2 == 1) {
                    map[i][j].type = 'wall';
                } else {
                    if (Math.random() < 0.6) {
                        map[i][j].type = 'floor';
                    }
                }
            }
       }
    }
    pack = {map: map};
    io.emit('newPosition', pack);
}

function battleRoyal(zone){
    var explodes = [{ timeToDisappear: undefined }]
    var explodesToSend = [];
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeX; j++) {
            if(i==zone || i == sizeX - 1 - zone){
                
                map[i][j].explode=true;
                explodesToSend.push({
                    x: i,
                    y: j
                })
            }else if (j == zone || j == sizeX - 1 - zone){
                map[i][j].explode=true;
                explodesToSend.push({
                    x: i,
                    y: j
                })
            }
       }
    }
    explodes.push(explodesToSend);
    _explodes.push(explodes);
    pack = {map: map};
    io.emit('newPosition', pack);
}

function checkRange(i){
    if(i < 0){
        return 0;
    }else if (i >= sizeX){
        return sizeX-1;
    }
    return i;
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
        io.emit("setBombLimit", {player: _socket.player, bL: _socket.bombLimit});
        SOCKET_LIST[_socket.id] = _socket
    } else if (map[_socket.x][_socket.y].strengthBoost){ 
        map[_socket.x][_socket.y].strengthBoost = false;
        _socket.bombStrength++;
        io.emit("setBombStrength", {player: _socket.player, bS: _socket.bombStrength});
        SOCKET_LIST[_socket.id] = _socket
    }
}