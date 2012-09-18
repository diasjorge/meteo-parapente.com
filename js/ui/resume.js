function ResumeObject () {
  
  this.box = {
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
    
    this.nh = (UI.Params.heure_stop - UI.Params.heure_start)+1;
    this.box.top  = 30;
    this.box.left  = 40;
    this.box.bottom = 20;
    this.box.h = this.h-this.box.top-this.box.bottom;
    this.colw = (this.w-this.box.left) /this.nh;    
    this.box.w = this.colw*this.nh;
    this.kmOffset = this.box.h/6000;

    
    // Terrain
    var ter = this.kmOffset*UI.data[UI.Params.heure_start-UI.Params.tz]["ter"];
    this.c.beginPath();
    this.c.rect(this.box.left, this.box.top+this.box.h, this.box.w, -ter);
    this.c.fillStyle = "#ccc";
    this.c.fill();
    
     // Température
    var alty = new Array();
    for (var iz=0; iz<this.nZ; iz++) {
      var alti = UI.data[UI.Params.heure_start-UI.Params.tz]["z"][iz];
      if (alti > 6000) break;
      alty[iz] = this.box.top+this.box.h-this.kmOffset*alti;
    }
    for (var icol=0; icol<this.nh; icol++) {
      var heure = UI.Params.heure_start+icol;
      var heurez = heure-UI.Params.tz;
      var left = this.box.left+this.colw*icol;
      
      for (var iz=0; iz<this.nZ; iz++) {
	if (alty[iz] < 0) break;
	
	var dz = UI.data[heurez]["z"][iz+1]-UI.data[heurez]["z"][iz];
	var dtc = UI.data[heurez]["tc"][iz+1]-UI.data[heurez]["tc"][iz];
	
	var instab = dtc/dz;
	/*console.log(UI.data[heurez]["z"][iz]);
	console.log(UI.data[heurez]["z"][iz+1]);
	console.log(dz);
	console.log(dtc);*/
	console.log(instab);

	var rgb = UI.GetRGB(-instab*400000, "PAL_ALTI");
	this.c.beginPath();
	this.c.rect(left, alty[iz], this.colw, alty[iz+1]-alty[iz]);
	this.c.fillStyle = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",1)";
	this.c.fill();
      }

      this.c.font = "14px Arial";
      this.c.textAlign = "center";
      var heuretxt = heure + "h";
      var milieu = left+this.colw/2;
      this.c.fillText(heuretxt, milieu, this.h);
    }
    
    // couche convective
    for (var icol=0; icol<this.nh; icol++) {
      var heure = UI.Params.heure_start+icol-UI.Params.tz;
      var pblh = UI.data[heure]["pblh"]*this.kmOffset;
      var left = this.box.left+this.colw*icol;
      this.c.beginPath();
      this.c.rect(left, this.box.top+this.box.h-ter-pblh, this.colw, -2);
      this.c.fillStyle = "black";
      this.c.fill();
    }
    
    // colonnes
    this.c.strokeStyle="#ddd";
    var max = this.nh+1;
    for (var icol=0; icol<max; icol++) {
      var left = this.box.left+this.colw*icol;
      var milieu = left+this.colw/2;
      
      this.c.beginPath();
      this.c.moveTo(left, this.box.top);
      this.c.lineTo(left, this.box.h+this.box.top+this.box.bottom);
      this.c.lineWidth=2;
      this.c.stroke();
    }
    
    // legende alti
    
    var alti_left = this.box.left-5;
    
    this.c.font = "14px Arial";
    this.c.fillStyle = "black";
    this.c.textAlign = "right";
        
    for (var i=0; i<12 ;i++) {
      var alti = 500*i;
      var alti_top = this.box.top+this.box.h-this.kmOffset*alti;
      this.c.fillText(alti, alti_left, alti_top);
    }
    this.c.fillText("Alti", alti_left, this.box.top+10);
    this.c.fillText("(m)", alti_left, this.box.top+25);
    
    /*// vent
    this.c.fillStyle = "black";
    for (var icol=0; icol<this.nh; icol++) {
      var last = this.h;
      var heure = UI.Params.heure_start+icol;
      var heurez = heure-UI.Params.tz;
      this.c.font = "10px Arial";
      this.c.textAlign = "left";
      for (var iz=0; iz<this.nZ; iz++) {
	var alti = UI.data[UI.Params.heure_start-UI.Params.tz]["z"][iz];
	if (alti > 6000) break;
	var alti_top = this.box.top+this.box.h-this.kmOffset*alti;
	if (last-alti_top < 10) continue;
	last = alti_top;
	var left = this.box.left+this.colw*icol;
	var milieu = left+this.colw/2;
	var u = UI.data[heurez]["umet"][iz];
	var v = UI.data[heurez]["vmet"][iz];
	var ms = Math.sqrt(u*u+v*v);
	var kmh = Math.round(ms*3.6);
	this.c.fillText(kmh, milieu+4, alti_top);
	var w = 4/30*kmh;
	var rgb = UI.GetRGB(ms, "PAL_WIND");
	if (w>0) {
	  this.fleche({
	      x: milieu-3,
	      y: alti_top,
	      a: Math.atan2(u, v)+Math.PI,
	      s: 10,
	      w: w,
	      color: "rgba("+rgb.r+","+rgb.g+","+rgb.b+",1)"
	  }); 
	} else {
	  this.c.beginPath();
	  this.c.arc(milieu-3, alti_top-4, 1, 0, 2 * Math.PI, true);
	  this.c.fill();
	}
	
      }
      
      this.c.font = "14px Arial";
      this.c.textAlign = "center";
      var heuretxt = heure + "h";
      this.c.fillText(heuretxt, milieu, this.h);
    }*/
    
        
    // titre
    this.c.font = "14px Arial";
    this.c.fillStyle = "black";
    this.c.textAlign = "left";
    var titre = UI.Params.location + " - " + UI.Params.date + " - km/h - UTC+"+UI.Params.tz;
    this.c.fillText(titre, this.box.left, 14);
    

    $("#bloc-details-load").hide();
  };
 
  /*this.fleche = function (f) {
    this.c.save();
    this.c.translate(f.x-f.s/2, f.y-f.s/2);
    this.c.rotate(f.a);
    this.c.beginPath();
    this.c.moveTo(0,-f.s);
    this.c.lineTo(0,0.3*f.s);
    this.c.moveTo(-0.3*f.s,-0.2*f.s);
    this.c.lineTo(0,0.3*f.s);
    this.c.lineTo(0.3*f.s,-0.2*f.s);
    this.c.lineWidth=f.w+1;
    this.c.strokeStyle="black";
    this.c.stroke();
    this.c.beginPath();
    this.c.moveTo(0,-f.s);
    this.c.lineTo(0,0.3*f.s);
    this.c.moveTo(-0.3*f.s,-0.2*f.s);
    this.c.lineTo(0,0.3*f.s);
    this.c.lineTo(0.3*f.s,-0.2*f.s);
    this.c.lineWidth=f.w;
    this.c.strokeStyle=f.color;
    this.c.stroke();
    this.c.restore();
  };*/

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
    
    if (this.lat != UI.Params.lat || this.lon != UI.Params.lon || this.run != UI.Params.run || this.date != UI.Params.date  || UI.Params.tabObject != "resume") {
      newData = newDessin = true;
    }
    
    if (this.w != w || this.h != h) {
      newDessin = true;
    }
    
    if (newDessin) {
      $("#bloc-details-load").show();
      //$("#bloc-details-main").empty();
      UI.Params.tabObject = "resume";
      this.lat = UI.Params.lat;
      this.lon = UI.Params.lon;
      this.w = w;
      this.h = h;
      this.date = UI.Params.date;
      this.run = UI.Params.run;
      if (newData) {
	Resume.getNewData();
      } else {
	Resume.draw();
      }
    }
  };
  
  this.getNewData = function() {
    var params = "z;tc;ter;pblh";
    var heures ="";
    
    var hmax = UI.Params.heure_stop+1;
    for (var h=UI.Params.heure_start; h<hmax; h++) {
      utc = h-UI.Params.tz;
      heures += utc + ";";
    }
    UI.getData(heures, params, function(data, textStatus, jqxhr) {
      if (jqxhr.status != 200) return UI.erreur(jqxhr.status+" : "+textStatus);
      if (!data) return UI.erreur(i18n("chargement_echoue"));
      if (data.status != "ok") return UI.erreur(i18n("chargement_echoue")+"<br>"+data.status+" : "+data.message);
      UI.Params.location = data[Resume.lat+','+Resume.lon]["gridCoords"]["location"];
      UI.data = data[Resume.lat+','+Resume.lon][UI.Params.date];
      UI.Params.lat = data[Resume.lat+','+Resume.lon]["gridCoords"]["lat"];
      UI.Params.lon = data[Resume.lat+','+Resume.lon]["gridCoords"]["lon"];
      Resume.nZ = UI.data[UI.Params.heure_start-UI.Params.tz]["z"].length;
      Resume.lat = UI.Params.lat;
      Resume.lon = UI.Params.lon;
      Carte.updateZone();
      Resume.draw();
    });
  };
  

  
};

var Resume = new ResumeObject();