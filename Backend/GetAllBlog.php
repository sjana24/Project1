<?php

require_once 'Blog.php';

header("Content-Type: application/json");


header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET");

$blogHandler = new Blog();

$blogs = $blogHandler->getAllBlogs();

if ($blogs) {
    echo json_encode($blogs);
} else {
    
    http_response_code(404);
    echo json_encode(["message" => "No blog posts found."]);
}
