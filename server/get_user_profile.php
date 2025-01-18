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
    // Get user data including post and comment counts
    $stmt = $conn->prepare("
        SELECT 
            u.*,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as post_count,
            (SELECT COUNT(*) FROM comments WHERE user_id = u.id) as comment_count
        FROM usertblaccounts u 
        WHERE u.id = ?
    ");
    
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Handle profile image
        if ($user['profile_image']) {
            $user['profile_image'] = 'data:image/jpeg;base64,' . base64_encode($user['profile_image']);
        }

        // Remove sensitive data
        unset($user['password']);

        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} catch (Exception $e) {
    error_log("Error in get_user_profile.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
}

$conn->close();
