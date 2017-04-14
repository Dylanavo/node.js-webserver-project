//requestHandlers.js
"using strict";

var fs = require("fs");
var formidable = require("formidable");

//not a very flexible approach, might consider
//something more like reqHTML and pass in 
//the pathname then let server return it if it exists
function reqIndex(request, response) 
{
	console.log("Request handler 'start' was called.");
	
	fs.readFile("./html/index.html", "utf8", function(err, data)
	{
		if (err)
		{
			//should only error if index.html is missing from html folder
			console.log(err);
			
			response.writeHead(500, {"Content-Type":"text/html"});
			response.write("<h2>500</h2>\n<p>Could not find index.html, contact server admin!<p>");
			response.end();
		}
		else
		{
			response.writeHead(200, {"Content-Type":"text/html"});
			response.write(data);
			response.end();
		}
	});
}

//same issue as above, make more generic
function reqCSS(request, response)
{
	console.log("Request handler 'css' was called.");
	
	fs.readFile("./css/style.css", "utf8", function(err, data)
	{
		if (err)
		{
			//should only error if index.html is missing from html folder
			console.log(err);
			
			response.writeHead(500, {"Content-Type":"text/html"});
			response.write("<h2>500</h2>\n<p>Could not find style.css, contact server admin!<p>");
			response.end();
		}
		else
		{
			response.writeHead(200, {"Content-Type":"text/css"});
			response.write(data);
			response.end();
		}
	});
}

//same issue as above, make more generic
function reqJS(request, response)
{
	console.log("Request handler 'js' was called.");
	
	fs.readFile("./js/client.js", "utf8", function(err, data)
	{
		if (err)
		{
			//should only error if index.html is missing from html folder
			console.log(err);
			
			response.writeHead(500, {"Content-Type":"text/html"});
			response.write("<h2>500</h2>\n<p>Could not find client.js, contact server admin!<p>");
			response.end();
		}
		else
		{
			response.writeHead(200, {"Content-Type":"text/javascript"});
			response.write(data);
			response.end();
		}
	});
}

function req404(request, response)
{
	console.log("Request handler '404' was called.");
	
	fs.readFile("./html/404.html", "utf8", function(err, data)
	{
		if (err)
		{
			//should only error if index.html is missing from html folder
			console.log(err);
			
			response.writeHead(500, {"Content-Type":"text/html"});
			response.write("<h2>500</h2>\n<p>Could not find 404.html, contact server admin!<p>");
			response.end();
		}
		else
		{
			response.writeHead(200, {"Content-Type":"text/html"});
			response.write(data);
			response.end();
		}
	});
}

function reqUpload(request, response) 
{
	console.log("Request handler 'upload' was called.");
	console.log("...parse file...");
	
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp";
	form.parse(request, function(error, field, file)
	{
		console.log("parsing done");
		
		//possibly error on windows systems
		//tried to rename to an already existing file
		fs.rename(file.upload.path,"./test.png",function(err)
		{
			if (err) 
			{
				fs.unlink("./test.png");
				fs.rename(file.upload.path,"./test.png");
			}
		});
		
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("Received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function reqShow(request, response)
{
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("./test.png").pipe(response);
}

exports.reqIndex = reqIndex;
exports.reqCSS = reqCSS;
exports.reqJS = reqJS;
exports.req404 = req404;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;
