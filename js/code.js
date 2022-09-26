const urlBase = 'https://4331group12-22.xyz/LAMPAPI';
const extension = '.php';

let userId = 0;
let firstName = "";
let lastName = "";
let boolAdd = 0;
let boolEdit = 0;
let booldefaultSearch = true;
let contactArray = [];
let isLastPage;
let currContactID;
let contactList;
let isfetch = false;
let scrollpage = 1;

function doRegister() {

    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let username = document.getElementById("registerName").value;
    let password = document.getElementById("registerPassword").value;

    document.getElementById("registerResult").innerHTML = "";

    let tmp = {
        FirstName: firstName,
        LastName: lastName,
        Login: username,
        Password: md5(password),
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                error = jsonObject.Error;

                if (error != 0) {
                    document.getElementById("registerResult").innerHTML = "Username is taken; choose another username";
                    return;
                } else {
                    document.getElementById("registerResult").innerHTML = "Account successfully created";
                }

                setTimeout(() => { window.location.href = "index.html"; }, 3000);
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = error;
    }

}


function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {
        Login: login,
        Password: md5(password),
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                console.log(1)
                userId = jsonObject.Id;

                if ((jsonObject.Id == undefined || userId < 1) || (login == "") || (login == " ") || (password == "") || (password == " ")) {
                    document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.FirstName;
                lastName = jsonObject.LastName;

                saveCookie(firstName, lastName, userId);
                window.location.href = "Dashboard.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";

}

function saveCookie(firstName, lastName, userId) {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();

}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("userName").innerHTML = " " + firstName + " " + lastName + "!";
    }

}

function DisplayInfo() 
{
    var T = document.getElementById("contact-container");
    T.style.visibility = "visible"; 
}

function addContact() {

    let newContactFirstName = document.getElementById("contactFirstName").value;
    let newContactLastName = document.getElementById("contactLastName").value;
    let newContactCellNumber = document.getElementById("contactCellNumber").value;
    let newContactEmail = document.getElementById("contactEmail").value;
    let newConcatName = newContactFirstName + " " + newContactLastName;
    let newUserID = userId;


    //document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        FirstName: newContactFirstName,
        LastName: newContactLastName,
        Phone: newContactCellNumber,
        Email: newContactEmail,
        UserID: newUserID,
        ConcatName: newConcatName
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                //document.getElementById("contactAddResult").innerHTML = jsonObject.Status;
                //use the modal to show that error or if it was successful
                searchContactWrapper()
   
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err)
            //modal for error display
    }
    toggleAddOff();
    boolAdd = 0;
}

function searchContactWrapper(){
    //let page = 1; //default
    let saveList = false;

    for (i = 1; i <= scrollpage; i++){
        searchContact(i, saveList);

    }
}

function searchContact(page, saveList) 
{
    //default
    isfetch = true;
    let srch = "";
    //if (event.keyCode != 13 && booldefaultSearch === false) {
    //    booldefaultSearch = false;
    //    return
    //}
    srch = document.getElementById("searchText").value;

    if(saveList == false){
        contactList = "";
    }

    let tmp = {
        UserID: userId,
        Search: srch,
        Page: page
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
    
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                //console.log(contactArray);
                if(jsonObject.Error){
                    isLastPage = true;
                }
                else {
                    isLastPage = false;
                }
                //console.log(userId)

                // the ? checks if it is null/undef
                for (let i = 0; i < jsonObject.results?.length; i++) {
                    contactArray.push(jsonObject.results[i]);

                    contactList += '<button class ="contact-buttons"';
                    contactList += 'onclick="display('
                    contactList += contactArray.length - 1;
                    contactList += ');">'
                    contactList += '<span class ="contact-selectors">'
                        // IDK WHY BUT FIRST AND LAST NAME ARE SWAPPED
                    contactList += jsonObject.results[i].FirstName;
                    contactList += "    "
                    contactList += jsonObject.results[i].LastName;
                    contactList += '</span>'
                    contactList += '</button>'
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br />\r\n";
                    }
                }

                document.getElementById("SearchResult").innerHTML = contactList;
                isfetch = false;
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("SearchResult").innerHTML = jsonObject.Error;
    }
}


