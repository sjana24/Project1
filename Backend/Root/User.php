<?php
require_once "dbCon.php";

abstract class User{

    protected $conn;
    protected $user_id;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }
}