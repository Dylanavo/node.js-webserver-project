function loadForm() 
{
	if(document.getElementById("studentForm").checked) 
	{
		sendForm("studentForm.html", false);
	}
	else if(document.getElementById("searchForm").checked) 
	{
		sendForm("searchForm.html", false);
	}
	else if(document.getElementById("uploadForm").checked)
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
		//isn't undefined
		xhttp.send(formData);
	}
	else
	{
		xhttp.send();
	}

	return false;
}

function sendUploadInfo()
{
	/*
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			document.getElementById("content").innerHTML = xhttp.responseText;
		}
	};
	
	xhttp.open("POST", "optionForm.html", true);
	xhttp.send();
	*/
	
	return false;
}