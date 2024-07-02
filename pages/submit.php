<?php
    if(isset($_POST)) {
        $data = file_get_contents("php://input");
        json_decode($data, true); //return a php array
        
    }
?>