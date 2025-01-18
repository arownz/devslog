<?php
require_once 'config.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$post_id = $data['post_id'];
$status = $data['status'];
$user_id = $data['user_id'];

try {
    $conn->begin_transaction();

    // Update post status
    $stmt = $conn->prepare("UPDATE posts SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $post_id);
    $stmt->execute();

    // Create notification
    $message = $status === 'approved' 
        ? 'Your post has been approved and is now visible to the community.' 
        : 'Your post has been rejected.';
    
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, post_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issi", $user_id, $status, $message, $post_id);
    $stmt->execute();

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}