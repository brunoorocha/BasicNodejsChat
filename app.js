
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var usersOnline = {};

app.use(express.static('public'));

app.get('/', function(require, response){
  response.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('add user', function(nickname){
    usersOnline[socket.id] = nickname;
    io.emit('join', nickname);
    io.emit('list users', usersOnline);
  });

  socket.on('disconnect', function(nickname){
    io.emit('exit', usersOnline[socket.id]);

    delete usersOnline[socket.id];
    io.emit('list users', usersOnline);
  });
});

http.listen(3000, function(){
  console.log("Listening on *:3000");
});
