<?php
include "connect.php";
if(!$conn){
    $conn = connect();
}
function addGame($uid){
    global $conn;
    $rowSQL = sqlsrv_query($conn, "SELECT MAX(ID) AS m FROM lobbies;" );
    $max = sqlsrv_fetch_array( $rowSQL, SQLSRV_FETCH_ASSOC );
    $maxval = $max['m'];
    $query = "INSERT INTO lobbies (ID, HostID, CreatedTime, CreatedBy) VALUES (?, ?, ?, ?)";
    if($_POST["uname"]){
        $uname = $_POST["uname"];
    } else {
        $uname = "unnamed";
    }
    $vals = array($maxval + 1, $uid, time(), $uname);
    $result = sqlsrv_query($conn, $query, $vals);
    // if($result){
    //     echo "success";
    // }
    // if(!$result){
    //     echo "failed";
    // }
}
addGame("sadfadS");
header("Location: ../lobbies.php");
?>