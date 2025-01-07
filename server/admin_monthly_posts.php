<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

$query = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
          FROM posts 
          WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
          GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
          ORDER BY month ASC";

$result = $conn->query($query);

$monthlyPosts = [];
while ($row = $result->fetch_assoc()) {
    $monthlyPosts[$row['month']] = intval($row['count']);
}

// Fill in missing months with zero counts
$currentMonth = date('Y-m');
for ($i = 11; $i >= 0; $i--) {
    $month = date('Y-m', strtotime("-$i months"));
    if (!isset($monthlyPosts[$month])) {
        $monthlyPosts[$month] = 0;
    }
}

// Sort by month
ksort($monthlyPosts);

header('Content-Type: application/json');
echo json_encode($monthlyPosts);