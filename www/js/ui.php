<?php

$files = array('carte', 'global', 'emagramme', 'vent', 'ui');

$scripts_dir = '../../js/ui/';
$cache_dir = '../../cache/';

$last = file_get_contents($cache_dir.'ui.cached');
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

echo "// © 2012 Nicolas BALDECK - Tous droits réservés\n";
echo "// si vous souhaitez utiliser ma technologie, contactez moi : nicolas.baldeck@romma.fr\n\n";

if ($new == $last) {
  $date_txt = date('d/m/Y H:i:s', $last);
  echo "// ui.js - $date_txt (version en cache)\n\n";
  readfile($cache_dir.'ui.js');
} else {
  $date_txt = date('d/m/Y H:i:s', $new);
  echo "// ui.js - $date_txt (actualisé)\n\n";
  $js = '';
  foreach ($files as $file) {
    $filename = $scripts_dir.$file.'.js';
    $js .= file_get_contents($filename) . "\n";
  }
  
  require('../../lib/jspack.class.php');
  
  $packer = new JavaScriptPacker($js, 'Normal', true, false);
  $packed = $packer->pack();
  
  file_put_contents($cache_dir.'ui.js', $packed);
  file_put_contents($cache_dir.'ui.cached', $new);
  
  echo $packed;
}


    
?>