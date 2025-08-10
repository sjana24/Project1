<?php
require_once 'Blog.php'; // Include the new Blog class file

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Check if a blog ID is provided in the URL
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $blog_id = (int)$_GET['id'];

    // Instantiate the Blog class
    $blogHandler = new Blog();

    // Call the method to get the blog post
    $blog = $blogHandler->getBlogById($blog_id);

    if ($blog) {
        // Return the blog data as JSON
        echo json_encode($blog);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Blog post not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing blog ID."]);
}