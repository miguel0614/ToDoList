
let numOfLists = 0;
let pageContainer = document.getElementById("page-content");
document.getElementById("create-list").addEventListener("click", createList);
document.getElementById("create-list-input").addEventListener("keyup", newList);

function createList() {
    let content = document.getElementById("create-list-input").value
    if (content.length !== 0) {
        emitCreateList(content, numOfLists)
        pageContainer.innerHTML += `            <div class="padding" id=${numOfLists}>
                <div class="row container d-flex justify-content-center">
                    <div class="col-lg-12">         <div class="dropdown">
        <ul class="dropbtn icons  showLeft" onclick="showDropdown('${numOfLists}-drop')">
            <li></li>
            <li></li>
            <li></li>
            </ul>
            <div id='${numOfLists}-drop'  class="dropdown-content">
            <a onclick='removeList(${numOfLists})' ">Delete</a>
            <a onclick="renameList('${numOfLists}-title')">Rename</a>
            </div>
            </div>
                        <div class="card px-3">
                            <div class="card-body">
                                <h2 class="card-title" id='${numOfLists}-title'>${content}</h2>
                                <div class="add-items d-flex">
                                    <input type="text" onkeypress="newItem('${numOfLists}-add')" class="form-control todo-list-input" id='${numOfLists}-input' placeholder="New Item.">
                                    <button class="add btn btn-primary font-weight-bold todo-list-add-btn" id='${numOfLists}-add'>Add</button>
                                </div>
                                <div class="list-wrapper">
                                    <ul class="d-flex flex-column-reverse todo-list" id='${numOfLists}-list'>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`

        document.getElementById("create-list-input").value = ""
        numOfLists ++

        (function($) {
            'use strict';
            $(function() {
                var todoListItem = $('.todo-list');
                $('.todo-list-add-btn').on("click", function(event) {
                    event.preventDefault();

                    var item = $(this).prevAll('.todo-list-input').val();

                    if (item) {
                        emitAddItem(parseInt($(this).parent().find('.todo-list-input:first').attr('id')), item)
                        $(this).parent().next().find('.todo-list:first').append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' id='"+ item+ "' />" + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i> </li>");
                        $(this).parent().find('.todo-list-input:first').val("");
                    }

                });

                todoListItem.on('change', '.checkbox', function() {
                    if ($(this).attr('checked')) {
                        $(this).removeAttr('checked');
                    } else {
                        $(this).attr('checked', 'checked');
                    }
                    emitCompleteItem(parseInt($(this).parent().parent().parent().parent().attr('id')),$(this).attr('id'))
                    $(this).closest("li").toggleClass('completed');

                });

                todoListItem.on('click', '.remove', function() {

                    emitDeleteItem(parseInt($(this).parent().parent().attr('id')), $(this).parent().parent().find(".checkbox:first").attr('id'))
                    $(this).parent().remove();
                });
            });
        })(jQuery);
    }
}

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
            document.getElementById(id).remove()
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
            document.getElementById(id).innerText = result.value;
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

function newList(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("create-list").click();
    }
}

function newItem(id) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById(id).click();
    }
}


