const OSC = require("osc-js")

const udp_osc = new OSC({
    plugin: new OSC.DatagramPlugin({
        open: {port: 9129},
        send: {port: 9128}
    })
});
let udp_sender = null;

const ws_osc = new OSC({
    plugin: new OSC.WebsocketServerPlugin({
        port: 8000
    })
});
let ws_sender = null;

// listen for invoing messages

udp_osc.on("*", message => {
    console.log(message);
    // if(udp_sender) udp_sender(message); // echo (break VCV)
    if(ws_sender) ws_sender(message);
});

// sent messages frequently when socket is ready

udp_osc.on("open", () => {
    console.log("udp server started");
    udp_sender = msg => udp_osc.send(msg);
});

ws_osc.on("open", () => {
    console.log("ws server started");
    ws_sender = msg => ws_osc.send(msg);
});

ws_osc.on("connect", () => {
    console.log("ws new client");
});

udp_osc.open();
ws_osc.open();


var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./The_Force");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(8080);