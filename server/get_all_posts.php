<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start output buffering
ob_start();

require_once 'config.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

// Log the session data
error_log("Session data: " . print_r($_SESSION, true));
// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $conn->prepare("
        SELECT p.id, p.title, p.content, p.thumbnail, p.author, p.created_at, u.username, u.profile_image,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes,
               COUNT(DISTINCT c.id) as comment
        FROM posts p
        JOIN usertblaccounts u ON p.user_id = u.id
        LEFT JOIN post_votes pv ON p.id = pv.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();

    $result = $stmt->get_result();

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'author' => $row['author'],
            'created_at' => $row['created_at'],
            'thumbnail' => base64_encode($row['thumbnail']),
            'upvotes' => $row['upvotes'],
            'downvotes' => $row['downvotes'],
            'comments' => $row['comment'],
            'username' => $row['username'],
            'profile_image' => base64_encode($row['profile_image'])
        );
    }

    echo json_encode(['success' => true, 'posts' => $posts]);
} catch (Exception $e) {
    error_log("Error in get_all_posts.php: " . $e->getMessage());
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

