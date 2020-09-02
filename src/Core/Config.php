<?php

namespace Core;

use \PDO;

class Config
{
    private static $pdo;
    private static $twig;

    public static function getURLRoot()
    {
        if (isset($server['HTTPS']))
        {
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else
        {
            $protocol = 'http';
        }

        return $protocol . "://" . $_SERVER['HTTP_HOST'];
    }

    public static function getPDO()
    {
        if (!isset(self::$pdo))
        {
            self::$pdo = new PDO('mysql:host=localhost;dbname=tasks_list;', 'root', '' );
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$pdo;
    }

    public static function getTwig()
    {
        if (!isset(self::$twig))
        {
            $loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../Views');
            self::$twig = new \Twig\Environment($loader);
            self::$twig->addGlobal('session', $_SESSION);
        }
        return self::$twig;
    }
}