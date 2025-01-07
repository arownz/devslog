<?php
require_once 'config.php';
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

// Check if the user is logged in as an admin
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    // Ensure the required POST parameters are present
    if (isset($_POST['id'], $_POST['username'], $_POST['email'])) {
        $id = $conn->real_escape_string($_POST['id']);
        $username = $conn->real_escape_string($_POST['username']);
        $email = $conn->real_escape_string($_POST['email']);
        $profile_image = null;

        // Handle file upload if provided
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['tmp_name']) {
            $profile_image = file_get_contents($_FILES['profile_image']['tmp_name']);
        }

        $query = "UPDATE usertblaccounts SET username = ?, email = ?, profile_image = IFNULL(?, profile_image) WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('sssi', $username, $email, $profile_image, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
