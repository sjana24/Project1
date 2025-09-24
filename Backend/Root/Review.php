<?php
require_once 'dBCon.php'; // Ensure your database connection file is included

class Review
{
    protected $conn;
    protected $review_id;
    protected $is_approved;

    public function __construct()
    {
        $dbObj = new Database;
        $this->conn = $dbObj->connect();
    }

    public function toggleVisibility($reviewId, $is_approved)
    {
        $this->review_id = $reviewId;
        $this->is_approved = $is_approved;
        try {
            $sql = "UPDATE review SET is_approved = ? WHERE review_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->is_approved, PDO::PARAM_BOOL);
            $stmt->bindParam(2, $this->review_id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

    
      public function toggleVisibilityServiceReview($reviewId, $is_approved)
    {
        $this->review_id = $reviewId;
        $this->is_approved = $is_approved;
        try {
            $sql = "UPDATE service_review SET is_approved = ? WHERE review_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(1, $this->is_approved, PDO::PARAM_BOOL);
            $stmt->bindParam(2, $this->review_id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

//     // Method to get a single blog post by its ID
//     public function getBlogById($id)
//     {
//         try {
//             $sql = "SELECT * FROM blog WHERE blog_id = ?";
//             $stmt = $this->conn->prepare($sql);
//             $stmt->bindParam(1, $id, PDO::PARAM_INT);
//             $stmt->execute();
//             $blog = $stmt->fetch(PDO::FETCH_ASSOC);

//             if ($blog) {
//                 return $this->formatBlog($blog);
//             }
//             return null;
//         } catch (PDOException $e) {
//             return null;
//         }
//     }
//     // You can add more methods here, like getAllBlogs()
//     public function getAllBlogs()
//     {
//         try {
//             $sql = "SELECT * FROM blog WHERE status = 'published' ORDER BY created_at DESC";
//             $stmt = $this->conn->prepare($sql);
//             $stmt->execute();
//             $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

//             return array_map([$this, 'formatBlog'], $blogs);
//         } catch (PDOException $e) {
//             return [];
//         }
//     }


//  private function formatBlog($blog)
//     {
//         return [
//             "blog_id"      => (int)$blog['blog_id'],
//             "title"        => $blog['title'],
//             "excerpt"      => mb_substr(strip_tags($blog['content']), 0, 150) . "...", // Short preview
//             "published_at" => $blog['created_at'],  // map created_at → published_at
//             "updated_at" => $blog['updated_at'],
//             "read_time"    => max(1, ceil(str_word_count(strip_tags($blog['content'])) / 200)), // ~200 words/min
//             "category"     => $blog['category'] ?? "general",
//             "tags"         => "solar,energy,renewable", // hardcoded or later make separate tags table
//             "content"      => $blog['content'],
//             "image"        => $blog['image']
//         ];
//     }

}