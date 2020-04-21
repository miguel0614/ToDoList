let numOfLists = 0;
let pageContainer = document.getElementById("page-content");
document.getElementById("create-list").addEventListener("click", createList);
document.getElementById("create-list-input").addEventListener("keyup", newList);

function createList() {
    let content = document.getElementById("create-list-input").value
    if (content.length !== 0) {
            pageContainer.innerHTML += "            <div class=\"padding\" id=" + numOfLists + ">\n" +
                "                <div class=\"row container d-flex justify-content-center\">\n" +
                "                    <div class=\"col-lg-12\">         <div class=\"dropdown\">\n" +
                "        <ul class=\"dropbtn icons  showLeft\" onclick=\"showDropdown('" + numOfLists + "-drop')\">\n" +
                "            <li></li>\n" +
                "            <li></li>\n" +
                "            <li></li>\n" +
                "            </ul>\n" +
                "            <div id='" + numOfLists + "-drop'  class=\"dropdown-content\">\n" +
                "            <a onclick='removeList(" + numOfLists + ")' \">Delete</a>\n" +
                "            </div>\n" +
                "            </div>\n" +
                "                        <div class=\"card px-3\"> \n" +
                "                            <div class=\"card-body\"> \n" +
                "                                <h2 class=\"card-title\">" + content + "</h2>\n" +
                "                                <div class=\"add-items d-flex\">\n" +
                "                                    <input type=\"text\" onkeypress=\"newItem('" + numOfLists + "-add')\" class=\"form-control todo-list-input\" id='" + numOfLists + "-input' placeholder=\"New Item.\">\n" +
                "                                    <button class=\"add btn btn-primary font-weight-bold todo-list-add-btn\" id='" + numOfLists + "-add'>Add</button>\n" +
                "                                </div>\n" +
                "                                <div class=\"list-wrapper\">\n" +
                "                                    <ul class=\"d-flex flex-column-reverse todo-list\" id='" + numOfLists + "-list'>\n" +
                "                                    </ul>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>\n"
        
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

                        $(this).parent().next().find('.todo-list:first').append("<li><div class='form-check'><label class='form-check-label'><input class='checkbox' type='checkbox' />" + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i> </li>");
                        $(this).parent().find('.todo-list-input:first').val("");
                    }

                });

                todoListItem.on('change', '.checkbox', function() {
                    if ($(this).attr('checked')) {
                        $(this).removeAttr('checked');
                    } else {
                        $(this).attr('checked', 'checked');
                    }

                    $(this).closest("li").toggleClass('completed');

                });

                todoListItem.on('click', '.remove', function() {
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
    document.getElementById(id).remove()
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