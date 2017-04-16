//requestHandlers.js
"using strict";

var fs = require("fs");
var path = require("path");
var readline = require("readline");
var formidable = require("formidable");

//req file is the only function that takes
//a pathname, all other functions have pathname
//sent to them as well by the router, but it is
//not used, but could be accessed with arguments[2]
function reqFile(request, response, pathname) 
{
	console.log("Request handler 'request File' was called.");
	
	//get path extension
	var ext = path.extname(pathname);
	var file = "";
	var type = "";
	
	//it might make more sense to have this switch in router.js
	//and only calling reqFile once router has determined file type
	//then decided to route the request to reqFile
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
	
	//attempt to read the file
	fs.readFile(file, "utf8", function(err, data)
	{
		//if error (file not found) log it and display 404 error page
		if (err)
		{
			console.log(err);
			
			req404(request, response);
		}
		//otherwise send file to client
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
			//should only error if favicon.ico is missing from html folder
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
	
	//get our form object
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp";
	
	//parse the incoming request with all the form
	//data. field data goes into field assoc array,
	//file data is stored in file
	form.parse(request, function(error, field, file)
	{
		console.log("parsing done");
		
		//prepare our response 
		var body = "<h3>Received upload:</h3>\n<p>";
		var line = "";
		
		//for every key in field assoc array
		for(var key in field)
		{
			//check if element key refers to
			//is defined by this object, and
			//not inherited (like from base Object)
			if(field.hasOwnProperty(key))
			{
				//append current key and value to body
				//response string seperated by a ','
				body += key + ":" + field[key] + ", ";
				
				//append current key and value to line
				//to be written to console and file
				line += field[key] + ",";
			}
		}
		
		//get rid of the last ', '
		body = body.slice(0, -2);
		body += "</p>"
		
		//get rid of the last ','
		line = line.slice(0, -1);
		line += "\n";

		//open file in append mode (or create if doesn't exist) and
		//try write the data to it
		fs.appendFile("./student_info/student_info.csv", line, function(err)
		{
			if(err)
			{
				//if there is an error log it and respond
				//to user informing them of error
				console.log("Data was not appended")
				response.writeHead(500, {"content-type": "text/html"});
				response.write("<h3>Error:</h3>\n<p>Data did not append to file!</p>");
				response.end();	
			}
			else
			{
				//otherwise it was succesful, send body response to user
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
	
	//get our form object
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp";
	
	//parse the incoming request with all the form
	//data. field data goes into field assoc array,
	//file data is stored in file
	form.parse(request, function(error, field, file)
	{
		console.log("parsing done");
		
		//get user search term from field assoc array
		//should probably check there is something in field["Degree"]
		var searchTerm = field["Degree"];
		
		//set characters to lower case and remove
		//any white space
		searchTerm = searchTerm.toLowerCase();
		searchTerm = searchTerm.replace(/\s/g,'')
		
		//prepare body response string
		var body = "<h3>Search Results for " + field["Degree"];
		
		//array to store results
		var results = [];

		//create a line read to read file line by line
		var lineReader = readline.createInterface(
		{
			input: fs.createReadStream("./student_info/student_info.csv"),
			terminal: false
		});
		
		//register callback for what to do 
		//for each line of the file
		lineReader.on("line", function(line)
		{
			//this will grab just the degree part of the csv
			var degree = line.split(",")[5];
			
			//set characters to lower case and remove
			//any white space
			degree = degree.toLowerCase();
			degree = degree.replace(/\s/g,'')
			
			//if there is a match on user entered search term
			if(degree.indexOf(searchTerm) != -1)
			{
				//push that entire line onto results array
				//(as a new element in the array)
				results.push(line);
			}
		});
		
		//register callback for what to do 
		//after the file has been completely read
		lineReader.on("close", function()
		{
			//Add number of results that match (as per requirement)
			body += ": " + results.length + " results</h3>\n"
		
			//for each element in the array
			for(i=0; i<results.length; i++)
			{
				//append that result to body response string
				body += "<p>" + results[i] + "</p>\n"
			}
		
			//finally, respond to client with body response string
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
	
	//get our form object
	var form = new formidable.IncomingForm();
	form.uploadDir = "./tmp";
	
	//parse the incoming request with all the form
	//data. field data goes into field assoc array,
	//file data is stored in file
	form.parse(request, function(error, field, file)
	{
		console.log("parsing done");
		
		//at this point data will be stored in var file,
		//write this file to disk at ./images/test.png
		fs.rename(file.upload.path,"./images/test.png",function(err)
		{
			if (err) 
			{
				//if there are any issues try unlink the image
				//and write it again
				fs.unlink("./images/test.png");
				fs.rename(file.upload.path,"./images/test.png");
			}
		});
		
		//finally, respond to client with html code that 
		//will cause the client to request another resource.
		//the server will then run the handler for /show
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("<h3>Received image:<h3><br><br>");
		response.write("<img src='/show?nocache="+ Date.now() + "' />");
		response.end();
	});
}

function reqChecks(request, response)
{
	console.log("Request handler 'show' was called.");
	
	//send checks.png to client, should probably
	//use a more generic image responder for requests
	//ending in .png .jpg .gif, etc
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("./images/checks.png").pipe(response);
}

function reqShow(request, response)
{
	console.log("Request handler 'show' was called.");
	
	//sends test.png to client
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("./images/test.png").pipe(response);
}

//export all the handler functions
exports.reqFile = reqFile;
exports.reqFavi = reqFavi;
exports.req404 = req404;
exports.reqStudentDetails = reqStudentDetails;
exports.reqSearchDetails = reqSearchDetails;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;
exports.reqChecks = reqChecks;
