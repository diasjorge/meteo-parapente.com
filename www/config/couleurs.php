<?php
header('Content-type: text/javascript; charset=utf-8');

$tileserve_dir = '../../tileserver';

echo "/*\n   couleurs.js, compilé depuis \n      $tileserve_dir/colors.h\n   et $tileserve_dir/colors.cpp\n*/\n";

/* INDEXES ======================================================== */

$colors_h = file_get_contents($tileserve_dir.'/colors.h');

$pattern = '/define\s(PAL_\w+)\s(\d+)/';
preg_match_all($pattern, $colors_h, $matches, PREG_SET_ORDER);

$indexes = array();
foreach ($matches as $p) {
  $indexes[$p[2]]=$p[1];
}
ksort($indexes);

/* COULEURS ======================================================== */


$colors_cpp_raw = $colors_cpp = file_get_contents($tileserve_dir.'/colors.cpp');

$pattern = '/\/\/.*/i';
$colors_cpp = preg_replace($pattern, '', $colors_cpp);

$pattern = '/\/\*(.*)\*\//msU';
$colors_cpp = preg_replace($pattern, '', $colors_cpp);

$colors_cpp = str_replace(array("\n","\t", " "), '', $colors_cpp);

$pattern = '/Colors::pal\[N_PAL\]\[[\d]+\]\[[\d]+\]={([^;]*)};/';
preg_match($pattern, $colors_cpp, $matches);

$palettes_raw = $matches[1];

$palettes_raw = explode('{{', $palettes_raw);
array_shift($palettes_raw);


$pattern = '/Colors::pal_len\[N_PAL\]={(.*)};/';
preg_match($pattern, $colors_cpp, $matches);

$palettes_len = explode(',', $matches[1]);


$palettes=array();
foreach ($palettes_raw as $k=>$pal) {
  $pal_name=$indexes[$k];
  $palettes[$pal_name] = explode('},', $pal);
  array_pop($palettes[$pal_name]);
  foreach ($palettes[$pal_name] as $i=>$str) {
    $palettes[$pal_name][$i] = str_replace(array('{', '}'), '',  $str);
  }
  array_splice($palettes[$pal_name], $palettes_len[$k]);
  foreach ($palettes[$pal_name] as $i=>$str) {
    $palettes[$pal_name][$i] = array_map('floatval', explode(',', $str));
    
  }
}
if (array_key_exists('debug', $_GET)) {
  print_r($palettes);
} else {
  echo 'var Palettes = ';
  echo json_encode($palettes);
  echo ';';
}


/* whichPalette ======================================================== */
$colors_cpp = str_replace(array("\t", " "), '', $colors_cpp_raw);
$pattern = '/Colors::SetPalette\(char\*param\){(.*)}\/\/finsetPalette/msU';
preg_match($pattern, $colors_cpp, $matches);

$whichPalette  = $matches[1];
$whichPalette = str_replace('cx=0;', 'var c;', $whichPalette);

$pattern = '/if\(strcmp\("([A-Z0-9-]+)",param\)==0\)/';
$replacement = ' if("$1"==p)';
$whichPalette = preg_replace($pattern, $replacement, $whichPalette);

$pattern = '/cx=([A-Z0-9-_]+);/';
$replacement = 'c="$1";';
$whichPalette = preg_replace($pattern, $replacement, $whichPalette);

$whichPalette = str_replace("\n", '', $whichPalette);

echo 'function whichPalette(p) {';
echo 'p = p.toUpperCase();';
echo $whichPalette;
echo 'return c};';
?>
