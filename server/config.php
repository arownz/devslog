<?php
define('DB_HOST', 'localhost');  // Note the port number here
define('DB_USER', 'root');
define('DB_PASS', 'P@sy0wn');
define('DB_NAME', 'blogsite');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Optionally, you can log the connection status for debugging purposes 
// error_log("Connected successfully", 0); // 0 means the message is logged to the PHP error log