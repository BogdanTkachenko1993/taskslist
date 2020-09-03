(function() {
    'use strict';
    window.addEventListener('load', function() {
        bootstrapValidation();
        addPaginationToTasksTable();
        removeSuccessAlert();
        changeCompletionStatus();
        editTask();
    }, false);
  })();

function bootstrapValidation()
{
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
            form.classList.add('was-validated');
        }, false);
    });
}

function addPaginationToTasksTable()
{
    if ($('#tasksTable tbody tr').length < 4)
        {
            $('#tasksTable').DataTable(
                {
                    "searching": false,
                    "lengthChange": false,
                    "info": false,
                    "paging": false,
                    "pagingType": "numbers"
                }
            );
        }
        else
        {
            $('#tasksTable').DataTable(
                {
                    "searching": false,
                    "lengthChange": false,
                    "info": false,
                    "pagingType": "numbers"
                }
            );
        }
}

function removeSuccessAlert()
{
    setTimeout(function(){
        let successAlert = document.querySelector('#success-alert');
        if (successAlert != null) successAlert.parentNode.removeChild(successAlert);
    },2000);
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
                url: "/changeCompletionStatus/" + taskId,
                method: "POST",
                data: {completionStatus: completionStatus},
                success: function(response){
                    if (response != '')
                    {
                        response = JSON.parse(response);
                        if (response.error == 'unauthorized')
                        {
                            window.location.replace('/loginPage');
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
                url: "/editTaskText/" + taskId,
                method: "POST",
                data: {taskText: button.parentNode.parentNode.children[2].innerHTML},
                success: function(response){
                    if (response != '')
                    {
                        response = JSON.parse(response);
                        if (response.error == 'unauthorized')
                        {
                            window.location.replace('/loginPage');
                        }
                    }
                    else
                    {
                        window.location.replace('/');
                    }
                }
            });
        }});
}