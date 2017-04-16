//index.js
"use strict";

//settings
var port = 41152;

//would probably have other settings to
//allow defining which file to write log
//statements too etc. For now just writing
//to console

//get all exported functionality
//from our scripts
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

//create handle object literal
var handle = {};

//using associate array (also know as key/value map etc)
//each element (key) points to an appropriate handler (value)
//
//this is basically defining what resource indentifiers
//the client can use to actually get the server to do something
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
server.startServer(router.route, handle, port);
