<?php
$host = 'localhost';
$user = 'root';
$pw = '';        // 본인 비밀번호
$dbName = 'sample02_db';

// 1. MySQL 서버에 먼저 접속 (아직 DB 이름을 넣지 않습니다!)
$conn = new mysqli($host, $user, $pw);

// 접속 실패 시 에러 출력
if ($conn->connect_error) {
    die("MySQL Connection failed: " . $conn->connect_error);
}

// 2. 데이터베이스 자동 생성 (없을 때만 만듦: IF NOT EXISTS)
// 한글 깨짐 방지를 위해 utf8mb4 설정도 같이 합니다.
$sql_db = "CREATE DATABASE IF NOT EXISTS $dbName DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci";
if (!$conn->query($sql_db)) {
    die("Database creation failed: " . $conn->error);
}

// 3. 방금 만든(혹은 이미 있는) DB 선택
$conn->select_db($dbName);

// 4. 테이블 자동 생성 (없을 때만 만듦)
$sql_table = "CREATE TABLE IF NOT EXISTS todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    due_date DATETIME,
    is_done TINYINT(1) DEFAULT 0,
    category VARCHAR(50) DEFAULT '기타'
)";

if (!$conn->query($sql_table)) {
    die("Table creation failed: " . $conn->error);
}

// 5. 한글 설정 (마무리)
$conn->set_charset("utf8mb4");
?>