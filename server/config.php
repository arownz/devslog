<?php
define('DB_HOST', 'localhost:3307');  // Note the port number here
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'blogsite');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Remove this line in production
// echo "Connected successfully";
