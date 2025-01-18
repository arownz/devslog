<?php
require_once 'config.php';
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // First, cleanup old entries
    $cleanup = $conn->prepare("
        DELETE FROM reading_history 
        WHERE user_id = ? 
        AND read_at < DATE_SUB(NOW(), INTERVAL 2 DAY)
    ");
    $cleanup->bind_param("i", $user_id);
    $cleanup->execute();

    // Then fetch recent history
    $stmt = $conn->prepare("
        SELECT p.*, rh.read_at,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes,
               COUNT(DISTINCT c.id) as comments
        FROM reading_history rh
        JOIN posts p ON rh.post_id = p.id
        LEFT JOIN post_votes pv ON p.id = pv.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE rh.user_id = ?
        AND rh.read_at >= DATE_SUB(NOW(), INTERVAL 2 DAY)
        GROUP BY p.id, rh.read_at
        ORDER BY rh.read_at DESC
    ");
    
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $history = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['thumbnail']) {
            $row['thumbnail'] = base64_encode($row['thumbnail']);
        }
        $history[] = $row;
    }
    
    echo json_encode(['success' => true, 'history' => $history]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}