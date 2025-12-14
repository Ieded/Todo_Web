<?php
require 'db.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id = $data['id'];
$task = $data['task'];
$dueDate = $data['dueDate'];
$category = $data['category']; // [추가]

// SQL 업데이트문에 category 추가
$sql = "UPDATE todo SET task = ?, due_date = ?, category = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $task, $dueDate, $category, $id);

if ($stmt->execute()) {
    http_response_code(200);
} else {
    http_response_code(500);
}
?>