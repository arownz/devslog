<?php
require_once 'config.php';
// Turn off error reporting for production
error_reporting(0);
ini_set('display_errors', 0);
ini_set('error_log', 'C:/xampp/htdocs/devslog/server/php_errors.log');
error_log("Login attempt - Request data: " . print_r($decoded, true));

// Start output buffering
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

session_start();

// Get the content type of the request
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

// If it's a JSON request, decode the input
if (strcasecmp($contentType, 'application/json') == 0) {
    $content = trim(file_get_contents("php://input"));
    $decoded = json_decode($content, associative: true);

    // If json_decode failed, the JSON is invalid
    if (!is_array($decoded)) {
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
        exit;
    }
} else {
    // For non-JSON requests, use $_POST
    $decoded = $_POST;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($decoded['action']) ? $decoded['action'] : null;

    if ($action) {
        if ($action === 'register') {
            $username = $conn->real_escape_string($decoded['username']);
            $email = $conn->real_escape_string($decoded['email']);
            $password = password_hash($decoded['password'], PASSWORD_DEFAULT);

            // Check if email already exists
            $stmt = $conn->prepare("SELECT id FROM usertblaccounts WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                echo json_encode(["success" => false, "message" => "Email already exists"]);
                exit;
            }

            // Handle profile image as base64
            $profile_image = null;
            if (isset($decoded['profile_image']) && !empty($decoded['profile_image'])) {
                $profile_image = $decoded['profile_image'];
            }

            // Generate verification token
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', strtotime('+24 hours'));

            // Start transaction
            $conn->begin_transaction();

            try {
                // Insert user with verified set to 0
                $stmt = $conn->prepare("INSERT INTO usertblaccounts (username, email, password, profile_image, verified) VALUES (?, ?, ?, ?, 0)");
                $stmt->bind_param("ssss", $username, $email, $password, $profile_image);
                $stmt->execute();
                $userId = $conn->insert_id;

                // Insert verification token
                $stmt = $conn->prepare("INSERT INTO email_verification (user_id, token, expires_at) VALUES (?, ?, ?)");
                $stmt->bind_param("iss", $userId, $token, $expires);
                $stmt->execute();

                // Send verification email
                require_once 'includes/email_helper.php';
                if (sendVerificationEmail($email, $token, $username)) {
                    $conn->commit();
                    echo json_encode(["success" => true, "message" => "Registration successful! Please check your email to verify your account."]);
                } else {
                    throw new Exception("Failed to send verification email");
                }
            } catch (Exception $e) {
                $conn->rollback();
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        // Replace the login section with this:
        } elseif ($action === 'login') {
            $email = $conn->real_escape_string($decoded['email']);
            $password = $decoded['password'];
            
            // First check if user exists
            $stmt = $conn->prepare("SELECT * FROM usertblaccounts WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($user = $result->fetch_assoc()) {
                // Check if password is correct
                if (password_verify($password, $user['password'])) {
                    // Now check verification status
                    if (!$user['verified']) {
                        echo json_encode([
                            "success" => false, 
                            "message" => "Please verify your email before logging in."
                        ]);
                        exit;
                    }

                    // If verified, proceed with login
                    $_SESSION['user_id'] = $user['id'];
                    unset($user['password']); // Remove password from response
                    echo json_encode([
                        "success" => true, 
                        "user" => $user
                    ]);
                } else {
                    echo json_encode([
                        "success" => false, 
                        "message" => "Invalid credentials"
                    ]);
                }
            } else {
                echo json_encode([
                    "success" => false, 
                    "message" => "Invalid credentials"
                ]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid action"]);
        }

    } else {
        echo json_encode(["success" => false, "message" => "Action not specified"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
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