<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $pdo->prepare("INSERT INTO projects (program_id, title, image, target, collected, days_left) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['program_id'],
            $data['title'],
            $data['image'] ?? '',
            $data['target'] ?? 0,
            $data['collected'] ?? 0,
            $data['days_left'] ?? 0
        ]);
        sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (\Exception $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    try {
        $stmt = $pdo->prepare("UPDATE projects SET title = ?, image = ?, target = ?, collected = ?, days_left = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['image'] ?? '',
            $data['target'] ?? 0,
            $data['collected'] ?? 0,
            $data['days_left'] ?? 0,
            $id
        ]);
        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    $pdo->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);
    sendResponse(['success' => true]);
}
