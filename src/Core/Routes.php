<?php

namespace Core;

class Routes
{
    private $routes;
    
    //paths format: part1/part2/:param1/:param2
    //routes format: Folder1/Folder2/Controller.method
    public function __construct()
    {
        $this->routes =
        [
            '' => 'Index.index',
            'tasks/add' => 'Tasks.add',
            'loginPage' => 'Index.loginPage',
            'login' => 'Index.login',
            'logout' => 'Index.logout',
            'changeCompletionStatus/:taskId' => 'Tasks.changeCompletionStatus',
            'editTaskText/:taskId' => 'Tasks.editTaskText'
        ];
    }

    public function getRoutes() : array
    {
        return $this->routes;
    }
}