<?php

namespace Models;

use Core\Config;
use PDO;

class Index extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getTasks()
    {
        $stmt = $this->pdo->query('SELECT * FROM tasks');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function login()
    {
        unset($_SESSION['loginError']);

        $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
        $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
        $stmt = $this->pdo->prepare('SELECT * FROM admins WHERE username = :username AND password = :password');
        $stmt->execute(['username' => $username, 'password' => $password]);
        $result = $stmt->fetch();
        
        if ($result === false)
        {
            $_SESSION['loginError'] = 'Неверное имя пользователя или пароль';
            return false;
        }
        else
        {
            $_SESSION['username'] = $username;
            return true;
        }
    }
}