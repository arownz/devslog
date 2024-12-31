<?php
// Turn off error reporting for production
error_reporting(error_level: 0);
ini_set('display_errors', 0);

// Start output buffering
ob_start();

require_once 'config.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }

    echo json_encode(['success' => true, 'posts' => $posts]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching posts: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();

// At the end of the script:
$output = ob_get_clean();
if (json_decode($output) === null) {
    // If the output is not valid JSON, return an error
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
} else {
    // If it's valid JSON, return it as is
    echo $output;
}
