<?php


$files = array('jquery-1.7.2.min','canvg', 'OpenLayers');

$scripts_dir = '../../js/deps/';
$cache_dir = '../../cache/';

$last = @file_get_contents($cache_dir.'deps.cached');
$new = $last;

foreach ($files as $file) {
  $filename = $scripts_dir.$file.'.js';
  
  if (!file_exists($filename)) die("alert('ERREUR : Chargement du programme impossible !\\n\\nIl manque le fichier \"$file\"');");
  
  $mtime = filemtime($filename);
  if ($mtime>$new) $new = $mtime;
}

if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $new) { 
  header("HTTP/1.1 304 Not Modified"); 
  exit; 
}

header("Content-type: application/x-javascript; charset=utf-8");
header('Last-Modified: '.gmdate("D, d M Y H:i:s \G\M\T",$new));


if ($new == $last) {
  $date_txt = date('d/m/Y H:i:s', $last);
  echo "// deps.js - $date_txt (version en cache)\n\n";
  readfile($cache_dir.'deps.js');
} else {
  $date_txt = date('d/m/Y H:i:s', $new);
  echo "// deps.js - $date_txt (actualisé)\n\n";
  $js = '';
  foreach ($files as $file) {
    $filename = $scripts_dir.$file.'.js';
    $js .= file_get_contents($filename) . "\n\n";
  }
  
 
  @file_put_contents($cache_dir.'deps.js', $js);
  @file_put_contents($cache_dir.'deps.cached', $new);
  
  echo $js;
}


    
?>