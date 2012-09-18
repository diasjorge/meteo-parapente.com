function EmagrammeObject () {
  
  this.ema = {
    top: 0,
    left: 0,
    h: 0,
    w: 0,
    bottom: 0
  };
  
  this.c = 0;
  this.w=0;
  this.h=0;
  this.date="";
  this.heure=0;
  this.lat=999;
  this.lon=999;
  this.nZ=0;
  
  this.draw = function () {
    
    var canvasEl = $("<canvas id=\"visu\"></canvas>");
    canvasEl.attr("width", this.w);
    canvasEl.attr("height", this.h);

    $("#bloc-details-main").html(canvasEl);
    
   
    var canvas = document.getElementById('visu');
    if (typeof(G_vmlCanvasManager) != 'undefined')
      canvas = G_vmlCanvasManager.initElement(canvas);
    if (!canvas || !canvas.getContext || !canvas.getContext('2d').fillText) {
      $("#bloc-details-main").html(i18n('nocanvas'));
      return;
    }
    
    this.c = canvas.getContext('2d'); 
    
    
    
    // emagramme
    
    this.ema.top  = 20;
    this.ema.left  = 40;
    this.ema.bottom = 20;
    this.ema.h = this.h-this.ema.top-this.ema.bottom;
    this.ema.w = this.w-this.ema.left;
    this.c.drawSvg("test-ema.svg", this.ema.left, this.ema.top, this.ema.w, this.ema.h);
    
    // titre
    this.c.font = "14px Arial";
    this.c.fillStyle = "black";
    this.c.textAlign = "left";
    titre = UI.Params.location + " - " + UI.Params.date + " - " + UI.Params.heure + "h00 UTC+"+UI.Params.tz;
    this.c.fillText(titre, this.ema.left, 14);
    
    // legende press
    
    var press_loc = [150, 200, 250, 300, 400, 500, 700, 850, 1000];
    var press_left = this.ema.left-5;

    this.c.font = "14px Arial";
    this.c.fillStyle = "black";
    this.c.textAlign = "right";
    
    for (var i=0; i<9; i++) {
      var press_top = this.pressToHeight(press_loc[i])+4;
      this.c.fillText(press_loc[i], press_left, press_top);
    }
    
    this.c.fillText("Press", press_left, this.ema.top+10);
    this.c.fillText("(hPa)", press_left, this.ema.top+25);
    
    
    
    // legende temp
    
    var temp_top = this.h-this.ema.bottom+17;

    this.c.font = "14px Arial";
    this.c.fillStyle = "black";
    this.c.textAlign = "center";
    
    for (var i=0; i<7; i++) {
      var temp = i*10-30;
      var left = this.ema.left + this.ema.w*0.035 + i*0.117*this.ema.w;
      this.c.fillText(temp, left, temp_top);
    }
    
    //this.c.fillText("Press", press_left, this.ema.top+10);
    //this.c.fillText("(hPa)", press_left, this.ema.top+25);
    
    
    
    // temp
    // tc
    this.c.fillStyle = "black";
    for (var i=0; i<this.nZ; i++) {
      this.plotTemp(UI.data.p[i], UI.data.tc[i]);
    }
    // td
    this.c.fillStyle = "blue";
    for (var i=0; i<this.nZ; i++) {
      this.plotTemp(UI.data.p[i], UI.data.td[i]);
    }
    
    
    
    /*
    this.c.fillStyle = "navy";
    for (var i=0; i<101; i++) {
      var temp = 20*Math.cos(i/11+Math.random()*3);
      this.plotTemp(i*10, temp);
    }*/
    
    $("#bloc-details-load").hide();
  };
 
  this.pressToHeight = function (press) {
    return this.ema.top+(0.425*Math.log(press)-1.9569)*this.ema.h;
  };
  
  this.plotTemp = function (press, temp) {
    if (press > 100) {
      var press_top = this.pressToHeight(press);
      var temp_offset = temp * 0.01165;
      var slope = Math.log(press)*-this.ema.w/2.663;
      var offset = this.ema.left + (3.0061+temp_offset)*this.ema.w;
      var x = slope + offset;
      this.c.beginPath();
      this.c.arc(x, press_top, 2, 0, 2 * Math.PI, true);
      this.c.fill();
    }
  };
  
  this.refresh = function () {
    
    var w = $("#bloc-details-main").width();
    var h = $("#bloc-details-main").height();

    if (UI.Params.lat == 999 || UI.Params.lon == 999) {
      $("#bloc-details-main").html("<p>"+i18n("click_a_point")+"</p>");
      UI.Params.tabObject = "";
      return;
    }
    
    var newDessin = false;
    var newData = false;
    
    if (this.lat != UI.Params.lat || this.lon != UI.Params.lon || this.date != UI.Params.date || this.run != UI.Params.run || this.heure != UI.Params.heure  || UI.Params.tabObject != "emagramme") {
      newData = newDessin = true;
    }
    
    if (this.w != w || this.h != h) {
      newDessin = true;
    }
    
    if (newDessin) {
      $("#bloc-details-load").show();
      //$("#bloc-details-main").empty();
      UI.Params.tabObject = "emagramme";
      this.lat = UI.Params.lat;
      this.lon = UI.Params.lon;
      this.w = w;
      this.h = h;
      this.date = UI.Params.date;
      this.heure = UI.Params.heure;
      this.run = UI.Params.run;
      if (newData) {
	Ema.getNewData();
      } else {
	Ema.draw();
      }
    }
  };
  
  this.getNewData = function() {
    var params = "tc;td;z;ter;umet;vmet;p";
    var heures = UI.Params.heure-UI.Params.tz;
    
    UI.getData(heures, params, function(data, textStatus, jqxhr) {
      if (jqxhr.status != 200) return UI.erreur(jqxhr.status+" : "+textStatus);
      if (!data) return UI.erreur(i18n("chargement_echoue"));
      if (data.status != "ok") return UI.erreur(i18n("chargement_echoue")+"<br>"+data.status+" : "+data.message);
      UI.Params.location = data[Ema.lat+','+Ema.lon]["gridCoords"]["location"];
      UI.data = data[Ema.lat+','+Ema.lon][UI.Params.date][UI.Params.heure-UI.Params.tz];
      UI.Params.lat = data[Ema.lat+','+Ema.lon]["gridCoords"]["lat"];
      UI.Params.lon = data[Ema.lat+','+Ema.lon]["gridCoords"]["lon"];
      Ema.nZ = UI.data.p.length;
      Ema.lat = UI.Params.lat;
      Ema.lon = UI.Params.lon;
      Carte.updateZone();
      Ema.draw();
    });
  };
  
};

var Ema = new EmagrammeObject();