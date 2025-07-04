<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once "./Root/Cart.php";

// echo "hiiiii";
$data = json_decode(file_get_contents("php://input"), true);
$customer_id = htmlspecialchars(strip_tags($data['customer_id']));

$getAll=new Cart();
$response=$getAll->getAllCartCustomer($customer_id);

echo json_encode($response);
