<?php
$callback =  $_GET["callback"];
$content =  file_get_contents('./init.json');
echo $callback;
echo "(";
echo $content;
echo ");";
?>