
function CarteObject () {
  
  this.ready = false;
  this.wgs84 = new OpenLayers.Projection("EPSG:4326");
  this.mercator = new OpenLayers.Projection("EPSG:900913");
  this.zone = {};
  
  this.Init = function () {
  
    this.map = new OpenLayers.Map({div: "bloc-carte-carte", allOverlays: true, controls: []});
    
    
    this.map.addControl(new OpenLayers.Control.Navigation());

    var OSMLayer = new OpenLayers.Layer.OSM("Cartographie OpenStreetMap", "http://tilestream.meteo-parapente.com/RASP_Geolayer_9c3d4e/${z}/${x}/${y}.png", {tileOptions: {crossOriginKeyword: null}});
    //OSMLayer.setOpacity(0.8);

   
    
    
    //var hill = new OpenLayers.Layer.OSM("Relief NASA SRTM3", "/img/blank.png");
    var hill = new OpenLayers.Layer.OSM("Relief NASA SRTM3", "http://toolserver.org/~cmarqu/hill/${z}/${x}/${y}.png", {tileOptions: {crossOriginKeyword: null}});
    //hill.setOpacity(0.7);

    
    
    
    
    var markers = new OpenLayers.Layer.Markers( "Markers", {'displayInLayerSwitcher':false} );
    
    
    this.map.addLayers([hill, OSMLayer]);

    this.map.setLayerIndex(hill, 1);
    this.map.setLayerIndex(OSMLayer, 2);
    
    
    this.zone = new OpenLayers.Marker(new OpenLayers.LonLat(0,0)) ;
    markers.addMarker(this.zone);
    this.map.addLayer(markers);
    this.map.addControl(new OpenLayers.Control.LayerSwitcher());
    var scaleline = new OpenLayers.Control.ScaleLine();
    this.map.addControl(scaleline);

    var center;
    if (icare) {
      center = new OpenLayers.LonLat(5.9,45.3).transform(this.wgs84,this.mercator);
      this.map.setCenter(center, 9);
    } else {
      center = new OpenLayers.LonLat(2.5,46.5).transform(this.wgs84,this.mercator);
      this.map.setCenter(center, 6); 
    }
    $("#carte-zoom a").attr("href", "javascript:void(0);");
    $("#carte-zoom-plus").click(function() {
      Carte.map.zoomIn();
    });
    $("#carte-zoom-moins").click(function() {
      Carte.map.zoomOut();
    });
    
    this.setRASPLayer();
    this.map.events.register("click", this.map , this.getPoint);
    /*markers.events.on({
      moveend: function(e) {
	  if (e.zoomChanged) {
	    Carte.updateZone();
	  }
	}
    });*/
    this.refreshEchelle();
    

    
    this.ready = true;
    
  };
  
  this.getPoint = function (e) {
    var lonlat = Carte.map.getLonLatFromViewPortPx(e.xy);
    
    lonlat.transform(Carte.mercator, Carte.wgs84);
    UI.refreshDetails(lonlat);
  };
  
  this.setRASPLayer = function () {
    
    var utc = strPad(UI.Params.heure-UI.Params.tz, 2); 
    
    var serveur;
    if (icare) {
      serveur = "http://euro2012.meteo-parapente.com/map.php?tile=";
    } else {
      serveur = "http://wms.meteo-parapente.com/";
    }
    var url=serveur+UI.Params.run+"/"+UI.Params.date+utc+"0000/"+UI.Params.domain+"/"+UI.Params.param+"/${z}/${x}/${y}";
    UI.Params.noip ? url += "/noip.png" : url += "/tile.png";
    var RASPLayer = new OpenLayers.Layer.OSM("RASP", url, {tileOptions: {crossOriginKeyword: null}});
    RASPLayer.setOpacity(UI.Params.opacity);

    this.map.addLayer(RASPLayer);
    this.map.setLayerIndex(RASPLayer, 0);
    
  };
  
  this.refreshRASPLayer = function () {
    if (this.ready) {
      var layers = this.map.getLayersByName("RASP");
      this.map.removeLayer(layers[0]);
      layers[0].destroy();
      this.setRASPLayer();
    }  
   };
   
  this.updateZone = function () {
    var lonlat = new OpenLayers.LonLat(UI.Params.lon, UI.Params.lat).transform(this.wgs84,this.mercator);
    var opx = this.map.getLayerPxFromLonLat(lonlat);
    this.zone.map = this.map ;
    this.zone.moveTo(opx) ;
    //console.log(this.map.getZoom());
  };
  
  this.switchRASPLayer = function (param, html) {
    $("#param-txt").html(html);
    UI.Params.param=param;
    this.refreshRASPLayer();
    this.refreshEchelle();
  };
  
  this.setOpacity = function (layerName, opacity) {
     var layer = this.map.getLayersByName(layerName);
     opacity /= 10;
     layer[0].setOpacity(opacity);
     if ("RASP" == layerName) {
       UI.Params.opacity = opacity;
       $("#legende-carte-scale").css("opacity", opacity);
     }
   };
   
  this.refreshEchelle = function () {
    var pal = whichPalette(UI.Params.param);
    
    if (!pal) {
       $("#legende-carte-scale").html("<p>"+i18n("legende_manquante")+"</p>");
       return;
    }
    
    var ncolors = Palettes[pal].length;
    var w = $("#legende-carte-scale").width();
    var h = 50;
    var colh = 30;
    
    
    var canvasEl = $("<canvas id=\"colorscale\" width></canvas>");
    canvasEl.attr("width", w);
    canvasEl.attr("height", h);

    $("#legende-carte-scale").html(canvasEl);
    
   
    var canvas = document.getElementById('colorscale');
    if (typeof(G_vmlCanvasManager) != 'undefined')
      canvas = G_vmlCanvasManager.initElement(canvas);
    if (!canvas || !canvas.getContext || !canvas.getContext('2d').fillText) {
      $("#legende-carte-scale").html(i18n('nocanvas'));
      return;
    }
    
    var ctx = canvas.getContext('2d'); 
    

    
    ctx.strokeStyle="black";
    ctx.lineWidth = "1";
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.lineWidth = "1";
    
    var txtw;
    var colw;
    if (typeof(G_vmlCanvasManager) != 'undefined') { // flashcanvas ou excanvas...
      txtw = 30;
      colw =  w / (ncolors+1);
    } else {
      txtw = ctx.measureText(Palettes[pal][ncolors-1][0]).width;
      colw =  w / ncolors;
    }
    
     
    var lastTxt=-999;
    var txt_margin = 3;
    
    var cTxtStart;
    if (pal == "PAL_ALTI" || pal == "PAL_CBASE") {
      cTxtStart=1;
    } else {
      cTxtStart=0;
    }
    for (var i=0; i<ncolors; i++) {
      var left = i*colw;
      var r=Palettes[pal][i][1];
      var g=Palettes[pal][i][2];
      var b=Palettes[pal][i][3];
      var a=Palettes[pal][i][4]/255;
      ctx.beginPath();
      ctx.rect(left, 0, colw, colh);
      ctx.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
      ctx.fill();
      ctx.stroke();
      
      left_txt=left+txt_margin;
      if (pal == "PAL_WIND") {
	txt = Math.round(Palettes[pal][i][0]*3.6);
      } else if ( (pal == "PAL_ALTI" || pal == "PAL_CBASE") && i==1) {
	txt = 0;
      } else {
	txt = Palettes[pal][i][0];
      }
      if (lastTxt < left_txt && i >= cTxtStart ) {
	ctx.beginPath();
	ctx.moveTo(left, colh);
	ctx.lineTo(left, colh+6);
	ctx.stroke();
	ctx.fillStyle = "black";
	ctx.fillText(txt, left_txt, 45);
	lastTxt=left_txt+txtw;
      }
    }
    ctx.fillStyle = "black";
    ctx.fillText("+", w-10, 45);
    var unit;
    switch (pal) {
      case "PAL_ALTI":
	if (UI.Params.param == "pblh") {
	  unit=i18n("metres")+"<br>/ "+i18n("sol");
	} else {
	  unit=i18n("metres")+"<br>/ "+i18n("mer"); 
	}
	break;
      case "PAL_WIND":
	unit="km/h";
	break;
      case "PAL_THERMIQUES":
	unit="m/s";
	break;
      case "PAL_CFRAC":
	unit="%";
	break;
      case "PAL_CAPE":
	unit="J/kg";
	break;
      case "PAL_CONVERGENCE":
	unit="cm/s";
	break;
      case "PAL_CBASE":
	unit=i18n("metres")+"<br>/ "+i18n("mer"); 
	break;
      case "PAL_RAIN":
	unit="mm<br>/hour";
	break;
      default:
	unit=i18n("sans_unite");
    }
    $("#legende-carte-unit").html(unit);
    
  };
  
  this.recherche = function (str) {
    if (str == "") return;
    
    $("#popup-txt").empty();
    $("#popup-load").show();
    $("#popup").fadeIn("fast");

    $.ajax({
      url: "http://data3.rasp-france.org/lieux.php",
      dataType: "jsonp",
      data: {q: str},
      success: function (data) {
	if (!data.status || data.status != "ok") {
	  $("#popup-load").hide();
	  $("#popup-txt").html(i18n("erreur_produite")+" :<br>"+data.message);
	  return;
	}
	
	var html = "<h3>"+i18n("recherche")+" : <i>"+data.q+"</i></h3>";
	html += '<p style="color: red;font-size: small;">'+i18n("recherche_que_france")+'</p>';
	
	html += "<h4>"+i18n("decos_ffvl")+"</h4>";
	if (!data.ffvld) {
	  html += "<p><i>"+i18n("pas_resultats")+"</i></p>";
	} else {
	  for (var i=0; i<data.ffvld.length; i++) {
	    html += '<p><a href="javascript:void(0);" onclick="Carte.rechercheOK('+data.ffvld[i].lat+','+data.ffvld[i].lon+');">'+data.ffvld[i].nom+'</a></p>';
	  }
	}
	
	html += "<h4>"+i18n("atterros_ffvl")+"</h4>";
	if (!data.ffvla) {
	  html += "<p><i>"+i18n("pas_resultats")+"</i></p>";
	} else {
	  for (var i=0; i<data.ffvla.length; i++) {
	    html += '<p><a href="javascript:void(0);" onclick="Carte.rechercheOK('+data.ffvla[i].lat+','+data.ffvla[i].lon+');">'+data.ffvla[i].nom+'</a></p>';
	  }
	}
	
	html += "<h4>"+i18n("aerodromes")+"</h4>";
	if (!data.aero) {
	  html += "<p><i>"+i18n("pas_resultats")+"</i></p>";
	} else {
	  for (var i=0; i<data.aero.length; i++) {
	    html += '<p><a href="javascript:void(0);" onclick="Carte.rechercheOK('+data.aero[i].lat+','+data.aero[i].lon+');">'+data.aero[i].nom+'</a></p>';
	  }
	}
	
	html += "<h4>"+i18n("geographie")+"</h4>";
	if (!data.osm) {
	  html += "<p><i>"+i18n("pas_resultats")+"</i></p>";
	} else {
	  for (var i=0; i<data.osm.length; i++) {
	    html += '<p><a href="javascript:void(0);" onclick="Carte.rechercheOK('+data.osm[i].lat+','+data.osm[i].lon+');">'+data.osm[i].nom+'</a></p>';
	  }
	}
	
	html += "<hr><small><b>"+i18n("source_donnees_rech")+" :</b><br>";
	html += 'FFVL : <a href="http://carte.ffvl.fr/?mode=parapente" target="_blank">http://carte.ffvl.fr/?mode=parapente</a><br>';
	html += i18n("aerodromes") + ' : <a href="http://www.jprendu.fr/aeroweb/" target="_blank">http://www.jprendu.fr/aeroweb/</a><br>';
	html += i18n("geographie") + ' : <a href="http://www.openstreetmap.fr/" target="_blank">OpenStreetMap</a> via <a href="http://developer.mapquest.com/web/products/open/nominatim/" target="_blank">MapQuest Nominatim</a>';
	$("#popup-txt").html(html);
	$("#popup-load").hide();
      }
    });
  };
  
  this.rechercheOK = function (lat, lon) {
    $("#popup").hide();
    UI.Params.lat = lat;
    UI.Params.lon = lon;
    var center = new OpenLayers.LonLat(lon,lat).transform(this.wgs84,this.mercator);
    this.map.setCenter(center, 8);
    this.updateZone();
    UI.refreshDetails();
  };
  
};


var Carte = new CarteObject ();