<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code( 405 ); // Method Not Allowed
    echo "Only POST requests are allowed.";
    exit();
}
$start = microtime(true);
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);
$response = validateArgs($data);
if($response != "ok") {
    http_response_code( 400 );
    echo $response;
    return;
}
date_default_timezone_set('Europe/Moscow');


$radius = $data['R'];
$x_coord = $data['x'];
$y_coord = $data['y'];

$timeSent = microtime(true); // Получаем время отправки

    
header('Content-type: text/html');
echo createTableResponse(
    number_format(floatval($y_coord), 3),
    number_format(floatval($x_coord), 3),
    floatval($radius),
    isHit($y_coord , $x_coord , $radius),
    number_format(microtime(true) - $start , 5),
    $timeSent,
    $time
);


function isHit($y_coord , $x_coord , $radius) {
    if (($y_coord > $x_coord - $radius  && $x_coord >= 0 && $y_coord <= 0) ||
(($y_coord**2 + $x_coord**2 <= $radius**2) && $y_coord <= 0 && $x_coord <= 0) ||
($x_coord >= 0 && $x_coord <= $radius && $y_coord <= $radius && $y_coord >= 0))
        return "true";
    return "false";
}

function validateArgs($data) {
    if (count($data) < 3) {
        return "not enough arguments!";
    }
    foreach ($data as $var) {
        if (!is_numeric($var))
            return "$var is not numeric";
    }
    if (2 > floatval($data['R']) || floatval($data['R']) > 5){
        return "R is not in range";
    }
    if (-2 > floatval($data['X']) || floatval($data['X']) > 2){
        return "X is not in range";
    }
    if (-5 > floatval($data['Y']) || floatval($data['Y']) > 3){
        return "Y is not in range";
    }
    return "ok";
}


function rutime($ru, $rus, $index) {
    return ($ru["ru_$index.tv_sec"]*1000 + intval($ru["ru_$index.tv_usec"]/1000))
     -  ($rus["ru_$index.tv_sec"]*1000 + intval($rus["ru_$index.tv_usec"]/1000));
}




function createTableResponse($y_coord , $x_coord , $radius , $hit , $timeSent, $time) {
    $response = "";
    $response .= wrapTd($x_coord);
    $response .= wrapTd($y_coord);
    $response .= wrapTd($radius);
    $response .= wrapTd($hit);
    $response .= wrapTd("$timeSent second");
    $response .= wrapTd(date('Y-m-d H:i:s', $time));
    return wrapTr($response);
}

function wrapTd($var) {
    return "<td>".$var."</td>";
}
function wrapTr($var) {
    return "<tr>".$var."</tr>";
}
