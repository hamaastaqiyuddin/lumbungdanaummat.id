<?php
require_once 'db.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_GET['action'] ?? 'login';

    if ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_email'] = $user['email'];
            sendResponse(['success' => true, 'user' => ['email' => $user['email']]]);
        } else {
            // Fallback for legacy local mode password if not migrated yet
            if ($password === 'LDUberk@h2023') {
                $_SESSION['admin_id'] = 0;
                $_SESSION['admin_email'] = 'local@admin';
                sendResponse(['success' => true, 'user' => ['email' => 'local@admin']]);
            } else {
                sendResponse(['success' => false, 'error' => 'Invalid credentials'], 401);
            }
        }
    }

    if ($action === 'logout') {
        session_destroy();
        sendResponse(['success' => true]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['admin_id'])) {
        sendResponse(['authenticated' => true, 'user' => ['email' => $_SESSION['admin_email']]]);
    } else {
        sendResponse(['authenticated' => false], 401);
    }
}
