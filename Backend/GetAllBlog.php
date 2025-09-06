<?php

require_once './Root/Blog.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$blogHandler = new Blog();
$blogs = $blogHandler->getAllBlogs();

if (!empty($blogs)) {
    echo json_encode($blogs);
} else {
    http_response_code(404);
    echo json_encode(["message" => "No blog posts found."]);
}