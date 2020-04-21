const client = io.connect("http://localhost:8080", {transports: ["websocket"]});

client.on("login", function(event){
    document.getElementById("display").innerHTML = event
});


function emitCreateList(id){
    let message = document.getElementById(id).value ;
    client.emit("createList", message);
}


function emitDeleteList(id){
    let message = document.getElementById(id).value ;
    client.emit("deleteList", message);
}


function emitRenameList(id){
    let message = document.getElementById(id).value ;
    client.emit("renameList", message);
}


function emitAddItem(id){
    let message = document.getElementById(id).value ;
    client.emit("addItem", message);
}


function emitDeleteItem(id){
    let message = document.getElementById(id).value ;
    client.emit("deleteItem", message);
}


function emitCompleteItem(id){
    let message = document.getElementById(id).value ;
    client.emit("completeItem", message);
}

function login(user){
    client.emit("login", message);
}