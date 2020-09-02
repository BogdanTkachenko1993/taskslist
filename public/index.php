<?php 

require_once('../vendor/autoload.php');

use Core\Router;

session_start();

$router = new Router();
try
{
    $router->route();
}
catch (Exception $e)
{
    echo $e->getMessage();
}