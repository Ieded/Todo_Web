<?php
require 'db.php';

$task = $_POST['task'];
$dueDate = $_POST['dueDate'];
$category = $_POST['category']; // [추가] 카테고리 받기

// SQL에 category 컬럼 추가
$sql = "INSERT INTO todo (task, due_date, category) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $task, $dueDate, $category); // "sss"로 변경 (문자열 3개)

if ($stmt->execute()) {
    header("Location:../html/index.html");
} else {
    echo "Error";
}
$stmt->close();
$conn->close();
?>