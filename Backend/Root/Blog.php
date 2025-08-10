<?php
require_once 'dBCon.php'; // Ensure your database connection file is included

class Blog
{
    protected $conn;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    // Method to get a single blog post by its ID
    public function getBlogById($id)
    {
        try {
            $sql = "SELECT * FROM blog WHERE blog_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $id, PDO::PARAM_INT);
            $stmt->execute();
            $blog = $stmt->fetch(PDO::FETCH_ASSOC);

            return $blog;
        } catch (PDOException $e) {
            // Handle error appropriately
            return null;
        }
    }

    // You can add more methods here, like getAllBlogs()
    public function getAllBlogs()
    {
        try {
            $sql = "SELECT * FROM blog";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $blogs;
        } catch (PDOException $e) {
            // Handle error appropriately
            return [];
        }
    }
}