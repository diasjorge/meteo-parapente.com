<?php
function v ($fichier) {
  echo filemtime('.'.$fichier);
}
?>
<!DOCTYPE html>
<html>
  <head>
  
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>Prévisions météo pour le Vol Libre - meteo-parapente.com - </title>
    
    <link rel="stylesheet" href="/css/layout.css?_<?php v('/css/layout.css');?>">
    <link rel="stylesheet" href="/css/style.css?_<?php v('/css/style.css');?>">
    
    <script type="text/javascript">
    document.write('<style type="text/css">#nojs { display: none; }</style>');
    </script>
    
    <!--[if lt IE 8]><script type="text/javascript" src="/js/ie7.js?_<?php v('/js/ie7.js');?>"></script><![endif]-->
    <!--[if lt IE 9]><script type="text/javascript" src="/js/flashcanvas.js?_<?php v('/js/flashcanvas.js');?>"></script><![endif]-->
   
    <script src="/js/deps.php"></script>
    <script src="/a/config.js?_<?php v('/a/config.js');?>"></script>
    <script src="/config/couleurs.php"></script>
    <script src="/js/ui.php"></script>
    
  </head>
  <body>
    
    <div id="seo">
      <h1>Météo-parapente.com - Météo pour le vol libre : parapente, deltaplanne.</h1>
      <p>Météo-parapente.com est un site météo gratuit pour le vol libre et le parapente. En utilisant le modèle RASP (regional atmospheric soaring prediction), nous vous donnons une prévision des ascendances thermiques, prévision du plafond, des émagrammes pour le parapente.</p>
    </div>
    
    <div id="chargement">Chargement de l'application ...</div>

    <div id="page">
    
      <div id="header">
	<b><big>Prévisions météo pour le Vol Libre - <i>Expérimental</i></big></b>
	
	<div id="helpUs">
	  Don't speak french ?<br>
	  English website is coming soon...
	</div>
	
	<div id="date-select">
            ...
	  </div>
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
	    
	    <a id="select-param"><span id="param-txt">Altitude Plafond Couche Conv</span> <img src="img/fleche-bas.gif"></a>
	    
	    <div id="select-param-menu">
	      <div id="param-list"></div>
	      <div id="param-categorie"></div>
	    </div>
	  </div>
	  <div id="bloc-carte-carte">
	    <div id="carte-zoom">
	      <a id="carte-zoom-plus">+</a>
	      <a id="carte-zoom-moins">-</a>
	    </div>
	    <div id="carte-attrib">données géographiques &copy; <a href="http://www.openstreetmap.org/" target="_blank">les contributeurs d'OpenStreetMap</a>, licence <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC BY-SA</a></div>
	  </div>
	  <div id="bloc-carte-bas">
	    <div id="legende-carte">
	      
	      <div id="legende-carte-scale">
	      &nbsp;
	      </div>
	    
	      <div id="legende-carte-unit"></div>
	    
	      <input type="checkbox" id="noipSwitch" name="noipSwitch" checked="checked"><label for="noipSwitch">Interpolation</label>
	      <input type="checkbox" id="colorbindSwitch" name="colorbindSwitch" onclick="alert('Version daltonien pas encore dispo, désolé'); return false;"><label for="colorbindSwitch">Daltonien</label>
	      <select onchange="Carte.setOpacity('RASP', this.value)" title="Transparence de la couche météo">
		<option disabled="disabled" selected="selected">Météo</option>
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
	      <select onchange="Carte.setOpacity('Relief NASA SRTM3', this.value)" title="Transparence de la couche relief">
		<option disabled="disabled" selected="selected">Relief</option>
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
	      <select onchange="Carte.setOpacity('Cartographie OpenStreetMap', this.value)" title="Transparence de la couche Géographique">
		<option disabled="disabled" selected="selected">Géo</option>
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
	    <a id="tab-visuglobale">Global</a>
	    <a id="tab-vent">Vent vs Alti</a>
	    <a id="tab-emagramme">Emagramme</a>
	    <a id="tab-aide">Aide</a>
	    <a id="tab-avis">Votre Avis</a>
	  </div>
	  <div id="bloc-details-load">
	    <img src="/img/load.gif">
	  </div>
	  <div id="bloc-details-main">
	    <iframe frameborder="0" src="/welcome.html?_<?php v('/welcome.html');?>"></iframe>
	  </div>
	  <div id="aide"></div>
	  <div id="bloc-details-infos">
	    <b>Prévisions pour le <span id="infos-date">...</span>, Modèle RASP (WRF-ARW) 2.5km, run <span id="infos-run">...</span></b><br>
	    <br>
	      Données fournies par l'association <a href="http://rasp-france.org">RASP France</a> grâce à ses partenaires :<br>
	      <i>
	      <a href="http://ffvl.fr" target="_blank">Fédération Française de Vol Libre</a>, 
	      Ligues de Vol Libre <a href="http://lravl.o2switch.net/lravl/" target="_blank">Rhône Alpes</a> et <a href="http://www.lvlpaca.org/" target="_blank">PACA</a>, 
	      <a href="http://parapente.fr/" target="_blank">Airbulle</a>
	      </i><br>
	      <br>
	      <a href="http://rasp-france.org/utiliser-les-donnees" target="_blank">Réutilisation des données</a> autorisée, sous licence Creative Commons : <img src="http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png">
	  </div>
	</div>
	
      </div>
      
      <div id="footer">
	meteo-parapente.com - &copy; 2012 Nicolas BALDECK - <a href="javascript:void(0);" onclick="UserVoice.showPopupWidget();">Contact</a> - <a href="javascript:void(0);">Embauchez moi !</a> - <a href="javascript:void(0);">Mentions Légales</a>
      </div>
    </div>
    
     <div id="popup">
      <div id="popup-fond"></div>
      <input id="popup-button" type="button" value="Retour au site &raquo;" onclick="$('#popup').fadeOut();">
      <div id="popup-txt">
      </div>
    </div>
    
    <div id="nojs">
    <h1>Oups !</h1>
    <p>Désolé, ce site internet nécessite Javascript pour fonctionner.</p>
    </div>
    
    <div id="helpParams"></div>
    
    
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

</script>
<script type="text/javascript">
  var uvOptions = {};
  (function() {
    var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
    uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/bZYqGPOXgyVT1Te3be3QiQ.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
  })();
</script>
  </body>
</html>
