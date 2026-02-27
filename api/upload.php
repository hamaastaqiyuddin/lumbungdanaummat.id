<?php
require_once 'db.php';

// Security check for authenticated session
session_start();
if (!isset($_SESSION['admin_id'])) {
    sendResponse(['error' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

$file = $_FILES['file'] ?? null;
$category = $_POST['category'] ?? 'uploads';

if (!$file) {
    sendResponse(['error' => 'No file uploaded'], 400);
}

// Allowed extensions
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    sendResponse(['error' => 'Invalid file type'], 400);
}

// Create directory if not exists
$targetDir = __DIR__ . "/../media/" . $category . "/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$fileName = time() . '_' . basename($file['name']);
$targetPath = $targetDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Return the relative URL from the root
    $url = "/media/" . $category . "/" . $fileName;
    sendResponse(['success' => true, 'url' => $url]);
} else {
    sendResponse(['error' => 'Failed to move uploaded file'], 500);
}
