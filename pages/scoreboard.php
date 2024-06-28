<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Snake Game Scoreboard</title>
    <link href="../style/scoreboard.css" rel="stylesheet">
</head>

<body>
    <h1 id="scoreHeading">Scoreboard</h1>
    <hr>
    <button id="homeBtn" onclick="location.href='../Index.html'"><img src="../img/homeIcon.png" alt="homeIcon"></button>
    <hr>

    <table>
        <thead>
            <tr>
                <th>Username</th>
                <th>Score</th>
                <th>Diffuculty</th>
            </tr>
        </thead>
        <tbody>
            <?php
                $db = new SQLite3('snakeHighscores.sqlite' ,
                                     SQLITE3_OPEN_READWRITE ,
                              SQLITE3_OPEN_CREATE);

                $results = $db->query('SELECT * FROM highscores ORDER BY score DESC');

            // Highscores in Tabelle ausgeben
            while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
                echo "<tr>";
                echo "<td>{$row['id']}</td>";
                echo "<td>{$row['username']}</td>";
                echo "<td>{$row['score']}</td>";
                echo "<td>{$row['difficulty']}</td>";
                echo "<td>{$row['timestamp']}</td>";
                echo "</tr>";
            }

            // Verbindung schließen
            $db->close();
            ?>
        </tbody>
    </table>

</body>

</html>