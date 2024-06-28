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
                $db = new SQLite3('snakeHighscores.sqlite');
                $results = $db->query('SELECT * FROM highscores ORDER BY DESC');

                while ($row = $results->fetchArray()) {
                    echo "<tr><td>{$row['spielername']}</td><td>{$row['score']}</td><td>{$row['schwierigkeitsgrad']}</td></tr>";
                }
            ?>
        </tbody>
    </table>

</body>

</html>