function editContact() {

    let curContactFirstName = document.getElementById("contactFirstName").value;
    let curContactLastName = document.getElementById("contactLastName").value;
    let curContactCellNumber = document.getElementById("contactCellNumber").value;
    let curContactEmail = document.getElementById("contactEmail").value;
    let newConcatName = curContactFirstName + " " + curContactLastName;

    let curContactid = contactArray[currContactID].ContactID; //will need to take the current user ID for the contact that's being edited

    //document.getElementById("contactEditResult").innerHTML = "";

    let tmp = {
        FirstName: curContactFirstName,
        LastName: curContactLastName,
        Phone: curContactCellNumber,
        Email: curContactEmail,
        UserID: userId,
        ContactID: curContactid,
        ConcatName: newConcatName
    };

    //document.getElementById("contactFirstName").value = '';
    //document.getElementById("contactLastName").value = '';
    //document.getElementById("contactCellNumber").value = '';
    //document.getElementById("contactEmail").value = '';
    
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/EditContact' + extension;


    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("first-name").innerHTML = curContactFirstName;
                document.getElementById("last-name").innerHTML = curContactLastName;
                document.getElementById("Phonedisplay").innerHTML = curContactCellNumber;
                document.getElementById("Emaildisplay").innerHTML = curContactEmail;
                document.getElementById("initials").innerHTML = curContactFirstName[0] + curContactLastName[0];
            
                document.getElementById("contactFirstName").value = curContactFirstName;
                document.getElementById("contactLastName").value = curContactLastName;
                document.getElementById("contactCellNumber").value = curContactCellNumber;
                document.getElementById("contactEmail").value = curContactEmail;
                contactArray = [];
                searchContactWrapper();
                console.log(contactArray)

            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        //document.getElementById("contactEditResult").innerHTML = err.message;
        alert(err)
    }
    toggleAddOff();
    boolEdit = 0;
}

function deleteContactWrapper()
{
    var result = confirm("Want to delete this contact?");
    if (result) {
        deleteContact();
    }
}

