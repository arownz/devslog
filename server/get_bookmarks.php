<?php
require_once 'config.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/devslog/server/php_errors.log');

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");


function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } elseif (is_string($mixed)) {
        return mb_convert_encoding($mixed, "UTF-8", "UTF-8");
    }
    return $mixed;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("
        SELECT p.*, 
               COALESCE(SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
               COALESCE(SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes,
               COUNT(DISTINCT c.id) as comments
        FROM bookmarks b
        JOIN posts p ON b.post_id = p.id
        LEFT JOIN post_votes pv ON p.id = pv.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        WHERE b.user_id = ?
        GROUP BY p.id
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $bookmarks = [];

    while ($row = $result->fetch_assoc()) {
        $bookmarks[] = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'author' => $row['author'],
            'created_at' => $row['created_at'],
            'thumbnail' => base64_encode($row['thumbnail']),
            'upvotes' => intval($row['upvotes']),
            'downvotes' => intval($row['downvotes']),
            'comments' => intval($row['comments']),
        );
    }

    echo json_encode(['success' => true, 'bookmarks' => $bookmarks]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}