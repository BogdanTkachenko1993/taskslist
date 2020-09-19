<?php

namespace Models;

use Core\Config;
use PDO;

class Task extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function add()
    {
        $username = filter_var(trim($_POST['username']), FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
        $email = strtolower(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
        $taskText = filter_var($_POST['taskText'], FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);

        if ($username && $email && $taskText)
        {
            $stmt = $this->pdo->prepare('INSERT INTO tasks (username, email, task_text) VALUES(:username, :email, :taskText)');
            $stmt->execute(['username' => $username, 'email' => $email, 'taskText' => $taskText]);
            $_SESSION['success'] = true;
        }
    }

    public function changeCompletionStatus($taskId)
    {
        if(isset($_SESSION['username']))
        {
            $taskId = filter_var($taskId, FILTER_SANITIZE_NUMBER_INT);
            $completionStatus = filter_var($_POST['completionStatus'], FILTER_VALIDATE_BOOLEAN);
            $stmt = $this->pdo->prepare('UPDATE tasks SET completed = :completionStatus WHERE id = :taskId');
            $stmt->execute(['completionStatus' => $completionStatus, 'taskId' => $taskId]);
        }
        else
        {
            echo json_encode(['error' => 'unauthorized']);
        }
    }

    public function editTaskText($taskId)
    {
        if(isset($_SESSION['username']))
        {
            $taskId = filter_var($taskId, FILTER_SANITIZE_NUMBER_INT);
            $editedTaskText = filter_var($_POST['taskText'], FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
            $stmt = $this->pdo->prepare('SELECT task_text FROM tasks WHERE id = :taskId');
            $stmt->execute(['taskId' => $taskId]);
            $taskText = $stmt->fetch()['task_text'];
            if ($taskText != $editedTaskText)
            {
                $stmt = $this->pdo->prepare('UPDATE tasks SET task_text = :editedTaskText, edited = true WHERE id = :taskId');
                $stmt->execute(['editedTaskText' => $editedTaskText, 'taskId' => $taskId]);
            }
        }
        else
        {
            echo json_encode(['error' => 'unauthorized']);
        }
    }
}