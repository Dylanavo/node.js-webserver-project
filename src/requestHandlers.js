//requestHandlers.js
"using strict";

var fs = require("fs");
var path = require("path");
var readline = require("readline");
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

function reqFavi(request, response)
{
	console.log("Request handler 'favicon' was called.");
	
	fs.readFile("./favicon.ico", function(err, data)
	{
		if (err)
		{
			//should only error if 404.html is missing from html folder
			console.log(err);
			
			response.writeHead(500, {"Content-Type":"text/html"});
			response.write("<h2>500</h2>\n<p>Could not find favicon.ico, contact server admin!<p>");
			response.end();
		}
		else
		{
			response.writeHead(200, {"Content-Type":"image/x-icon"});
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
			//should only error if 404.html is missing from html folder
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
		
		var body = "<h3>Received upload:</h3>\n<p>";
		var line = "";
		
		for(var key in field)
		{
			if(field.hasOwnProperty(key))
			{
				body += key + ":" + field[key] + ", ";
				line += field[key] + ", ";
			}
		}
		
		//get rid of the last ', '
		body = body.slice(0, -2);
		body += "</p>"
		line = line.slice(0, -2);
		line += "\n";

		fs.appendFile("./student_info/student_info.csv", line, function(err)
		{
			if(err)
			{
				console.log("Data was not appended")
				response.writeHead(500, {"content-type": "text/html"});
				response.write("<h3>Error:</h3>\n<p>Data did not append to file!</p>");
				response.end();	
			}
			else
			{
				console.log("Data was appeneded - User input: " + line);
				response.writeHead(200, {"content-type": "text/html"});
				response.write(body);
				response.end();	
			}
		});
	});
}

function reqSearchDetails(request, response)
{
	console.log("Request handler 'search' was called.");
	
	console.log("...parsing form...");
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp";
	form.parse(request, function(error, field, file)
	{
		console.log("parsing done");
		
		//should probably check there is something in field["Degree"]
		var searchTerm = field["Degree"];
		searchTerm = searchTerm.toLowerCase();
		var body = "<h3>Search Results for " + searchTerm;
		var results = [];

		var lineReader = readline.createInterface(
		{
			input: fs.createReadStream("./student_info/student_info.csv"),
			terminal: false
		});
		
		//what to do for each line of the file
		lineReader.on("line", function(line)
		{
			//this will grab just the degree part of the csv
			var degree = line.split(",")[5];
			if(degree.toLowerCase().indexOf(searchTerm) != -1)
			{
				results.push(line);
			}
		});
		
		//what to do after the file is read
		lineReader.on("close", function()
		{
			body += ": " + results.length + " results</h3>\n"
		
			for(i=0; i<results.length; i++)
			{
				body += "<p>" + results[i] + "</p>\n"
			}
		
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(body);
			response.end();
		});
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
exports.reqFavi = reqFavi;
exports.req404 = req404;
exports.reqStudentDetails = reqStudentDetails;
exports.reqSearchDetails = reqSearchDetails;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;
