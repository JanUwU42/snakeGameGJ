<?php
// Verbindung zur SQLite-Datenbank herstellen
$db = new SQLite3('../db/snakeHighscores.sqlite');

// JSON-Daten empfangen
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Variablen aus den JSON-Daten extrahieren
$username = $data['username'];
$highscore = $data['highscore'];
$difficulty = $data['difficulty'];
$timestamp = $data['timestamp'];

// Daten in die SQLite-Datenbank einfügen
$stmt = $db->prepare('INSERT INTO highscores (username, highscore, difficulty, timestamp) VALUES (:username, :highscore, :difficulty, :timestamp)');
$stmt->bindValue(':username', $username, SQLITE3_TEXT);
$stmt->bindValue(':highscore', $highscore, SQLITE3_INTEGER);
$stmt->bindValue(':difficulty', $difficulty, SQLITE3_TEXT);
$stmt->bindValue(':timestamp', $timestamp, SQLITE3_TEXT);
$stmt->execute();

// Erfolgsnachricht zurückgeben
echo json_encode(["message" => "Highscore submitted successfully!"]);
?>