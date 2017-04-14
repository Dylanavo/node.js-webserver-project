function loadDoc() 
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
	
	xhttp.open("GET", url, true);
	xhttp.send();
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