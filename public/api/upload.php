<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Security: Simple check if you want, or handle via Hostinger auth
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration
$target_dir = "../media/"; // Base folder for media
$max_size = 5 * 1024 * 1024; // 5MB limit
$allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

if (!isset($_FILES['file']) || !isset($_POST['category'])) {
    echo json_encode(['error' => 'Missing file or category']);
    exit;
}

$file = $_FILES['file'];
$category = preg_replace('/[^a-z0-9]/', '', $_POST['category']); // Sanitize category
$category_dir = $target_dir . $category . "/";

// 1. Create directory if not exists
if (!file_exists($category_dir)) {
    mkdir($category_dir, 0755, true);
}

// 2. Validate file
if ($file['size'] > $max_size) {
    echo json_encode(['error' => 'File too large (Max 5MB)']);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
if (!in_array($mime, $allowed_types)) {
    echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, WEBP, GIF allowed.']);
    exit;
}

// 3. Generate safe filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . "_" . time() . "." . $ext;
$target_file = $category_dir . $filename;

// 4. Move file
if (move_uploaded_file($file['tmp_name'], $target_file)) {
    // Return relative URL for storage in DB
    $relative_path = "/media/" . $category . "/" . $filename;
    echo json_encode([
        'success' => true,
        'url' => $relative_path,
        'full_url' => "https://" . $_SERVER['HTTP_HOST'] . $relative_path
    ]);
} else {
    echo json_encode(['error' => 'Failed to move uploaded file. Check folder permissions.']);
}
?>
