<?php

namespace Controllers;

use Models\Index;

class IndexController extends Controller
{
    private $model;

    public function __construct()
    {
        parent::__construct();
        $this->model = new Index();
    }

    public function index()
    {
        $tasksData = $this->model->getTasks();
        if (isset($_SESSION['success']))
        {
            $success = true;
            unset($_SESSION['success']);
            echo $this->twig->load('index.html')->render(['tasksData' => $tasksData, 'success' => $success]);
        }
        else
        {
            echo $this->twig->load('index.html')->render(['tasksData' => $tasksData]);
        }
    }

    public function loginPage()
    {
        echo $this->twig->load('login.html')->render();
    }

    public function login()
    {
        $result = $this->model->login();
        $result === true ? $this->redirect('/') : $this->redirect('/loginPage');
    }

    public function logout()
    {
        unset($_SESSION['username']);
        $this->redirect('/');
    }
}