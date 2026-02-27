<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM programs ORDER BY id ASC");
        $programs = $stmt->fetchAll();

        foreach ($programs as &$program) {
            $stmtPrj = $pdo->prepare("SELECT * FROM projects WHERE program_id = ?");
            $stmtPrj->execute([$program['id']]);
            $program['projects'] = $stmtPrj->fetchAll();
        }

        sendResponse($programs);
    } catch (\Exception $e) {
        sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $pdo->prepare("INSERT INTO programs (title, description, image) VALUES (?, ?, ?)");
        $stmt->execute([$data['title'], $data['description'] ?? '', $data['image'] ?? '']);
        sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (\Exception $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    try {
        $stmt = $pdo->prepare("UPDATE programs SET title = ?, description = ?, image = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['description'] ?? '', $data['image'] ?? '', $id]);
        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    $pdo->prepare("DELETE FROM programs WHERE id = ?")->execute([$id]);
    sendResponse(['success' => true]);
}
