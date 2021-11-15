<?php 
function cleanupGames(){
    global $conn;
    $minTime = time() - 180;
    $query = "DELETE FROM lobbies WHERE CreatedTime < ".$minTime;
    $result = sqlsrv_query($conn, $query);
}
?>