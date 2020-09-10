<?php

namespace Core;

class Utils
{
    public static function getBaseUri()
    {
        $appRoot = str_replace('\\', '/', realpath(dirname(__FILE__, 3)));
        $siteRoot = str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT']));
        $uriRoot = str_replace($siteRoot, '', $appRoot);
        return $uriRoot;
    }
}