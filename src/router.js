//route.js
"use strict";

// create route function with pathname as parameter
function route(pathname, handle, request, response) 
{
	console.log("About to route a request for: " + pathname);
	
	//if path is the name of a handler function
	if (typeof handle[pathname] == "function")
	{
		//run that function
		handle[pathname](request, response);
	}
	//if path is NOT a name of a handler function
	else
	{
		console.log("No request handler found for: " + pathname);
		
		//send 404 back to client
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("Resource not found!");
		response.end();
	}
}

// export route function
exports.route = route;