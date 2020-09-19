import {bootstrapValidation} from "./bootstrap.js"
import {Paginator} from "./Paginator.js"
(function() {
    window.addEventListener('load', function() {
        changeCompletionStatus();
        editTask();
        let paginatedElement = document.querySelector('#tasksTable tbody');
        let paginationElement = document.querySelector('ul.pagination');
        let tableData = document.querySelectorAll('#tasksTable tbody tr');
        let rowsPerPage = 3;
        let paginator = new Paginator(tableData, paginatedElement, paginationElement, rowsPerPage);
        paginator.AddPagination();
        addSorting(paginator);
        bootstrapValidation();
        removeSuccessAlert();
    }, false);
  })();

function removeSuccessAlert()
{
    setTimeout(function(){
        let successAlert = document.querySelector('#success-alert');
        if (successAlert != null) successAlert.parentNode.removeChild(successAlert);
    }, 2000);
}

function changeCompletionStatus()
{
    let completedCheckboxes = document.getElementsByClassName('completed-checkbox');
    for (let i = 0; i < completedCheckboxes.length; i++)
    {
        completedCheckboxes[i].addEventListener('change', function(event) {
            let taskId = event.target.parentNode.children[2].value;
            let completionStatus = event.target.checked;
            if (completionStatus == true)
            {
                event.target.parentNode.children[1].innerText = "Да";
            }
            else
            {
                event.target.parentNode.children[1].innerText = "Нет";
            }
            $.ajax({
                url: "./changeCompletionStatus/" + taskId,
                method: "POST",
                data: {completionStatus: completionStatus},
                success: function(response){
                    if (response != '')
                    {
                        response = JSON.parse(response);
                        if (response.error == 'unauthorized')
                        {
                            window.location.replace('./loginPage');
                        }
                    }
                }
            });
        });
    }
}

function editTask()
{
    $('.button-edit').click(function(event){
        let button = event.target;
        let taskTextTableCell = button.parentNode.parentNode.children[2];
        let taskId = button.parentNode.children[1].value;
        if (button.innerHTML == "Редактировать")
        {
            button.innerHTML = "Сохранить";
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            taskTextTableCell.classList.add('table-success');
            taskTextTableCell.setAttribute('contenteditable', 'true');
        }
        else if (button.innerHTML == "Сохранить")
        {
            button.innerHTML = "Редактировать";
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
            taskTextTableCell.classList.remove('table-success');
            taskTextTableCell.setAttribute('contenteditable', 'false');
            $.ajax({
                url: "./editTaskText/" + taskId,
                method: "POST",
                data: {taskText: button.parentNode.parentNode.children[2].innerHTML},
                success: function(response){
                    if (response != '')
                    {
                        response = JSON.parse(response);
                        if (response.error == 'unauthorized')
                        {
                            window.location.replace('./loginPage');
                        }
                    }
                    else
                    {
                        window.location.replace('./');
                    }
                }
            });
        }
    });
}

function addSorting(paginator){
    let columnHeaders = document.querySelectorAll('#tasksTable th a');
    for (let i = 0; i < columnHeaders.length; i++){
        columnHeaders[i].addEventListener('click', event => {
            event.preventDefault();
            if (columnHeaders[i].classList.contains('asc')){
                sortTable(paginator, i, 'asc');
                columnHeaders[i].classList.replace('asc', 'desc');
            }
            else if (columnHeaders[i].classList.contains('desc')){
                sortTable(paginator, i, 'desc');
                columnHeaders[i].classList.replace('desc', 'asc');
            }
        });
    }
}

function sortTable(paginator, columnNumber, order = 'asc'){
    if (order == 'asc')
    {
        paginator.data.sort((a, b) => a.children[columnNumber].innerText.trim() > b.children[columnNumber].innerText.trim());
    }
    else if (order == 'desc')
    {
        paginator.data.sort((a, b) => a.children[columnNumber].innerText.trim() < b.children[columnNumber].innerText.trim());
    }
    paginator.RefreshData();
}