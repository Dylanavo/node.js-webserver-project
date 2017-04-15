//client.js
"using strict";

function loadForm() 
{
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
	
	return false;
}

function sendForm(url, hasData)
{
	var formElement; 
	var formData; 
	
	if(hasData)
	{
		formElement = document.querySelector("form");
		if(url == "upload")
		{
			formElement.enctype = "multipart/form-data";
		}
		formData = new FormData(formElement);
	}
	
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			document.getElementById("content").innerHTML = xhttp.responseText;
		}
	};
	
	xhttp.open("POST", url, true);
	
	if(hasData)
	{
		//should probably check formData
		//isn't something unexpected (like undefined)
		xhttp.send(formData);
	}
	else
	{
		xhttp.send();
	}

	return false;
}