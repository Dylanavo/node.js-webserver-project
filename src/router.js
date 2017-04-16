//route.js
"use strict";

// create route function with pathname as parameter
//
// in order to make requestHandlers more generic should
// we be making more complicated decisions here?
// (e.g. if requested resource ends in .png/.jpg/.gif, route to
// image request handler, or if it ends in .html/.css/.js
// route to file request handler
function route(pathname, handle, request, response) 
{
	console.log("About to route a request for: " + pathname);
	
	//if path is the name of a handler function
	if (typeof handle[pathname] == "function")
	{
		//run that function
		handle[pathname](request, response, pathname);
	}
	//if path is NOT a name of a handler function
	else
	{
		console.log("No request handler found for: " + pathname);
		handle["404"](request, response);
	}
}

// export route function
exports.route = route;