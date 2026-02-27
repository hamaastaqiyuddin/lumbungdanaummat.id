<?php
require_once 'db.php';

session_start();
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !isset($_SESSION['admin_id'])) {
    sendResponse(['error' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM news ORDER BY date DESC, id DESC");
        $news = $stmt->fetchAll();
        sendResponse($news);
    } catch (\Exception $e) {
        sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $pdo->prepare("INSERT INTO news (title, date, image, snippet, content) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['title'], $data['date'] ?? '', $data['image'] ?? '', $data['snippet'] ?? '', $data['content'] ?? '']);
        sendResponse(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (\Exception $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    try {
        $stmt = $pdo->prepare("UPDATE news SET title = ?, date = ?, image = ?, snippet = ?, content = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['date'] ?? '', $data['image'] ?? '', $data['snippet'] ?? '', $data['content'] ?? '', $id]);
        sendResponse(['success' => true]);
    } catch (\Exception $e) {
        sendResponse(['error' => $e->getMessage()], 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) sendResponse(['error' => 'ID missing'], 400);
    $pdo->prepare("DELETE FROM news WHERE id = ?")->execute([$id]);
    sendResponse(['success' => true]);
}
