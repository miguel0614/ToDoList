const client = io.connect("http://localhost:8080", {transports: ["websocket"]});
let newUser = true

client.on("login", function (event) {
    Swal.fire({
        title: 'Welcome!',
        text: "Are you a new or returning user?",
        showCancelButton: true,
        cancelButtonText: 'Login',
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#3085d6',
        confirmButtonText: ' Register'
    }).then((result) => {
        if (result.value) {
            login()
        }
        else {
            newUser = false
            login()
        }
    })
})

client.on("success", function(event){
    constructPage(event)
});


client.on("failure", function(event){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect Login Information / Username Taken!',
    }).then(login)
    });


async function login() {
    const { value: username } =  await Swal.fire({
        title: 'Input username',
        input: 'text',
        allowOutsideClick: false,
        inputPlaceholder: 'Enter your username'
    })

    const { value: password } =  await Swal.fire({
        title: 'Enter your password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
            maxlength: 25,
            autocapitalize: 'off',
            allowOutsideClick: false,
            autocorrect: 'off'
        }
    })
    sendLogin(username, password, newUser)
}

client.on("update", function(event){
    constructList(event)
})

function sendLogin(username, password) {
    hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0); return a&a},0)
    client.emit("login", JSON.stringify({user: username, pass: String(hashCode(password)), newUser: newUser}))}

function emitCreateList(listName, listNumber){
    client.emit("createList", JSON.stringify({listName: listName, listNumber: listNumber}));
}


function emitDeleteList(listNumber){
    client.emit("deleteList", listNumber);
}


function emitRenameList(listNumber, newName){
    client.emit("renameList", JSON.stringify({listNumber: listNumber, newName: newName}));
}


function emitAddItem(listNumber, value){
    console.log(value)
    client.emit("addItem", JSON.stringify({listNumber: listNumber, value: value}));
}

function emitDeleteItem(listNumber, value){
    console.log(value)
    client.emit("deleteItem",  JSON.stringify({listNumber: listNumber, value: value}));
}


function emitCompleteItem(listNumber, value){
    console.log(value)
    client.emit("completeItem",  JSON.stringify({listNumber: listNumber, value: value}));
}

function isChecked(bool){
    if(bool){
        return "checked='checked'"
    }
    else return ""
}

function isComplete(bool) {
    if(bool){
        return "class='completed'"
    }
    else return ""
}


function constructPage(event) {
    document.getElementById("login").remove()
    document.getElementById("body").innerHTML = "<div class=\"padding\" align=\"center\">\n" +
        "    <div class=\"row container d-flex justify-content-center\">\n" +
        "        <div class=\"col-lg-12\">\n" +
        "            <div class=\"add-items d-flex\">\n" +
        "                <input type=\"text\" id=\"create-list-input\" onkeypress='enterNewList(event, numOfLists)' class=\"form-control todo-list-create\" placeholder=\"Create a new list.\">\n" +
        "                <button class=\"add btn btn-primary font-weight-bold todo-list-create-btn\" onclick='newList(numOfLists)' id=\"create-list\">Create</button>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "        <div class=\"page-content page-container\" id=\"page-content\">\n" +
        "    </div>\n" +
        "</div>\n"

    const scr  = document.createElement('script'),
        head = document.head || document.getElementsByTagName('head')[0];
    scr.src = 'script.js';
    scr.async = true;
    head.insertBefore(scr, head.firstChild);

    if(!newUser){
        constructList(event)
    }
}


function constructList(todoLists) {
    const entries = Object.entries(JSON.parse(todoLists))
    let pageBody = ""
    numOfLists = 0
    for (let pair of entries) {
        const listNumber = pair[0]
        const listName = pair[1][0]
        const items = pair[1][1]
        let itemBody = ""

        for (let i = 0; i < items.length; i++) {
            itemBody += ` <li ${isComplete(items[i][1])}>
                <div class="form-check">
                    <label class="form-check-label">
                        <input class="checkbox" type="checkbox" id="${i}-check" onclick="checkItem(${numOfLists}, '${items[i][0]}')" ${isChecked(items[i][1])}> ${items[i][0]}
                        <i class="input-helper"></i>
                    </label>
                </div>
                <i class="remove mdi mdi-close-circle-outline" onclick="deleteItem(${numOfLists}, '${items[i][0]}')"></i>
            </li>
`
        }

        pageBody += `            <div class="padding" id=${listNumber}>
                <div class="row container d-flex justify-content-center">
                    <div class="col-lg-12">         <div class="dropdown">
        <ul class="dropbtn icons  showLeft" onclick="showDropdown('${listNumber}-drop')">
            <li></li>
            <li></li>
            <li></li>
            </ul>
            <div id='${listNumber}-drop'  class="dropdown-content">
            <a onclick='removeList(${listNumber})'>Delete</a>
            <a onclick="renameList('${listNumber}-title')">Rename</a>
            </div>
            </div>
                        <div class="card px-3">
                            <div class="card-body">
                                <h2 class="card-title" id='${listNumber}-title'>${listName}</h2>
                                <div class="add-items d-flex">
                                    <input type="text" onkeypress="enterNewItem(event,${listNumber})" class="form-control todo-list-input" id='${listNumber}-input' placeholder="New Item.">
                                    <button class="add btn btn-primary font-weight-bold todo-list-add-btn" onclick="newItem(${listNumber})" id='${listNumber}-add'>Add</button>
                                </div>
                                <div class="list-wrapper">
                                    <ul class="d-flex flex-column-reverse todo-list" id='${listNumber}-list'>
                                    ${itemBody}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> `
        numOfLists ++
    }
    document.getElementById("page-content").innerHTML = pageBody
}


function enterNewList(event, listNumber) {
    if (event.keyCode === 13) {
        event.preventDefault();
        newList(listNumber)
    }
}

function newList(listNumber) {
    const listName = document.getElementById("create-list-input").value
    if (listName.length > 0) {
    emitCreateList(listName, listNumber)
}
}

function enterNewItem(event, id) {
    if (event.keyCode === 13) {
        event.preventDefault();
        newItem(id)
    }
}

function newItem(id) {
    const item = document.getElementById(`${id}-input`).value
    if (item.length > 0) {
        emitAddItem(id, item)
    }
}

function deleteItem(listNumber, item){
        emitDeleteItem(listNumber, item)
}

function checkItem(listNumber, item){
    emitCompleteItem(listNumber, item)
}

