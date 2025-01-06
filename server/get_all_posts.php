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

try {
    // Check database connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("
        SELECT p.id, p.title, p.content, p.thumbnail, p.author, p.created_at, u.username, u.profile_image,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes,
               COUNT(DISTINCT c.id) as comments
        FROM posts p
        JOIN usertblaccounts u ON p.user_id = u.id
        LEFT JOIN post_votes pv ON p.id = pv.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => true, 'posts' => []]);
        exit;
    }
    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'author' => $row['author'],
            'created_at' => $row['created_at'],
            'thumbnail' => $row['thumbnail'] ? base64_encode($row['thumbnail']) : null,
            'upvotes' => intval($row['upvotes']),
            'downvotes' => intval($row['downvotes']),
            'comments' => intval($row['comments']),
            'username' => $row['username'],
            'profile_image' => $row['profile_image'] ? base64_encode($row['profile_image']) : null
        );
    }

    echo json_encode(['success' => true, 'posts' => $posts]);
} catch (Exception $e) {
    error_log("Error in get_all_posts.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error fetching posts: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}

// At the end of the script:
$output = ob_get_clean();
if (json_decode($output) === null) {
    // If the output is not valid JSON, return an error
    echo json_encode(['success' => false, 'message' => 'Server error occurred']);
} else {
    // If it's valid JSON, return it as is
    echo $output;
}

