<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include "dbCon.php";

$dbObj=new Database;
$conn=$dbObj->connect();
var_dump($conn);
?>