<?php
function connect(){
    $serverName = "localhost\\SQLEXPRESS"; //serverName\instanceName

    // Since UID and PWD are not specified in the $connectionInfo array,
    // The connection will be attempted using Windows Authentication.
    $connectionInfo = array( "Database"=>"master");
    $conn = sqlsrv_connect( $serverName, $connectionInfo);
    if( $conn ) {
        return $conn;
        echo "Connection established.<br />";
    }else{
        echo "Connection could not be established.<br />";
        die( print_r( sqlsrv_errors(), true));
    }
}
// $result = sqlsrv_query($conn, "SELECT * FROM lobbies");
// while( $row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC) ) {
//     echo $row['ID'].", ".$row['HostID']."<br />";
// }
?>