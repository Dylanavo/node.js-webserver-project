//server.js
"use strict";

var http = require("http"); // import http core modules
var url = require("url"); // import url core modules

var port = 41152;

function startServer(route, handle)
{
	function onRequest(request, response)
	{
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		route(pathname, handle, request, response);
	}
	
	http.createServer(onRequest).listen(port);
	
	console.log("Server started!");
	console.log("Server running on port " + port);
	console.log("Server PID: ", process.pid);
}

exports.startServer = startServer;