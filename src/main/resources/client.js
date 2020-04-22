const client = io.connect("http://localhost:8080", {transports: ["websocket"]});
let newUser = true

client.on("login", function (event) {
    Swal.fire({
        title: 'Welcome!',
        text: "Are you a new or returning user?",
        showCancelButton: true,
        cancelButtonText: 'Login',
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
    document.getElementById("login").remove()
    document.getElementById("body").innerHTML = "<div class=\"padding\" align=\"center\">\n" +
        "    <div class=\"row container d-flex justify-content-center\">\n" +
        "        <div class=\"col-lg-12\">\n" +
        "            <div class=\"add-items d-flex\">\n" +
        "                <input type=\"text\" id=\"create-list-input\" class=\"form-control todo-list-create\" placeholder=\"Create a new list.\">\n" +
        "                <button class=\"add btn btn-primary font-weight-bold todo-list-create-btn\" id=\"create-list\">Create</button>\n" +
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
