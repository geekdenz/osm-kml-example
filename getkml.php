<?php

$f = file_get_contents('json.js');
$json = json_decode($f, true);
foreach ($json as $j) {
    $url = $j['url'];
    passthru("wget '$url'");
}
