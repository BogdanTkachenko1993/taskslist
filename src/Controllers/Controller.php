<?php

namespace Controllers;

use Core\Config;
use Core\Utils;

abstract class Controller
{
    protected $twig;

    public function __construct()
    {
        $this->twig = Config::getTwig();
    }

    public function redirect($location)
    {
        header("Location: " . Utils::getBaseUri() . $location, true, 301);
    }
}