<?php

namespace Models;

use Core\Config;

abstract class Model
{
    protected $pdo;

    public function __construct()
    {
        $this->pdo = Config::getPDO();
    }
}