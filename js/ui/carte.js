//OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;


function CarteObject () {
  
  this.ready = false;
  this.wgs84 = new OpenLayers.Projection("EPSG:4326");
  this.mercator = new OpenLayers.Projection("EPSG:900913");
  this.zone = {};
  
  this.Init = function () {
 
    this.map = new OpenLayers.Map({div: "bloc-carte-carte", allOverlays: true, controls: []});
    var center = new OpenLayers.LonLat(2.5,46.5).transform(this.wgs84,this.mercator);
    
    this.map.addControl(new OpenLayers.Control.Navigation());

    var OSMLayer = new OpenLayers.Layer.OSM("Cartographie OpenStreetMap", "http://tilestream.meteo-parapente.com/RASP_Geolayer_9c3d4e/${z}/${x}/${y}.png");
    //OSMLayer.setOpacity(0.8);

    //var hill = new OpenLayers.Layer.OSM("Relief NASA SRTM3", "/img/blank.png");
    var hill = new OpenLayers.Layer.OSM("Relief NASA SRTM3", "http://toolserver.org/~cmarqu/hill/${z}/${x}/${y}.png");
    //hill.setOpacity(0.7);

    var markers = new OpenLayers.Layer.Markers( "Markers" );
    
    this.map.addLayers([hill, OSMLayer]);
    this.map.setLayerIndex(hill, 1);
    this.map.setLayerIndex(OSMLayer, 2);
    
    this.zone = new OpenLayers.Marker(new OpenLayers.LonLat(0,0)) ;
    markers.addMarker(this.zone);
    this.map.addLayer(markers);
    //this.map.addControl(new OpenLayers.Control.LayerSwitcher());
    
    this.map.setCenter(center, 6);
    
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
    var url="http://wms.meteo-parapente.com/"+UI.Params.run+"/"+UI.Params.date+utc+"0000/"+UI.Params.domain+"/"+UI.Params.param+"/${z}/${x}/${y}";
    UI.Params.noip ? url += "/noip.png" : url += "/tile.png";
    var RASPLayer = new OpenLayers.Layer.OSM("RASP", url);
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
    var pal = whichPalette();
    
    if (!pal) {
       $("#legende-carte-scale").html("<p>Légende manquante pour ce paramètre.</p>");
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
      $("#legende-carte-scale").html('<p>Désolé, votre navigateur ne sait pas afficher la technologie "canvas"</p><p><a href="http://fr.wikipedia.org/wiki/Canvas_(HTML)" target="_blank">http://fr.wikipedia.org/wiki/Canvas_(HTML)</a></p><p>Il faut une version de Internet Explorer >= 9</p>');
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
	  unit="mètres<br>/ sol";
	} else {
	  unit="mètres<br>/ mer"; 
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
	unit="mètres<br>/ mer";
	break;
      default:
	unit="sans<br>unité";
    }
    $("#legende-carte-unit").html(unit);
    
  };
  
  

  
};


var Carte = new CarteObject ();