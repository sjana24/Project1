<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Product.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
   
    http_response_code(200);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);
$array = $data['product_Details'];

$customerID = isset($data['customer_id']) ? htmlspecialchars(strip_tags($data['customer_id'])) : null;

$product_id = htmlspecialchars(strip_tags($array['product_id']));
$provider_id = htmlspecialchars(strip_tags($array['provider_id']));
// $provider_id = htmlspecialchars(strip_tags($array['quantity']));


   $addToCart=new Product();
  $Result = $addToCart->AddToCart($customerID,$product_id,1);

  if($Result) {
      http_response_code(200);
      echo json_encode(array("message" => "Add to cart successfully."));
  } else {
      http_response_code(400);
      echo json_encode(array("message" => "Unable to add to cart."));
  }

// echo json_encode([
//     'product_id' => $product_id,
//     'provider_id' => $provider_id,
    
//     ""=>$customerID
// ]);
