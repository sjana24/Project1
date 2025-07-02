 <?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once "./Root/Product.php";


echo "h";
$data = json_decode(file_get_contents("php://input"), true);
// $email = filter_var($data->email,FILTER_SANITIZE_EMAIL);
echo "$data";
$provider_id = htmlspecialchars(strip_tags($data['providerid']));
echo "$provider_id";

// $getAll=new Product();
// $response=$getAll->getAllProductsProvider();

// echo json_encode($response);
