<?php
class Database{
    private $host="localhost";
    private $username="root";
    private $pwd="";
    private $dbname="solax";
    private $conn;

    // Create connection

  // Connect to the database
    public function connect()
    {
        $this->conn = new mysqli($this->host, $this->username, $this->pwd, $this->dbname);
        if ($this->conn->connect_error) {
            throw new Exception("Connection failed: " . $this->conn->connect_error);
        } else {
            echo " connected";
            return $this->conn;
        }
    }
}

?>