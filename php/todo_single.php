<?php
header('Content-Type: application/json');
require 'db.php';

$id = $_GET['id'];
$sql = "SELECT * FROM todo WHERE id = $id";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

echo json_encode($row);
$conn->close();
?>