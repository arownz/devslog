<?php
error_reporting(E_ALL);
ini_set('display_errors', 1); // Use for debugging in development; set to 0 in production.
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/devslog/server/php_errors.log');

session_start();
require_once 'config.php';

// Set headers for CORS and JSON response.
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type");

// Ensure only logged-in admins can proceed.
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Handle POST request for deleting posts.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON body from the request.
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id']) || intval($input['id']) <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid post ID']);
        exit;
    }

    $post_id = intval($input['id']);

    try {
        // Prepare the SQL statement.
        $stmt = $conn->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->bind_param("i", $post_id);

        if ($stmt->execute()) {
            // Check if rows were affected.
            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'Post deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'No post found with the given ID']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete post: ' . $stmt->error]);
        }
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