function deleteContact() 
{

    let ContactIDToDelete = contactArray[currContactID].ContactID;

    let tmp = {
        ContactID: ContactIDToDelete
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {        
                searchContactWrapper(); 
                
                document.getElementById("contact-container").style.visibility = "hidden";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        //document.getElementById("contactDeletedResult").innerHTML = err.message;
    }
}

function checkAddorEdit() {
    // 1 means that in add or edit mode which enables the done button for that specific mode
    if (boolAdd == 1) {
        addContact();
    } else if (boolEdit == 1) {
        editContact();
    }
}

function addContactWrapper() {
    boolAdd = 1;
    document.getElementById("contactFirstName").value = ''
    document.getElementById("contactLastName").value = '';
    document.getElementById("contactCellNumber").value = '';
    document.getElementById("contactEmail").value = '';
    toggleAdd();
}

function editContactWrapper() {
    boolEdit = 1;
    //this is a race condition
    searchContactWrapper();
    setTimeout(100);
    display(currContactID);
    toggleAdd();
}

function cancelChanges() {
    
    document.getElementById("contactFirstName").value = ''
    document.getElementById("contactLastName").value = '';
    document.getElementById("contactCellNumber").value = '';
    document.getElementById("contactEmail").value = '';
    
    document.getElementById("first-namep").style.display = 'none';
    document.getElementById("last-namep").style.display = 'none';

    document.getElementById("contactFirstName").style.display = 'none'
    document.getElementById("contactLastName").style.display = 'none';
    document.getElementById("contactCellNumber").style.display = 'none';
    document.getElementById("contactEmail").style.display = 'none';
    document.getElementById("done").style.display = 'none';
    document.getElementById("cancel-modifier").style.display = 'none';

    document.getElementById("first-name").style.display = 'block';
    document.getElementById("last-name").style.display = 'block';
    document.getElementById("Phonedisplay").style.display = 'block';
    document.getElementById("Emaildisplay").style.display = 'block';
    document.getElementById("delete-modifier").style.display = 'block';
    document.getElementById("edit-modifier").style.display = 'block';

    boolEdit = 0;
    boolAdd = 0;
}

function emailchecker() {

}

function phonechecker() {

}

function DisplayInfo() 
{
    var T = document.getElementById("contact-container");
    T.style.visibility = "visible"; 
}

function display(i) {
    //this value i, is the ith element is results[i] used when selecting for delete, edit
    currContactID = i;
    console.log(contactArray)
    document.getElementById("initials").innerHTML = contactArray[i].FirstName[0] + contactArray[i].LastName[0];

    document.getElementById("first-name").innerHTML = contactArray[i].FirstName;
    document.getElementById("last-name").innerHTML = contactArray[i].LastName;
    document.getElementById("Phonedisplay").innerHTML = contactArray[i].Phone;
    document.getElementById("Emaildisplay").innerHTML = contactArray[i].Email;

    document.getElementById("contactFirstName").value = contactArray[i].FirstName;
    document.getElementById("contactLastName").value = contactArray[i].LastName;
    document.getElementById("contactCellNumber").value = contactArray[i].Phone;
    document.getElementById("contactEmail").value = contactArray[i].Email;
    document.getElementById("contactEmail").value = contactArray[i].Email;
    DisplayInfo();

}

function toggleAdd() {
    DisplayInfo() 

    document.getElementById("first-namep").style.display = 'block';
    document.getElementById("last-namep").style.display = 'block';

    document.getElementById("contactFirstName").style.display = 'block';
    document.getElementById("contactLastName").style.display = 'block';
    document.getElementById("contactCellNumber").style.display = 'block';
    document.getElementById("contactEmail").style.display = 'block';
    document.getElementById("done").style.display = 'block';
    document.getElementById("cancel-modifier").style.display = 'block';

    document.getElementById("first-name").style.display = 'none';
    document.getElementById("last-name").style.display = 'none';
    document.getElementById("Phonedisplay").style.display = 'none';
    document.getElementById("Emaildisplay").style.display = 'none';

    document.getElementById("delete-modifier").style.display = 'none';
    document.getElementById("edit-modifier").style.display = 'none';

}

function toggleAddOff() {
    document.getElementById("first-namep").style.display = 'none';
    document.getElementById("last-namep").style.display = 'none';

    document.getElementById("contactFirstName").style.display = 'none'
    document.getElementById("contactLastName").style.display = 'none';
    document.getElementById("contactCellNumber").style.display = 'none';
    document.getElementById("contactEmail").style.display = 'none';
    document.getElementById("done").style.display = 'none';
    document.getElementById("cancel-modifier").style.display = 'none';

    //document.getElementById("contactFirstName").value = ''
    //document.getElementById("contactLastName").value = '';
    //document.getElementById("contactCellNumber").value = '';
    //document.getElementById("contactEmail").value = '';

    document.getElementById("first-name").style.display = '';
    document.getElementById("last-name").style.display = '';
    document.getElementById("Phonedisplay").style.display = '';
    document.getElementById("Emaildisplay").style.display = '';
    document.getElementById("delete-modifier").style.display = 'block';
    document.getElementById("edit-modifier").style.display = 'block';

}

var el = document.getElementById("scrolling-list");
    //infinite scroll function
    el.addEventListener("scroll", () => {
        
    // Do not run if currently fetching
    if (isfetch == true) {
      return;
    }
    //scrollpage = Math.trunc(scrollpage)
    // Scrolled to bottom
    setTimeout(4000);
    if (el.scrollTop  + el.clientHeight  >= el.scrollHeight -5 ) { 
        if(!isLastPage){
            scrollpage++;
            searchContact(scrollpage, saveList = true);
            console.log(scrollpage)
        }
    }
    
  });
