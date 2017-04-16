//server.js
"use strict";

var http = require("http");
var url = require("url");
var datetime = require("./datetime");

function startServer(route, handle, port)
{
	//define our request callback
	function onRequest(request, response)
	{
		//when we get a request parse the url 
		//and grab the path name, then log
		//and pass everything off to route
		var pathname = url.parse(request.url).pathname;
		console.log("\n"+datetime.getDateTime()+"\nRequest for " + pathname + " received.");
		route(pathname, handle, request, response);
	}
	
	//create server, register request callback, then start
	//listening on passed in port number
	http.createServer(onRequest).listen(port);
	
	//log server details to console
	console.log("Server started!");
	console.log("Server running on port " + port);
	console.log("Server PID: ", process.pid);
}

//export startServer function
exports.startServer = startServer;