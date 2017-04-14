//requestHandlers.js
"using strict";

var fs = require("fs");
var formidable = require("formidable");

function reqStart(request, response) 
{
	console.log("Request handler 'start' was called.");
	
	var body = 
	'<html>\n' +
	'	<head>\n' +
	'		<meta http-equiv="Content-Type" content="text/html" charset="UTF-8" />\n' +
	'	</head>\n' +
	'	<body>\n' +
	'		<form action="/upload" enctype="multipart/form-data" method="post">\n' +
	'			<input type="file" name="upload" multiple="multiple" />\n' +
	'			<input type="submit" value="Upload file" />\n' +
	'		</form>\n' +
	'	</body>\n' +
	'</html>\n';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
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

exports.reqStart = reqStart;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;
