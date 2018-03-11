var express = require('express');
var app = express();
var serv = require('http').Server(app)

app.use('/', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server started');

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
    console.log("socket.connection")
})