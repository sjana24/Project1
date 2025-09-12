<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// echo "hi";
require_once "./Root/Product.php";

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
        // $data = json_decode(file_get_contents("php://input"), true);
        // $data = json_decode(file_get_contents("php://input"), true);
        // $array = $data['price'];

        // $customerID = isset($data['customer_id']) ? htmlspecialchars(strip_tags($data['customer_id'])) : null;

        // $product_id = htmlspecialchars(strip_tags($array['price']));

        // Optional safeguard
        // if (!$data) {
        //     echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
        //     exit;
        // }

        // Sanitize all product fields from incoming data
        // $product_id        = isset($data['product_id']) ? htmlspecialchars(strip_tags($data['product_id'])) : null;
        // // $provider_id       = isset($data['provider_id']) ? htmlspecialchars(strip_tags($data['provider_id'])) : null;
        // $provider_id = $user_id;
        $name              = isset($_POST['name']) ? htmlspecialchars(strip_tags($_POST['name'])) : null;
        $description       = isset($_POST['description']) ? htmlspecialchars(strip_tags($_POST['description'])) : null;
        $price             = isset($_POST['price']) ? htmlspecialchars(strip_tags($_POST['price'])) : null;
        $category          = isset($_POST['category']) ? htmlspecialchars(strip_tags($_POST['category'])) : null;
        // $images            = isset($_POST['images']) ? htmlspecialchars(strip_tags($_POST['images'])) : null; // could be a string or JSON
        $specifications    = isset($_POST['specifications']) ? htmlspecialchars(strip_tags($_POST['specifications'])) : null;
        // $is_approved       = isset($data['is_approved']) ? htmlspecialchars(strip_tags($data['is_approved'])) : 'pending';
        // $created_at        = date("Y-m-d H:i:s");
        // $updated_at        = date("Y-m-d H:i:s");
        echo "$name<br>,$description<br>.$price<br>,$category<br>,$specifications";
        
// Validate file uploads
// $uploadedImages = [];
// print_r($_FILES);

// $x=$_FILES['images']['name'][0];
// echo "$x <br>";
// $x=$_FILES['images']['full_path'][0];
// echo "$x <br>";
// $x=$_FILES['images']['type'][0];
// echo "$x <br>";
// $x=$_FILES['images']['size'][0];
// echo "$x <br>";


 $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["images"]["name"][0]);
    $uploadOk = 1;
 $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    echo "<br>$target_file<br> $imageFileType<br>";
    if (move_uploaded_file($_FILES["images"]["tmp_name"][0], $target_file)) {
    echo "The file ". htmlspecialchars( basename( $_FILES["images"]["name"][0])). " has been uploaded.";
    $image_path=$target_file;
  }

if (!isset($_FILES['images'])) {
    echo json_encode(["success" => false, "message" => "No images uploaded"]);
    exit;
}
// print_r ($x);
// echo ($_POST['images']);

// foreach ($_FILES['images']['name'] as $index => $filename) {
//     if ($_FILES['images']['error'][$index] !== UPLOAD_ERR_OK) continue;

//     $tmpName = $_FILES['images']['tmp_name'][$index];
//     $ext = pathinfo($filename, PATHINFO_EXTENSION);
//     $allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

//     if (!in_array(strtolower($ext), $allowedExt)) continue;

//     $newName = time() . '_' . uniqid() . '.' . $ext;
//     $uploadPath = __DIR__ . '/uploads/' . $newName;

//     if (move_uploaded_file($tmpName, $uploadPath)) {
//         $uploadedImages[] = 'uploads/' . $newName;
//     }
// }
// if (empty($uploadedImages)) {
//     echo json_encode(["success" => false, "message" => "Image upload failed."]);
//     exit;
// }

        // $uploadedImages = [];

        // if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
        //     foreach ($_FILES['images']['name'] as $index => $name) {
        //         if ($_FILES['images']['error'][$index] === UPLOAD_ERR_OK) {
        //             $uploadDir = 'uploads/';
        //             $uniqueName = time() . '_' . basename($name);
        //             $uploadPath = $uploadDir . $uniqueName;

        //             if (move_uploaded_file($_FILES['images']['tmp_name'][$index], $uploadPath)) {
        //                 $uploadedImages[] = $uploadPath;
        //             }
        //         }
        //     }
        // }

//         $uploadedImages = [];

// if (isset($_FILES['images'])) {
//     foreach ($_FILES['images']['name'] as $index => $filename) {
//         if ($_FILES['images']['error'][$index] === UPLOAD_ERR_OK) {
//             $tmpName = $_FILES['images']['tmp_name'][$index];
//             $newName = time() . '_' . basename($filename);
//             $uploadPath = 'uploads/' . $newName;

//             if (move_uploaded_file($tmpName, $uploadPath)) {
//                 $uploadedImages[] = $uploadPath; // store file path
//             }
//         }
//     }
// }



        $addProduct = new Product();
        $response = $addProduct->addProductProvider( $user_id, $name, $description, $price, $category, $image_path, $specifications);
        echo json_encode($response);
        // echo "$uploadedImages";
        // print_r($uploadedImages);
        // echo json_encode(false)
    }
}
