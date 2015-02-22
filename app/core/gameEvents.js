//(function () {
//    'use strict';
    
//    function startGame() {

//    }
var connectedUsers = {};

module.exports = function (socket) {
    console.log(socket.request.user);
    console.log('Client connected with id: ' + socket.id);
    
    connectedUsers[socket.request.user._id] = {id: socket.request.user._id, x: 600, y: 400, distanceTraveled: 0};

    socket.emit('new', connectedUsers);
    

    socket.on('tick', function (data) {
        connectedUsers[socket.request.user._id] = data;

        socket.to(socket.id).emit('update', connectedUsers);
    });
    
    socket.on('die', function (data) {
        socket.emit('death', connectedUsers[socket.request.user._id]);
        socket.request.user.highestDistance = data.highestDistance;
        socket.request.user.save(function (err) {
            if (err) return handleError(err);
            // saved!
        });
        delete connectedUsers[socket.request.user._id];
    });
    //event when a client disconnects from the app
    socket.on('disconnect', function () {
        delete connectedUsers[socket.request.user._id];

        console.log('Client disconnected with id: ' + socket.id);
    });
};
//});

