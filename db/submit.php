<?php
// Verbindung zur SQLite-Datenbank herstellen
$db = new SQLite3('../db/snakeHighscores.sqlite');

// JSON-Daten empfangen
$data = json_decode(file_get_contents('php://input'), true);

// Variablen aus den JSON-Daten extrahieren
$username = $data['username'];
$highscore = $data['score'];
$difficulty = $data['difficulty'];
$timestamp = $data['timestamp'];

// Daten in die SQLite-Datenbank einfügen
$stmt = $db->prepare('INSERT INTO highscores (username, score, difficulty, timestamp) VALUES (:username, :score, :difficulty, :timestamp)');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$stmt->bindValue(':score', $highscore, SQLITE3_INTEGER);
$stmt->bindValue(':difficulty', $difficulty, SQLITE3_TEXT);
$stmt->bindValue(':timestamp', $timestamp, SQLITE3_TEXT);
$result = $stmt->execute();

// Success :D
// echo json_encode(['status' => 'success']);

if ($result) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to insert data']);
}
?>