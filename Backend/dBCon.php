<?php
class Database{
    private $host="localhost";
    private $username="root";
    private $pwd="";
    private $dbname="solaxdbv4";
    private $conn;

    // Create connection

  // Connect to the database
    public function connect()
    {

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->pwd);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    // public function connect(){
    //     $connection=$this->connect1();
    //     return $connection;
    // }
}

?>