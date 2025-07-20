<?php
require_once 'dBCon.php';
class Contact
{
    // protected $admin_id;
    // protected $admin_id1;
    protected $email;
    protected $category;
    protected $name;
    protected $message;
    protected $subject;
    protected $contact_no;
    protected $disable_sts;
    protected $conn;
    public $id = 3;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }
  
}
