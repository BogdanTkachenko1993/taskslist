<?php

namespace Core;

use \Exception;
use \PDO;
use Core\Config;

class Router 
{
    private $path;
    private $pathParts;
    private $routes;

    public function __construct()
    {
        $this->path = trim(filter_var($_SERVER['REQUEST_URI'], FILTER_SANITIZE_URL),'/');
        $this->pathParts = explode('/', $this->path);
        $this->routes = (new Routes())->getRoutes();
    }

    public function route()
    {
        if ($this->findRoute() === false)
        {
            throw new Exception('Запрашиваемый путь не существует: ' . $this->path);
        }
        $route = $this->findRoute();
        $controller = explode('.', $this->routes[$route])[0];

        if (!file_exists(__DIR__ . '/../Controllers/' . $controller . 'Controller.php'))
        {
            throw new Exception('Контроллер не найден');
        }

        $controller = str_replace('/', '\\', $controller);

        $controllerName = '\\Controllers\\' . $controller . 'Controller';
        $controller = new $controllerName;

        $method = explode('.', $this->routes[$route])[1];

        if (!method_exists($controller, $method))
        {
            throw new Exception('Метод не найден');
        }

        $params = $this->extractParams($route);
        return call_user_func_array([$controller, $method], $params);
    }

    private function findRoute ()
    {
        foreach (array_keys($this->routes) as $route)
        {
            $currentRouteParts = explode('/', $route);
            if (count($currentRouteParts) == count($this->pathParts))
            {
                for ($i = 0; $i < count($currentRouteParts); $i++)
                {   
                    if (strpos($currentRouteParts[$i], ':') === false && $currentRouteParts[$i] != $this->pathParts[$i])
                    {
                        break;
                    }
                    else if ($i == count($this->pathParts) - 1) 
                    {
                        return $route;
                    }
                }
            }
        }
        return false;
    }

    private function extractParams(string $route) : array
    {
        $result = array();
        $routeParts = explode('/', $route);
        for ($i = 0; $i < count($routeParts); $i++)
        {
            if (strpos($routeParts[$i], ':') !== false)
            {
                $result[ltrim($routeParts[$i], ':')] = $this->pathParts[$i];
            }
        }
        return $result;
    }
}