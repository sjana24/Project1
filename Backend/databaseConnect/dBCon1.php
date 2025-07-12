<?php
class Database{
    private $host="localhost";
    private $username="root";
    private $pwd="";
    private $dbname="solaxdb";
    private $conn;

    // Create connection

  // Connect to the database
    public function connect()
    {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname}";
            $this->conn = new PDO($dsn, $this->username, $this->pwd);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $this->conn;
        } catch (PDOException $e) {
            throw new Exception("Connection failed: " . $e->getMessage());
        }
    }
}

?>