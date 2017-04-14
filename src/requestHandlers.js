//requestHandlers.js
"using strict";

var fs = require("fs");
var path = require("path");
var formidable = require("formidable");

//not too sure about this method, may of over-thunk
//when trying to make it generic enough to load any
//text file (html/css/js).
function reqFile(request, response, pathname) 
{
	console.log("Request handler 'reqFile' was called.");
	
	//get path extension
	var ext = path.extname(pathname);
	var file = "";
	var type = "";
	
	switch(ext)
	{
		case "":
			if(pathname == "/" || pathname == "/index")
			{
				file = "./html/index.html";
				type = "html";
			}
			break;
		case ".html":
			file += "./html" + pathname;
			type = "html";
			break;
		case ".css":
			file += "./css" + pathname;
			type = "css";
			break;
		case ".js":
			file += "./js" + pathname;
			type = "js";
			break;
		default:
	}
	
	fs.readFile(file, "utf8", function(err, data)
	{
		if (err)
		{
			console.log(err);
			
			req404(request, response);
		}
		else
		{
			response.writeHead(200, {"Content-Type":"text/" + type});
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

function reqStudentDetails(request, response)
{
	console.log("Request handler 'student details' was called.");
	console.log("...parsing form...");
	
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp";
	form.parse(request, function(error, field, file)
	{
		console.log("parsing done");
		
		var body = "Received upload:\n\n";
		
		for(var key in field)
		{
			if(field.hasOwnProperty(key))
			{
				body += key + ":" + field[key] + ", ";
			}
		}
		
		response.writeHead(200, {"content-type": "text/plain"});
		response.write(body);
		response.end();	
		
		/*
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
		*/
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

exports.reqFile = reqFile;
exports.req404 = req404;
exports.reqStudentDetails = reqStudentDetails;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;
