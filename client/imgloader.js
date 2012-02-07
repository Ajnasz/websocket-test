/*global MozWebSocket: true */
var imgDataReceived = function (d) {
    var image, foo;
    foo = document.getElementById('foo');
    image = new Image();
    image.src = 'data:' + d.type + ';base64,' + d.data;
    while (foo.firstChild) {
        foo.removeChild(foo.firstChild);
    }
    document.getElementById('foo').appendChild(image);
};
window.addEventListener('load', function () {
    var socket, img;
    socket = new MozWebSocket('ws://localhost:8080', 'echo-protocol');
    img = '';
    socket.addEventListener('message', function (e) {
        var data = e.data,
            msgParts,
            d, image;
        if (data.indexOf("\r\n\r\n") > -1) {
            msgParts = data.split('\r\n\r\n');
            img += decodeURIComponent(msgParts[0]);
            imgDataReceived(JSON.parse(img));
            img = msgParts[1];
        } else {
            img += decodeURIComponent(data);
        }
    });
    document.getElementById('load').addEventListener('click', function () {
        socket.send('load');
    }, false);
    document.getElementById('stop').addEventListener('click', function () {
        socket.send('noload');
    }, false);
});

