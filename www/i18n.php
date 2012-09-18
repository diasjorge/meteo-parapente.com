<?php
$lang = 'fr';

if (array_key_exists('lang', $_GET)) {
  if (preg_match("/^(([a-z]{2})|([a-z]{3}))$/", $_GET['lang'])) {
    $lang = $_GET['lang'];
  } else {
    echo "bad language code\n";
    exit();
  }
}

$class = '';

if (isset($is_index)) {
  $class = 'index';
} else if (array_key_exists('js', $_GET)) {
  $class = 'js';
}

$dbh = new PDO('sqlite:../lib/i18n.sqlite3'); 

$sql = "SELECT txt_id, txt, lang FROM i18n WHERE lang = '$lang' AND class = '$class'";
if ($lang != 'fr') {
  $sql = "SELECT txt_id, txt, lang FROM i18n WHERE ( lang = 'fr' OR lang = '$lang' ) AND class = '$class'";
}

$translations = array();

foreach ($dbh->query($sql) as $row)  {
  $translations[$row['txt_id']][$row['lang']] = $row['txt'];
}


if (array_key_exists('js', $_GET)) {
  $json = json_encode($translations);
  
  header("Content-type: application/x-javascript; charset=utf-8");
  ?>
var Translations = <?php echo $json ?>;

function i18n(id) {
  if (!Translations[id]) {
    return "Missing Text ("+id+")";
  }
  if (!Translations[id][lang]) {
    return Translations[id]["fr"];
  } else {
    return Translations[id][lang];
  }
};
  <?php
}


function i18n ($id) {
  global $lang;
  global $translations;
  
  if (!array_key_exists($id, $translations)) return "Missing Text ($id)";
  
  if (array_key_exists($lang, $translations[$id])) {
    return $translations[$id][$lang];
  } else {
    return $translations[$id]['fr'];
  }
}
?>