function VisuGlobaleObject () {
  
  this.date = "";
  this.w = 0;
  this.h = 0;
  this.lat=999;
  this.lon=999;
  
  this.draw = function () {
    
    var canvasEl = $("<canvas id=\"visu\" width></canvas>");
    canvasEl.attr("width", this.w);
    canvasEl.attr("height", this.h);

    $("#bloc-details-main").html(canvasEl);
    
   
    var canvas = document.getElementById('visu');
    if (typeof(G_vmlCanvasManager) != 'undefined')
      canvas = G_vmlCanvasManager.initElement(canvas);
    if (!canvas || !canvas.getContext || !canvas.getContext('2d').fillText) {
      $("#bloc-details-main").html('Votre navigateur ne sait pas afficher la technologie "canvas"');
      return;
    }
    
    var ctx = canvas.getContext('2d'); 
    
   // ctx.fillStyle = "rgb(255, 240, 240)";
   // ctx.fillRect(0, 0, this.w, this.h);
    
    this.nh = (UI.Params.heure_stop - UI.Params.heure_start)+1;
    this.colw = Math.floor(this.w /this.nh);
    
    for (var icol=0; icol<this.nh; icol++) {
      var left = this.colw*icol;
      var milieu = left+this.colw/2;
      

      
      // soleil

      var sol_height = 30;
      var sol_top = 15;
      var sol_ray = 10;
      
      ctx.fillStyle = "rgb(206, 246, 245)";
      ctx.fillRect(left, 0, this.colw, sol_height);
      
      ctx.beginPath();
      ctx.arc(milieu, sol_top, sol_ray, 0, Math.PI*2, true); 
      ctx.closePath();
      ctx.fillStyle = "rgb(255, 255, 0)";
      ctx.fill();
      
      var clouds_high = Math.random();
      var ch = sol_height/3;
      ctx.fillStyle = "rgba(120, 120, 120, "+clouds_high+")";
      ctx.fillRect(left, 0, this.colw, ch);
      var clouds_med = Math.random();
      ctx.fillStyle = "rgba(120, 120, 120, "+clouds_med+")";
      ctx.fillRect(left, ch, this.colw, ch);
      var clouds_low = Math.random();
      ctx.fillStyle = "rgba(120, 120, 120, "+clouds_high+")";
      ctx.fillRect(left, ch*2, this.colw, ch);
      
      // heure
      var heure_bottom = this.h-10;
      var heure = UI.Params.heure_start + icol;
      var heure_txt = heure + "h";
      
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(heure_txt, milieu, heure_bottom);
      
      // thermiques scale
      var therms_bottom = this.h-30;
      var therms = Math.round(Math.random()*4);
      var therms_txt = "+"+therms;
      
      ctx.font = "bold 15px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(therms_txt, milieu, therms_bottom);
      
      // instabilité
      var graph_top = sol_height+5;
      var graph_bottom = therms_bottom-20;
      var graph_height = graph_bottom - graph_top;
      
      var nlevels = 50;
      var lvlh = Math.floor(graph_height / nlevels);
      
      graph_height = lvlh * nlevels;
      
      for (var ilvl=0; ilvl<nlevels; ilvl++) {
	var top = graph_top + ilvl * lvlh;
	
	ctx.fillStyle = "rgb(200, "+ilvl*5+", "+Math.floor(Math.random()*200)+")";
        ctx.fillRect(left, top, this.colw, lvlh);
	
      }
      
      
      // developpement
      
      var cum_base = Math.round(Math.random()*100+200);
      var cum_odh = Math.round(Math.random()*100+100);
      var cum_ray = this.colw/2.5;
      
      var cum_offset = 15;
      var cum_bottom = graph_top + graph_height - cum_base +cum_ray;
      var cum_nplots = Math.round(cum_odh / cum_offset);
      
      for (var i=cum_nplots-1; i>=0; i--) {
	var top = cum_bottom - i*cum_offset;
	
	ctx.beginPath();
	ctx.arc(milieu, top, cum_ray, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fillStyle = "#ddd";
	ctx.strokeStyle="#999";
	ctx.lineWidth=1;
	ctx.fill();
	ctx.stroke();
      }
      

      // plaf
      var plaf_top = graph_top + graph_height-(graph_height/3) * Math.random();
            
      ctx.beginPath();
      ctx.moveTo(left, plaf_top+5);
      ctx.lineTo(left+this.colw/3, plaf_top+0);
      ctx.lineTo(left+this.colw/3*2, plaf_top+0);
      ctx.lineTo(left+this.colw/3*3, plaf_top+5);
      ctx.closePath();
      ctx.strokeStyle="white";
      ctx.stroke();
      ctx.fillStyle = "navy";
      ctx.fill();
      
      
      // colonnes
      ctx.beginPath();
      ctx.moveTo(left, 0);
      ctx.lineTo(left, this.h);
      ctx.lineWidth=2;
      ctx.strokeStyle="white";
      ctx.stroke();
    }
    
  };
  
  this.refresh = function () {
        
    var w = $("#bloc-details-main").width();
    var h = $("#bloc-details-main").height();
    
    if (UI.Params.lat == 999 || UI.Params.lon == 999) {
      $("#bloc-details-main").html("<p>Pour afficher le détail, cliquez d'abord un point sur la carte.</p>");
      return;
    }
    
    if (this.lat != UI.Params.lat || this.lon != UI.Params.lon || this.w != w || this.h != h || this.date != UI.Params.date || UI.Params.tabObject != "visuglobale") {
      UI.Params.tabObject = "visuglobale";
      this.lat = UI.Params.lat;
      this.lon = UI.Params.lon;
      this.w = w;
      this.h = h;
      this.date = UI.Params.date;
      VisuGlob.draw();
    }
  };
  
};

var VisuGlob = new VisuGlobaleObject();