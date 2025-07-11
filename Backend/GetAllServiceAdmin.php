 <?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once "./Root/Service.php";




$getAll=new Service();
$response=$getAll->getAllServicesAdmin();

echo json_encode($response);
