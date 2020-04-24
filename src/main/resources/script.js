
let numOfLists = 0;

function showDropdown(id) {
    document.getElementById(id).classList.toggle("show");
}

function removeList(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            emitDeleteList(parseInt(id))
            Swal.fire(
                'Deleted!',
                'Your To-Do List has been deleted.',
                'success'
            )
        }
    })
}

function renameList(id) {
    Swal.fire({
        title: 'Enter New List Title',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    }).then((result) => {
        if (result.value) {
            emitRenameList(parseInt(id), result.value)
        }
    })
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}



