const urlBase = 'https://4331group12-22.xyz/LAMPAPI';
const extension = '.php';

let userId = 0;
let firstName = "";
let lastName = "";

function doRegister()
{

	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let username = document.getElementById("registerName").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {FirstName:firstName,LastName:lastName,Login:username,Password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.Id;
		
				if( (userId < 1 ) || (login == "") || (login == " ") || (password == "" ) || (password == " " ) ) //needs to be edited to cause the following error feedback message to occur when a user tries to take an already existing username
				{		
					document.getElementById("registerResult").innerHTML = "Username is taken; choose another username";
					return;
				}
	
				window.location.href = "index.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:login,Password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( (userId < 1 ) || (login == "") || (login == " ") || (password == "" ) || (password == " " ) ) 
				{		
					document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName; 
				lastName = jsonObject.lastName;

				saveCookie(); 
	
				window.location.href = "Dashboard.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();

}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}

}

function addContact()
{
	let newContactFirstName = document.getElementById("contactFirstName").value;
	let newContactLastName = document.getElementById("contactLastName").value;
	let newContactCellNumber = document.getElementById("contactCellNumber").value;
	let newContactEmail = document.getElementById("contactEmail").value;
	let newUserID = document.getElementById("contactUserID").value; //will need to take the next available user ID available, then should hopefully be done
	
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {FirstName:newContactFirstName,LastName:newContactLastName,Phone:newContactCellNumber,Email:newContactEmail,UserID:newUserID};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact() //not completed; need to study and ensure understanding of how it works
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {Search:srch};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) //how do the contents of this function work?
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i = 0; i < jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function editContact()
{
	let curContactFirstName = document.getElementById("contactFirstName").value;
	let curContactLastName = document.getElementById("contactLastName").value;
	let curContactCellNumber = document.getElementById("contactCellNumber").value;
	let curContactEmail = document.getElementById("contactEmail").value;
	let curUserID = document.getElementById("contactUserID").value; //will need to take the current user ID for the contact that's being edited
	
	document.getElementById("contactEditResult").innerHTML = "";

	let tmp = {FirstName:curContactFirstName,LastName:curContactLastName,Phone:curContactCellNumber,Email:curContactEmail,UserID:curUserID};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/EditContact' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//need to change the contact information
				document.getElementById("contactEditResult").innerHTML = "Contact has been added";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}

}

function deleteContact() //not completed; need to ensure a particular user ID and its content are deleted from a contact list
{
	let userIdToDelete = document.getElementById("contactUserID").value; //will need to get the user ID for the contact being deleted
	
	document.getElementById("contactDeleteResult").innerHTML = "";

	//let tmp = {UserID:userIdToDelete};
	//let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContact' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//should check if the contact still exists
				document.getElementById("contactDeletedResult").innerHTML = "Contact has been edited";
			}
		};

		xhr.send(null);
	}
	catch(err)
	{
		document.getElementById("contactDeletedResult").innerHTML = err.message;
	}

}