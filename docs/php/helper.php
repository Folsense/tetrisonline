<?php
include "connect.php";
include "cleanupGames.php";
if(!$conn){
    $conn = connect();
}
function getAllGames(){
    global $conn;
    cleanupGames($conn);
    $games = array();
    $allGames = sqlsrv_query($conn, "SELECT * FROM lobbies");
    while( $row = sqlsrv_fetch_array($allGames, SQLSRV_FETCH_ASSOC) ) {
        array_push($games, array($row["ID"], $row["HostID"], $row["CreatedTime"], $row["CreatedBy"]));
    }
    return $games;
}
?>