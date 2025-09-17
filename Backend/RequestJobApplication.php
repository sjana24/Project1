<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once "./Root/Job.php";

// OPTIONS preflight check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$errors = [];

// Sanitize & validate input fields
$jobId = isset($_POST['jobId']) ? filter_var($_POST['jobId'], FILTER_VALIDATE_INT) : null;
if (!$jobId) $errors[] = "Invalid job ID.";

$fullName = isset($_POST['fullName']) ? htmlspecialchars(trim($_POST['fullName'])) : '';
if (empty($fullName)) $errors[] = "Full name is required.";

$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Invalid email address.";

$phone = isset($_POST['phone']) ? preg_replace('/[^0-9]/', '', $_POST['phone']) : '';
if (!preg_match('/^\d{10,15}$/', $phone)) $errors[] = "Invalid phone number.";

$contactMethod = isset($_POST['contactMethod']) ? strtolower(trim($_POST['contactMethod'])) : '';
$allowedMethods = ['phone', 'email', 'whatsapp'];
if (!in_array($contactMethod, $allowedMethods)) $errors[] = "Invalid contact method.";

$jobRole = isset($_POST['jobRole']) ? htmlspecialchars(trim($_POST['jobRole'])) : '';

// Handle resume upload
$resume = $_FILES['resume'] ?? null;
$resumeFileName = null;

if ($resume && $resume['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!in_array($resume['type'], $allowedTypes)) {
        $errors[] = "Resume must be a PDF or DOC/DOCX file.";
    } else {
        $uploadDir = __DIR__ . '/uploads/resumes/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $uniqueName = uniqid('resume_') . "_" . basename($resume['name']);
        $resumePath = $uploadDir . $uniqueName;

        if (!move_uploaded_file($resume['tmp_name'], $resumePath)) {
            $errors[] = "Failed to upload resume.";
        } else {
            $resumeFileName = $uniqueName;
        }
    }
} else {
    $errors[] = "Resume file is required.";
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
else{
    $job=new Job();
    $responce=$job->addJobApplication($jobId,$fullName,$email,$phone,$contactMethod,$jobRole,$resumeFileName);
    echo json_encode($responce);
}

// ✅ All good – return success
// echo json_encode([
//     "success" => true,
//     "data" => [
//         "jobId" => $jobId,
//         "fullName" => $fullName,
//         "email" => $email,
//         "phone" => $phone,
//         "contactMethod" => $contactMethod,
//         "jobRole" => $jobRole,
//         "resumeFileName" => $resumeFileName
//     ]
// ]);
