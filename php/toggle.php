<?php
require 'db.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$id = $data['id'];

// 상태 반전 (0->1, 1->0)
$sql = "UPDATE todo SET is_done = !is_done WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    http_response_code(200);
} else {
    http_response_code(500);
}
?>