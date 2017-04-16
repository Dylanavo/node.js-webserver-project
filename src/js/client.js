//client.js
"using strict";

function loadForm() 
{
	//work out which radio box was selected
	//and pass appropriate url to sendForm()
	//false means there is no data associated
	//so sendForm() doesn't need to worry about
	//grabbing form data and sending it on to server
	if(document.getElementById("op1").checked) 
	{
		sendForm("studentForm.html", false);
	}
	else if(document.getElementById("op2").checked) 
	{
		sendForm("searchForm.html", false);
	}
	else if(document.getElementById("op3").checked)
	{
		sendForm("uploadForm.html", false);
	}
	
	//prevents page from reloading when submitting
	//a form
	return false;
}

function sendForm(url, hasData)
{
	//vars to store the form itself
	//and the data it contains
	var formElement; 
	var formData; 
	
	//if sendForm() was called with
	//the intent to send data to the server
	//as well
	if(hasData)
	{
		//get the form
		formElement = document.querySelector("form");
		
		//if url is upload it's an image,
		//set encoding type
		if(url == "upload")
		{
			formElement.enctype = "multipart/form-data";
		}
		
		//store all the data from form in formData
		formData = new FormData(formElement);
	}
	
	//constructor initialises XMLHttpRequest
	var xhttp = new XMLHttpRequest();

	//define our eventhandler for when the
	//readystate changes
	xhttp.onreadystatechange = function() 
	{
		//ready state 4 is done, and http status 200 is OK
		//if the request is finished, and status is ok
		if (this.readyState == 4 && this.status == 200) 
		{
			//update the content div with response
			document.getElementById("content").innerHTML = xhttp.responseText;
		}
	};
	
	//prepare request of type post,
	//with server file location, and
	//do it asynchronously
	xhttp.open("POST", url, true);
	
	//if it has data to send all well
	if(hasData)
	{
		//send it
		//should probably check formData
		//isn't something unexpected (like undefined)
		xhttp.send(formData);
	}
	else
	{
		//otherwise just send the request without data
		xhttp.send();
	}

	//return false so page doesn't reload
	return false;
}