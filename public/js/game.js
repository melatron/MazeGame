(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var SnakeGame = (function () {
    'use strict';

    var fps = 50,
        interval = 1000 / fps,
        direction = 1,
        loopObj,
        canvas = $('#game-plot')[0],
        context = canvas.getContext('2d');

    function loop() {
        setTimeout(function () {
            loopObj = requestAnimationFrame(loop);

            //draw logic here:
            socket.emit('loop', {
                direction: direction
            });
        }, interval);
    }



    function addEvents() {
        $(document).off('keydown').on('keydown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            switch (e.keyCode) {
                case 37:
                    direction = 0;
                    console.log('left');
                    return;
                case 38:
                    direction = 1;
                    console.log('up');
                    return;
                case 39:
                    direction = 2;
                    console.log('right');
                    return;
                case 40:
                    
                    direction = 3;
                    console.log('down');
                    return;
                default:
                    return;
            }
        });

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        var colors = [];

        for (var i = 0; i < 100; i++) {
            colors[i] = getRandomColor();
        }

        function printPlot(plot) {
            var row = '';
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < 40; j++) {
                    row += plot[i][j] + ' ';
                }
                console.log(row);
                row = '';
            }
        }

        socket.on('draw', function (data) {
            printPlot(data);
            context.fillStyle = "white";
            context.fillRect(0, 0, 640, 480);
            for (var i = 0; i < 30; i++) {
                for (var j = 0; j < 40; j++) {
                    if (data[i][j] == -1) {
                        context.fillStyle = 'black';
                        context.fillRect(j * 16, i * 16, 16, 16);
                    } else if(data[i][j] != 0){
                        context.fillStyle = colors[data[i][j]];
                        context.fillRect(j * 16, i * 16, 16, 16);
                    }
                }
            }
        });

        socket.on('dead', function () {
            window.cancelAnimationFrame(loopObj);
        });
    }

    return {
        init: function (options) {
            //addEvents();
            //loop();
            console.log('Game initialized!');
            fps =  50;
            interval = 1000 / fps;
        },
        draw: function (data) {
            console.log(data);
        },
        die: function () {
            endGame();
        },
        win: function () {
            winGame();
        }
    };
})();

$(function () {
    'use strict'
    var url = 'http://' + window.location.host;
    //window.socket = io.connect(url);
    debugger;
    window.socket = io.connect(url);
    console.log('on event is set!');
    
    //Game.init();
    
    socket.on('draw', function (params) {
        Game.draw(params);
    });
    
    socket.on('die', function (params) {
        //console.log(params);
        Game.die();
    });
    
    socket.on('win', function (params) {
        //console.log(params);
        Game.win();
    });
});