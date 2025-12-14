<?php
header('Content-Type: application/json');
require 'db.php';

$sql = "SELECT * FROM todo ORDER BY is_done ASC, due_date ASC";
$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();
?>