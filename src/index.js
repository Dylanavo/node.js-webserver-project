//index.js
"use strict";

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

//create handle object literal
var handle = {};

//using associate array (also know as key/value map etc)
//each element (key) points to an appropriate handler (value)
handle["/"] = requestHandlers.reqFile;
handle["/index"] = requestHandlers.reqFile;
handle["/index.html"] = requestHandlers.reqFile;
handle["/favicon.ico"] = requestHandlers.reqFavi;
handle["/style.css"] = requestHandlers.reqFile;
handle["/client.js"] = requestHandlers.reqFile;
handle["/optionForm.html"] = requestHandlers.reqFile;
handle["/studentForm.html"] = requestHandlers.reqFile;
handle["/searchForm.html"] = requestHandlers.reqFile;
handle["/uploadForm.html"] = requestHandlers.reqFile;
handle["/checks.png"] = requestHandlers.reqChecks;
handle["/postStudentDetails"] = requestHandlers.reqStudentDetails;
handle["/postSearchForm"] = requestHandlers.reqSearchDetails;
handle["/upload"] = requestHandlers.reqUpload;
handle["/show"] = requestHandlers.reqShow;
handle["404"] = requestHandlers.req404;

//call startServer() associated with
//server object and pass the router 
//function associated with router 
//object in as param
//Also pass in our assoc array that contains
//the handlers needed by route to handle requests
server.startServer(router.route, handle);
