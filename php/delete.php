<?php
require 'db.php';

$id = $_GET['id'];

// 1. 일단 해당 데이터를 삭제합니다.
$sql = "DELETE FROM todo WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    
    // 1. 변수 초기화
    $conn->query("SET @count = 0");
    
    // 2. 모든 데이터의 ID를 1부터 차례대로 수정 (1, 2, 3...)
    $conn->query("UPDATE todo SET id = @count:= @count + 1");
    
    // 3. 다음 번호는 마지막 번호 + 1 로 설정
    $conn->query("ALTER TABLE todo AUTO_INCREMENT = 1");
    
    http_response_code(200);
} else {
    http_response_code(500);
}

$stmt->close();
$conn->close();
?>