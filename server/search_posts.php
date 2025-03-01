<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Ensure user is authenticated
session_start();
if (!isset($_SESSION['user_id']) && !isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['query'])) {
    $searchQuery = '%' . $_GET['query'] . '%';

    try {
        // Prepare statement for secure search
        $stmt = $conn->prepare("
            SELECT p.*, u.username, u.profile_image,
                   COALESCE(SUM(CASE WHEN pv.vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
                   COALESCE(SUM(CASE WHEN pv.vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes,
                   COUNT(DISTINCT c.id) as comments
            FROM posts p
            JOIN usertblaccounts u ON p.user_id = u.id
            LEFT JOIN post_votes pv ON p.id = pv.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE (p.title LIKE ? OR p.content LIKE ?) 
            AND p.status = 'approved'
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT 100
        ");

        $stmt->bind_param("ss", $searchQuery, $searchQuery);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'content' => $row['content'],
                'author' => $row['username'],
                'created_at' => $row['created_at'],
                'thumbnail' => $row['thumbnail'] ? base64_encode($row['thumbnail']) : null,
                'upvotes' => intval($row['upvotes']),
                'downvotes' => intval($row['downvotes']),
                'comments' => intval($row['comments']),
                'username' => $row['username'],
                'profile_image' => $row['profile_image'] ? base64_encode($row['profile_image']) : null
            );
        }

        echo json_encode(['success' => true, 'posts' => $posts, 'query' => $_GET['query']]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error searching posts: ' . $e->getMessage()]);
    } finally {
        if (isset($stmt)) {
            $stmt->close();
        }
        if (isset($conn)) {
            $conn->close();
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
