<?php
require_once 'config.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("
        SELECT id, title, content, thumbnail, created_at, updated_at, upvotes, downvotes
        FROM posts 
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");
    
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $posts = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['thumbnail']) {
            $row['thumbnail'] = base64_encode($row['thumbnail']);
        }
        $posts[] = $row;
    }
    
    echo json_encode(['success' => true, 'posts' => $posts]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}