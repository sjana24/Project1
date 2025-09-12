<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require "./Root/Product.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_SESSION['user'])) {
    $user_name = $_SESSION['user']['user_name'];
    $user_id = $_SESSION['user']['user_id'];
    $user_role = $_SESSION['user']['user_role'];

    // echo "$user_name,$user_id,$user_role";
    if ("service_provider" === $user_role) {
        $product=new Product();


$target_dir = "uploads/";

// ✅ check if file exists
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    //   $xxx= json_encode(["success_image" => false, "message" => "No image uploaded"]);
      $success_image=false;
      $message= "No image uploaded";
    // echo json_encode(["success_image" => false, "message" => "No image uploaded"]);
    // exit;
}else{

// ✅ generate safe filename
$filename = basename($_FILES["image"]["name"]);
$target_file = $target_dir . time() . "_" . preg_replace("/[^a-zA-Z0-9.\-_]/", "", $filename);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// ✅ check if valid image type
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array($imageFileType, $allowed)) {
    $success_image=false;
      $message= "Only JPG, PNG, GIF, WEBP allowed";
    // echo json_encode(["success_image" => false, "message" => "Only JPG, PNG, GIF, WEBP allowed"]);
    // exit;
}

// ✅ move uploaded file
if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
    $image_path = $target_file;
    $success_image=true;
      $message= "File uploaded successfully";

    // echo json_encode([
    //     "success_image" => true,
    //     "message" => "File uploaded successfully",
    //     "image_path" => $image_path
    // ]);
} else {
    // echo json_encode(["success" => false, "message" => "Failed to upload file"]);
    $success_image=false;
      $message= "Failed to upload file";
    
}}


// ✅ Sanitize and validate
$product_id   = isset($_POST['product_id']) ? (int) $_POST['product_id'] : null;

$name         = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : null;
$description  = isset($_POST['description']) ? htmlspecialchars(trim($_POST['description']), ENT_QUOTES, 'UTF-8') : null;
$price        = isset($_POST['price']) ? (float) $_POST['price'] : null;
$category     = isset($_POST['category']) ? htmlspecialchars(trim($_POST['category']), ENT_QUOTES, 'UTF-8') : null;
$images       = (isset($_POST['images']) && empty($image_path)) ? htmlspecialchars(trim($_POST['images']), ENT_QUOTES, 'UTF-8') : $image_path;
$specifications = isset($_POST['specifications']) ? htmlspecialchars(trim($_POST['specifications']), ENT_QUOTES, 'UTF-8') : null;
// $images=isset($image_path)? $image_path : null;
if($product_id === null){
    // echo " this is add ";

    $responce=$product->addProductProvider( $user_id, $name, $description, $price, $category, $images, $specifications);
}
else{
    // echo "this is edit";
    $responce=$product->editProductProvider( $product_id, $name, $description, $price, $category, $images, $specifications);
}
echo json_encode($responce);

// if(  $responce['success'] && empty($image_path)){
//     if($success_image){
//         echo " all success";

//     }
//     else{
//         echo "image failed data okay";

//     }
    
// }
// else{
//     echo "qqqqqqq";
//     echo $message;
// }

// echo json_encode($responce,["success" => false, "message" => "Failed to upload file"]);
// // ✅ Echo values separately for debugging
// echo "Product ID: " . $product_id . PHP_EOL;
// // echo "Provider ID: " . $provider_id . PHP_EOL;
// echo "Name: " . $name . PHP_EOL;
// echo "Description: " . $description . PHP_EOL;
// echo "Price: " . $price . PHP_EOL;
// echo "Category: " . $category . PHP_EOL;
// echo "Images: " . $images. PHP_EOL;
// echo "Specifications: " . $specifications . PHP_EOL;
// // echo "Is Approved: " . $is_approved . PHP_EOL;
// // echo "Is Delete: " . $is_delete . PHP_EOL;
// // echo "Created At: " . $created_at . PHP_EOL;
// // echo "Updated At: " . $updated_at . PHP_EOL;


    }}