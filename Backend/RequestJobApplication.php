<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// OPTIONS preflight check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$errors = [];

// Sanitize & validate input fields
$jobId = isset($_POST['formDataToSend']['jobId']) ? filter_var($_POST['formDataToSend']['jobId'], FILTER_VALIDATE_INT) : null;
if (!$jobId) $errors[] = "Invalid job ID.";

$fullName = isset($_POST['formDataToSend']['fullName']) ? htmlspecialchars(trim($_POST['formDataToSend']['fullName'])) : '';
if (empty($fullName)) $errors[] = "Full name is required.";

$email = isset($_POST['formDataToSend']['email']) ? filter_var(trim($_POST['formDataToSend']['email']), FILTER_SANITIZE_EMAIL) : '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email address.";

$phone = isset($_POST['formDataToSend']['phone']) ? preg_replace('/[^0-9]/', '', $_POST['formDataToSend']['phone']) : '';
if (!preg_match('/^\d{10,15}$/', $phone)) $errors[] = "Invalid phone number.";

$contactMethod = isset($_POST['formDataToSend']['contactMethod']) ? strtolower(trim($_POST['formDataToSend']['contactMethod'])) : '';
$allowedMethods = ['phone', 'email', 'whatsapp'];
if (!in_array($contactMethod, $allowedMethods)) $errors[] = "Invalid contact method.";

$jobRole = isset($_POST['formDataToSend']['jobRole']) ? htmlspecialchars(trim($_POST['formDataToSend']['jobRole'])) : '';

// Handle resume upload
$resume = $_FILES['formDataToSend']['resume'] ?? null;
$resumePath = null;

if ($resume && $resume['error'] === UPLOAD_ERR_OK) {
    echo "40";
    $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!in_array($resume['type'], $allowedTypes)) {
        // $errors[] = "Resume must be a PDF or DOC/DOCX file.";
        echo "44";
    } else {
        $uploadDir = __DIR__ . '/uploads/resumes/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        echo "48";

        $uniqueName = uniqid('resume_') . "_" . basename($resume['name']);
        $resumePath = $uploadDir . $uniqueName;
echo "40";
        if (!move_uploaded_file($resume['tmp_name'], $resumePath)) {
            // $errors[] = "Failed to upload resume.";
            echo "55";
        }
    }
} else {
    $errors[] = "Resume file is required.";
    echo "60";
    echo "$resume";
}

// Return errors if any
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "errors" => $errors
    ]);
    exit;
}

// ✅ All good – return success
echo json_encode([
    "success" => true,
    "data" => [
        "jobId" => $jobId,
        "fullName" => $fullName,
        "email" => $email,
        "phone" => $phone,
        "contactMethod" => $contactMethod,
        "jobRole" => $jobRole,
        "resumeFileName" => basename($resumePath)
    ]
]);
