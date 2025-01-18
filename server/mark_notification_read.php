<?php
require_once 'config.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$notification_id = $data['notification_id'];
$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("
        UPDATE notifications 
        SET `read` = 1 
        WHERE id = ? AND user_id = ?
    ");
    
    $stmt->bind_param("ii", $notification_id, $user_id);
    $stmt->execute();
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}