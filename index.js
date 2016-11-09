var clock = require('express')();
var http = require('http').Server(clock);
var io = require('socket.io')(http),
    users = {};


clock.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    socket.send('users',users);
    socket.on('new user' , function() {
        if ( socket.id in users === false) {
            users[socket.id] = socket.id;
            io.emit('users' , Object.keys(users));
        }
        console.log(users);
        socket.broadcast.emit('create box' , socket.id);
    });

    socket.on('position' , function(data){
        if (data.x && data.y && data.colour) {
            data.id = socket.id;
            socket.broadcast.emit('position' , data);
        }
    });

    socket.on('disconnect' , function(){
        if (!socket.id) return;
        delete users[socket.id];
        io.emit('users' , Object.keys(users));
        console.log(users);
    });
});
http.listen(8080, function(){
   console.log('listening on *:3000');
});

// http.listen(process.env.PORT || 3000, function(){
//   console.log("Express server listening on port"  + this.address().port);
// });
