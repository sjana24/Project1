<?php
class Database{
    private $host="localhost";
    private $username="root";
    private $pwd="";
    private $dbname="solax";
    // private $conn;

    // Create connection

    $conn = new mysqli($host, $username, $password, $dbname);

// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        echo "✅ Database connected successfully!";
    }
}

?>