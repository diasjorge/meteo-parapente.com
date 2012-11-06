<?php
header('Content-type: text/html; charset=utf-8');
function v ($fichier) {
  echo filemtime('.'.$fichier);
}

$is_index = true;
$icare = array_key_exists('icare', $_GET);
include('i18n.php');
?>
<!DOCTYPE html>
<html>
  <head>
  
    <title><?php echo i18n('titre') ?></title>
    
    <link rel="stylesheet" href="<?php if ($icare) echo '/icare' ?>/css/style.css?_<?php v('/css/style.css');?>">
    
    <script type="text/javascript">
    document.write('<style type="text/css">#nojs { display: none; }</style>');
    
    var lang = "<?php echo $lang ?>";
    var icare = <?php $icare ? print 'true' : print 'false'; ?>;
    </script>
    
    <!--[if lt IE 8]><script type="text/javascript" src="/js/ie7.js?_<?php v('/js/ie7.js');?>"></script><![endif]-->
    
    
  </head>
  <body>
    
    <div id="seo">
      <h1><?php echo i18n('seo_h1') ?></h1>
      <p><?php echo i18n('seo_txt') ?></p>
    </div>
    
    <div id="chargement"><?php echo i18n('chargement') ?></div>

    <div id="page">
    
      <div id="header">
	<b><big><?php $icare ? print 'http://meteo-parapente.com/icare/' : print i18n('header_titre'); ?></big></b>
	<span id="langs"></span><?php if (!$icare) echo '<img src="/img/new.gif">' ?>
	<div id="helpUs">
	  <?php if (array_key_exists('icare', $_GET)) echo '<img src="/icare/img/elephant.png">' ?>
	</div>
	
	<div id="date-select">
            ...
	</div>
	<a id="date-refresh" title="Check for updates"><img src="/img/refresh.png"></a>
      </div>
      
      
      <div id="bloc">
	
	<div id="bloc-carte">
	
	  <div id="bloc-carte-haut">
	   
	    <div id="bloc-carte-haut-hour">
	      <a id="select-hour-prev">&lt;</a>
	      <div id="hour-slider"><input type="button" id="hour-slider-handle" value=""></div>
	      <span id="select-hour"></span>
	      <a id="select-hour-next">&gt;</a>
	    </div>
	    
	    <a id="select-param"><span id="param-txt"></span> <img src="/img/fleche-bas.gif"></a>
	    
	    <div id="select-param-menu">
	      <div id="param-list"></div>
	      <div id="param-categorie"></div>
	    </div>
	  </div>
	  <div id="bloc-carte-carte">
	    <div id="carte-search">
	      <form id="carte-search-form">
		<input type="text" id="carte-search-input">
		<a id="carte-search-go"><img src="/img/recherche.png" alt="go"></a>
	      </form>
	    </div>
	    <div id="carte-zoom">
	      <a id="carte-zoom-plus">+</a>
	      <a id="carte-zoom-moins">-</a>
	    </div>
	    <div id="carte-attrib"><?php echo i18n('attrib_osm') ?></div>
	  </div>
	  <div id="bloc-carte-bas">
	    <div id="legende-carte">
	      
	      <div id="legende-carte-scale">
	      &nbsp;
	      </div>
	    
	      <div id="legende-carte-unit"></div>
	    
	      <input type="checkbox" id="noipSwitch" name="noipSwitch" checked="checked"><label for="noipSwitch"><?php echo i18n('interpolation') ?></label>
	      <input type="checkbox" id="colorbindSwitch" name="colorbindSwitch" onclick="alert('<?php echo i18n('pas_encore_dispo') ?>'); return false;"><label for="colorbindSwitch"><?php echo i18n('daltonien') ?></label>
	      <select onchange="Carte.setOpacity('RASP', this.value)" title="<?php echo i18n('transparence_couche') ?> <?php echo i18n('meteo') ?>">
		<option disabled="disabled" selected="selected"><?php echo i18n('meteo') ?></option>
		<option>10</option>
		<option>9</option>
		<option>8</option>
		<option>7</option>
		<option>6</option>
		<option>5</option>
		<option>4</option>
		<option>3</option>
		<option>2</option>
		<option>1</option>
		<option>0</option>
	      </select>
	      <select onchange="Carte.setOpacity('Relief NASA SRTM3', this.value)" title="<?php echo i18n('transparence_couche') ?> <?php echo i18n('relief') ?>">
		<option disabled="disabled" selected="selected"><?php echo i18n('relief') ?></option>
		<option>10</option>
		<option>9</option>
		<option>8</option>
		<option>7</option>
		<option>6</option>
		<option>5</option>
		<option>4</option>
		<option>3</option>
		<option>2</option>
		<option>1</option>
		<option>0</option>
	      </select>
	      <select onchange="Carte.setOpacity('Cartographie OpenStreetMap', this.value)" title="<?php echo i18n('transparence_couche') ?> <?php echo i18n('geo') ?>">
		<option disabled="disabled" selected="selected"><?php echo i18n('geo') ?></option>
		<option>10</option>
		<option>9</option>
		<option>8</option>
		<option>7</option>
		<option>6</option>
		<option>5</option>
		<option>4</option>
		<option>3</option>
		<option>2</option>
		<option>1</option>
		<option>0</option>
	      </select>
	    </div>
	  </div>
	
	</div>
	
	<div id="bloc-details">
	  <div id="bloc-details-tabs">
	    
	    <a id="tab-vent"><?php echo i18n('vent_vs_alti') ?></a>
	    <a id="tab-emagramme"><?php echo i18n('emagramme') ?></a>
	    <a id="tab-bulletin"><?php echo i18n('bulletin') ?></a>
	    <a id="tab-aide"><?php echo i18n('aide') ?></a>
	    <a id="tab-avis"><?php echo i18n('avis') ?></a>
	    <!--<a id="tab-resume"><?php echo i18n('instabilite') ?>test</a>-->
	  </div>
	  <div id="bloc-details-load">
	    <img src="/img/load.gif">
	  </div>
	  <div id="bloc-details-main">
	    <?php if ($icare) {
	      $file = "/icare/welcome.html";
	    } else {
	      $file = "/welcome.html";
	    }
	    ?>
	    <iframe frameborder="0" src="<?php echo $file;?>?_<?php v("/$file");?>"></iframe>
	  </div>
	  <div id="aide"></div>
	  <div id="bloc-details-infos">
	    <b><?php
	    $res = $icare ? "1.8km" : "2.5km";
	    echo str_replace('XXkm', $res, i18n('infos_run'));
	    ?></b><br>
	    <br>
	      <?php echo i18n('infos_partenaires') ?><br>
	      <i>
	      <a href="http://ffvl.fr" target="_blank">Fédération Française de Vol Libre</a>, 
	      Ligues de Vol Libre <a href="http://lravl.o2switch.net/lravl/" target="_blank">Rhône Alpes</a> et <a href="http://www.lvlpaca.org/" target="_blank">PACA</a>, 
	      <a href="http://parapente.fr/" target="_blank">Airbulle</a>
	      </i><br>
	      <br>
	      <?php echo i18n('infos_reutil') ?> <img src="/img/cc80x15.png">
	  </div>
	</div>
	
      </div>
      
      <div id="footer">
	meteo-parapente.com - &copy; 2012 Nicolas BALDECK - <a href="javascript:void(0);" onclick="UserVoice.showPopupWidget();">Contact</a> - <a href="javascript:void(0);">Embauchez moi !</a> - <a href="javascript:void(0);">Mentions Légales</a>
      </div>
    </div>
    
     <div id="popup">
      <div id="popup-fond"></div>
      <input id="popup-button" type="button" value="Fermer" onclick="$('#popup').hide();">
      <div id="popup-txt"></div>
      <img id="popup-load" src="/img/load2.gif">
    </div>
    
    <div id="nojs">
    <h1>Oups !</h1>
    <p>Désolé, ce site internet nécessite Javascript pour fonctionner.</p>
    </div>
    
    <div id="helpParams"></div>
    
    <!--[if lt IE 9]><script type="text/javascript" src="/js/flashcanvas.js?_<?php v('/js/flashcanvas.js');?>"></script><![endif]-->
   
    <script src="/i18n.php?js&lang=<?php echo $lang ?>"></script>
    
    <script src="http://openlayers.org/api/2.12/OpenLayers.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
    <script src="/js/deps.php<?php if (array_key_exists('debug', $_GET)) echo '?debug'; ?>"></script>
    <script src="/a/config.js?_<?php v('/a/config.js');?>"></script>
    <script src="/config/couleurs.php"></script>
    <script src="/js/ui.php<?php if (array_key_exists('debug', $_GET)) echo '?debug'; ?>"></script>
    
    
    <?php if (!array_key_exists('debug', $_GET)) { ?>
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-33404916-1']);
      _gaq.push(['_setDomainName', 'meteo-parapente.com']);
      _gaq.push(['_trackPageview']);

      (function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();


  
      var uvOptions = {};
      (function() {
	var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
	uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/bZYqGPOXgyVT1Te3be3QiQ.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
      })();
      
        
    </script>
    
  <?php } ?>
  </body>
</html>
