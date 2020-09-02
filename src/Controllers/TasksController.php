<?php

namespace Controllers;

use Models\Task;

class TasksController extends Controller
{
    private $model;

    public function __construct()
    {
        parent::__construct();
        $this->model = new Task();
    }

    public function add()
    {
        $this->model->add();
        $this->redirect('/');
    }

    public function changeCompletionStatus($taskId)
    {
        $this->model->changeCompletionStatus($taskId);
    }

    public function editTaskText($taskId)
    {
        $this->model->editTaskText($taskId);
    }
}