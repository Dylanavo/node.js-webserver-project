function loadOptions()
{
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
}

function loadForm() 
{
	var url = "";
	
	if(document.getElementById("studentForm").checked) 
	{
		url = "studentForm.html"
	}
	else if(document.getElementById("searchForm").checked) 
	{
		url = "searchForm.html";
	}
	else if(document.getElementById("uploadForm").checked)
	{
		url = "uploadForm.html";
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
	xhttp.send();
	
	return false;
}

function sendStudentDetails()
{
	var formElement = document.querySelector("form");
	var formData = new FormData(formElement);
	
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			document.getElementById("content").innerHTML = xhttp.responseText;
		}
	};
	
	xhttp.open("POST", "postStudentDetails", true);
	xhttp.send(formData);

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