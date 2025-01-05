<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/devslog/server/php_errors.log');

session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

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
    error_log("User ID: " . $user_id);

    $stmt = $conn->prepare("
        SELECT p.* FROM bookmarks b
        JOIN posts p ON b.post_id = p.id
        WHERE b.user_id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $bookmarks = $result->fetch_all(MYSQLI_ASSOC);

    error_log("Number of bookmarks: " . count($bookmarks));

    // Convert all data to UTF-8
    $bookmarks = utf8ize($bookmarks);

    $json_output = json_encode(['success' => true, 'bookmarks' => $bookmarks], JSON_UNESCAPED_UNICODE);

    if ($json_output === false) {
        error_log("JSON encode error: " . json_last_error_msg());
        echo json_encode(['success' => false, 'message' => 'Server error occurred: Failed to encode JSON']);
    } else {
        echo $json_output;
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

