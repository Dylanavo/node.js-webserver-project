//index.js
"use strict";

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

//create handle object literal
var handle = {};

//using associate array (also know as key/value map etc)
//each element (key) points to an appropriate handler (value)
handle["/"] = requestHandlers.reqIndex;
handle["/index"] = requestHandlers.reqIndex;
handle["/index.html"] = requestHandlers.reqIndex;
handle["/style.css"] = requestHandlers.reqCSS;
handle["/client.js"] = requestHandlers.reqJS;
handle["404"] = requestHandlers.req404;
handle["/upload"] = requestHandlers.reqUpload;
handle["/show"] = requestHandlers.reqShow;

//call startServer() associated with
//server object and pass the router 
//function associated with router 
//object in as param
//Also pass in our assoc array that contains
//the handlers needed by route to handle requests
server.startServer(router.route, handle);
