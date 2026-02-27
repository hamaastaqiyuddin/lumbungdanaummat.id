<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT *, full_name as donor_name, project_title as program_title FROM donations ORDER BY created_at DESC");
        $donations = $stmt->fetchAll();
        sendResponse($donations);
    } catch (\Exception $e) {
        sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    $pdo->prepare("DELETE FROM donations WHERE id = ?")->execute([$id]);
    sendResponse(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        sendResponse(['success' => false, 'error' => 'Invalid data'], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO donations 
            (full_name, gender, wa_number, email, amount, for_someone_else, someone_else_name, prayer, project_title, project_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['full_name'],
            $data['gender'] ?? 'pria',
            $data['wa_number'],
            $data['email'] ?? null,
            $data['amount'],
            $data['for_someone_else'] ? 1 : 0,
            $data['someone_else_name'] ?? null,
            $data['prayer'] ?? null,
            $data['project_title'] ?? 'General',
            $data['project_id'] ?? null,
            'pending'
        ]);

        sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (\Exception $e) {
        sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}
