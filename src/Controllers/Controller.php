<?php

namespace Controllers;

use Core\Config;

abstract class Controller
{
    protected $twig;

    public function __construct()
    {
        $this->twig = Config::getTwig();
    }

    public function redirect($location)
    {
        header("Location: " . $location, true, 301);
    }
}