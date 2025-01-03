<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Function to safely encode JSON
function safe_json_encode($data)
{
    return json_encode($data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
}

// Error handling function
function handle_error($message)
{
    echo safe_json_encode(['success' => false, 'message' => $message]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        handle_error('User not logged in');
    }

    $post_id = $_POST['post_id'] ?? null;
    $content = $_POST['content'] ?? null;
    $user_id = $_SESSION['user_id'];

    if (!$post_id || !$content) {
        handle_error('Missing required fields');
    }

    try {
        // Get user information
        $stmt = $conn->prepare("SELECT username, profile_image FROM usertblaccounts WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user) {
            handle_error('User not found');
        }

        $username = $user['username'];
        $profile_image = $user['profile_image'];

        // Insert comment
        $stmt = $conn->prepare("INSERT INTO comments (post_id, user_id, username, profile_image, content) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $post_id, $user_id, $username, $profile_image, $content);

        if (!$stmt->execute()) {
            handle_error('Failed to add comment');
        }

        $commentId = $stmt->insert_id;

        // Fetch the newly added comment with user details
        $fetchStmt = $conn->prepare("SELECT c.*, u.username, u.profile_image FROM comments c JOIN usertblaccounts u ON c.user_id = u.id WHERE c.id = ?");
        $fetchStmt->bind_param("i", $commentId);
        $fetchStmt->execute();
        $result = $fetchStmt->get_result();
        $newComment = $result->fetch_assoc();

        // Encode the profile image
        $newComment['profile_image'] = $newComment['profile_image'] ? base64_encode($newComment['profile_image']) : null;

        echo safe_json_encode(['success' => true, 'message' => 'Comment added successfully', 'comment' => $newComment]);
    } catch (Exception $e) {
        handle_error('An error occurred: ' . $e->getMessage());
    } finally {
        if (isset($stmt))
            $stmt->close();
        if (isset($fetchStmt))
            $fetchStmt->close();
        $conn->close();
    }
} else {
    handle_error('Invalid request method');
}
