<?php
require_once './Root/Blog.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid blog ID"]);
    exit;
}

$blogHandler = new Blog();
$blog = $blogHandler->getBlogById((int)$_GET['id']);

if ($blog) {
    echo json_encode($blog);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Blog not found"]);
}