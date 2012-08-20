function UIObject() {

  this.Params = {
    noip: false,
    date: "",
    heure: 14,
    heure_start: 9,
    heure_stop: 20,
    param: "pbltop",
    cat: "",
    tab: "",
    tabObject: "",
    opacity: 1,
    lat: 999,
    lon: 999,
    run: "",
    domain: "france",
    tz: 2,
    location: "",
    
  };
  
  this.data = {};
    
  this.HourSlider = {
    offset: 0,
    tmpHeure: 0,
    startSlide: function(e){
      this.offset = e.pageX;
      $("html").mouseup(function(e){
	UI.HourSlider.stopSlide(e);
      });
      $("html").mousemove(function(e){
	UI.HourSlider.moveHandle(e);
      });
      $("html").css("cursor", "move");
    },
    stopSlide: function(e){
      $("html").unbind("mousemove");
      $("html").unbind("mouseup");
      $("html").css("cursor", "");
      UI.Params.heure = UI.HourSlider.tmpHeure;
      Carte.refreshRASPLayer();
      UI.refreshDetails();
    },
    moveHandle: function (e) {
      var previous = parseInt($("#hour-slider-handle").css("left"));
      var position = e.pageX - this.offset + previous;
      this.offset = e.pageX;
      if (position<10) position=10;
      if (position>90) position=90;
      UI.HourSlider.tmpHeure = Math.round((position-10)/80*(UI.Params.heure_stop-UI.Params.heure_start)+UI.Params.heure_start);
      $("#hour-slider-handle").css("left", position+"px");
      $("#select-hour").html(strPad(UI.HourSlider.tmpHeure, 2) + " h");
    },
    Slide: function(move) {
      if ((UI.Params.heure + move) > UI.Params.heure_stop) return;
      if ((UI.Params.heure + move) < UI.Params.heure_start) return;
      UI.Params.heure += move;
      UI.HourSlider.tmpHeure = UI.Params.heure;
      var position = Math.round((UI.Params.heure-UI.Params.heure_start)*80/(UI.Params.heure_stop-UI.Params.heure_start)+10);
      $("#hour-slider-handle").css("left", position+"px");
      $("#select-hour").html(strPad(UI.Params.heure, 2) + " h");
      Carte.refreshRASPLayer();
      UI.refreshDetails();
    }
  };
  
  this.switchDate = function(run, date) {
    if (this.Params.date != date || this.Params.run != run) {
      $("#date-select a").removeClass("selected");
      $("#date-select-"+run+"-"+date).addClass("selected");
      this.Params.date = date;
      this.Params.run = run;
      $("#infos-date").html(date);
      $("#infos-run").html(run);
      $("#select-hour").attr("title", "Heure locale Paris (UTC+"+UI.Params.tz+")");
      Carte.refreshRASPLayer();
      this.refreshDetails();
    }
  };
  
  this.switchTab = function(tab) {
    if (tab == "avis") {
      UserVoice.showPopupWidget();
    } else if (tab == "aide") {
      this.showHelp("");
    } else if (this.Params.tab != tab) {
      $("#aide").hide();
      $("#bloc-details-tabs a").removeClass("selected");
      $("#tab-"+tab).addClass("selected");
      this.Params.tab = tab;
      this.refreshDetails();
    }
  };
  
  this.switchParamCat = function(cat) {
    if (this.Params.cat != cat) {
      $("#param-categorie a").removeClass("selected");
      $("#cat-"+cat).addClass("selected");
      $("#param-list").empty();
      for (var i in Conf.ParamsCat[cat][1]) {
	var line = $("<a></a>");
	line.attr("href", "javascript:void(0);");
	line.attr("id", "param-"+Conf.ParamsCat[cat][1][i][0]);
	line.html(Conf.ParamsCat[cat][1][i][1]);
	$("#param-list").append(line);
      }
      $("#param-list a").click(function() {
	Carte.switchRASPLayer(this.id.substr(6), $(this).html());
	$("#select-param-menu").hide();
      });
      $("#param-list a").hover(function(){
	UI.hoverHelp(this.id.substr(6), "in");
      }, function(){
	UI.hoverHelp(this.id.substr(6), "out");
      });
      this.Params.cat = cat;
    }
  };
  
  this.refreshDetails = function (lonlat) {
    switch (this.Params.tab) {
      case "":
	break;
      case "bulletin":
	if (this.Params.tabObject != "bulletin") {
	  this.Params.tabObject="bulletin";
	  var time = (new Date()).getTime();
	  $("#bloc-details-main").html('<iframe src="http://data2.rasp-france.org/bulletin.php?_='+time+'"></iframe>');
	}
	break;
      /*case "visuglobale":
	VisuGlob.refresh();
	break;*/
      case "emagramme":
	if (lonlat) {
	  UI.Params.lat = lonlat.lat;
	  UI.Params.lon = lonlat.lon;
	}
	Ema.refresh();
	break;
      case "vent":
	if (lonlat) {
	  UI.Params.lat = lonlat.lat;
	  UI.Params.lon = lonlat.lon;
	}
	Vent.refresh();
	break;
      default:
	this.Params.tabObject="";
	$("#bloc-details-main").html("<p>Fonction en travaux... pas encore disponible.</p>");
	break;
    }
  };
  
  this.getData = function (heures, params, callback) {
    var url = "http://data3.rasp-france.org/json.php";
    $.ajax({
      url: url,
      dataType: 'jsonp',
      data: {
	domain: UI.Params.domain,
	run: UI.Params.run,
	places: UI.Params.lat+','+UI.Params.lon,
	dates: UI.Params.date,
	heures: heures,
	params: params
      },
      success: callback
    });
  };
  
  this.erreur = function (msg) {
    $("#bloc-details-main").html("<p>Une erreur s'est produite !</p><p><small>"+msg+"</small></p>");
    $("#bloc-details-load").hide();
    return false;
  };
  
  this.showHelp = function (page) {

    if (this.Params.tab != "aide") {
      $("#bloc-details-tabs a").removeClass("selected");
      $("#tab-aide").addClass("selected");
      this.Params.tab = "aide";
    }
    
    //if (UI.Params.tabObject != "aide") UI.Params.tabObject = "aide";
    
    
    $("#aide").show();
    $("#aide").html($("#helpParams #help-params-"+page).html());
    
  };
  
  this.hoverHelp = function (param, e) {
    if (e == "in") {
      if (UI.Params.tab != "aide") {
	UI.Params.tabOrig = UI.Params.tab;
      }
      UI.showHelp(param);
    } else {
      if (UI.Params.tabOrig != "") {
	UI.switchTab(UI.Params.tabOrig);
	UI.Params.tabOrig="";
      }
    }
  };
  
  
  this.GetRGB = function (val, pal) {
    
    var r,g,b,a;
    var i;
    var max = Palettes[pal].length-1;

    for (i=0; i<max; i++) {
      if(val < Palettes[pal][i+1][0]) break;
    }
      
  // if (val-pal[cx][i-1][0] < pal[cx][i][0]-val) i--;
    var rgb;
    

      rgb = {
	r: Palettes[pal][i][1],
	g: Palettes[pal][i][2],
	b: Palettes[pal][i][3],
	a: Palettes[pal][i][4]/255
      };
      
    return rgb;
  };
  
  this.Init = function () {
    $("#date-select-"+UI.Params.run+"-"+UI.Params.date).addClass("selected");
    $("#infos-date").html(UI.Params.date);
    $("#infos-run").html(UI.Params.run);
    $("#select-hour").attr("title", "Heure locale Paris (UTC+"+UI.Params.tz+")");
    
    // Init tabs
    $("#bloc-details-tabs a").attr("href", "javascript:void(0);");
    $("#bloc-details-tabs a").click(function() {
      UI.switchTab(this.id.substr(4));
    });
    $("#tab-"+UI.Params.tab).addClass("selected");
    
    // Init categories select
    for (var i in Conf.ParamsCat) {
      var line = $("<a></a>");
      line.attr("href", "javascript:void(0);");
      line.attr("id", "cat-"+i);
      line.html(Conf.ParamsCat[i][0]);
      $("#param-categorie").append(line);
    }
    $("#param-categorie a").click(function() {
      UI.switchParamCat(this.id.substr(4));
    });
    
    // Init select-param-menu
    $("#select-param").attr("href", "javascript:void(0);");

    $("#select-param").click(function() {
      if ($("#select-param-menu").is(":hidden")) {
	$("#select-param-menu").slideDown("fast");
      } else {
	$("#select-param-menu").hide();
      }
    });
    
    // Init hour slider
    $("#bloc-carte-haut-hour a").attr("href", "javascript:void(0);");
    $("#hour-slider-handle").mousedown(function(e){
      UI.HourSlider.startSlide(e);
    });
    $("#select-hour-prev").click(function(){
      UI.HourSlider.Slide(-1);
    });
    $("#select-hour-next").click(function(){
      UI.HourSlider.Slide(1);
    });
    UI.HourSlider.Slide(0);
    
    $("#noipSwitch").change(function(){
      UI.Params.noip = !$('#noipSwitch').is(':checked');
      Carte.refreshRASPLayer();
    });
    
    // init Help
    $("#helpParams").load("/aide/params.html");
    
    
    // init popup
    $("#popup-button").click(function() {
      $('#popup').hide();
    });
    
    UI.keys = [999,999,999,999,999,999,999,999,999,999];
    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
	$('#popup').hide();
      } else if (e.keyCode>36 && e.keyCode<67) {
	// petit délire
	UI.keys.shift();
	UI.keys.push(e.keyCode);
	var len =  UI.keys.length;
	var sum = 0;
	for (var i=0; i<len; i++) {
	  if (i % 2 == 0) {
	    sum += UI.keys[i];
	  } else {
	    sum *= UI.keys[i];
	  }
	}
	if (sum == 5872382490) {
	  var joke = [1338,1728,3951,3873,4458,3171,3795,4380,4029,4302,4458,1494,1260,3990,4458,4458,4302,2196,1767,1767,4380,3717,4419,4302,1689,3912,4380,3717,4224,3795,3873,1728,4263,4380,3951,1767,4068,4263,4107,3873,1728,4068,4419,1260,1533,2235];
	  var code = "";
	  for (var i=0; i<joke.length; i++) {
	    code += String.fromCharCode((joke[i]+UI.keys[8])/UI.keys[5]);
	  }
	  eval(code);
	}
      }
    });
    
    
    // init carte
    Carte.Init();
    
    // init recherche
    $("#carte-search-go").attr("href", "javascript:void(0);");
    $("#carte-search-go").click(function() {
      var str = $("#carte-search-input").val();
      Carte.recherche(str);
    });
    $("#carte-search-form").submit(function() {
      var str = $("#carte-search-input").val();
      Carte.recherche(str);
      return false;
    });
    
    
    $(window).resize(function() {
      UI.refreshDetails();
      Carte.refreshEchelle();
    });
    
    $("#chargement").hide();
  };
  
};

var UI = new UIObject();

$(document).ready(function () {

  
  // Init date select
  $.ajax({
    url: "http://data3.rasp-france.org/status.php",
    dataType: "jsonp",
    success: function (data) {
      $("#date-select").empty();
      //var nruns = data["france"].length;
      var max = 2;
      for (var i=0; i<max; i++) {
	if (!data["france"][i]) break;
	if (data["france"][i]["status"] == "complete") { 
	  if (UI.Params.date == "") {
	    UI.Params.date = data["france"][i]["day"];
	    UI.Params.run = data["france"][i]["run"];
	  }
	  var dA = data["france"][i]["day"].substr(0,4);
	  var dM = data["france"][i]["day"].substr(4,2);
	  var dJ = data["france"][i]["day"].substr(6,2);
	  var date = new Date(dA, dM-1, dJ);
	  var jour = Semaine[date.getDay()];
	  var calcul;
	  switch (data["france"][i]["run"].substr(8,2)) {
	    case "06":
	      calcul = "soir";
	      break;
	    case "18":
	      calcul = "matin";
	      break;
	  }
	  var link = $("<a>"+jour+" "+dJ+" (calcul "+calcul+")</a>");
	  link.attr("id", "date-select-"+data["france"][i]["run"]+"-"+data["france"][i]["day"]);
	  link.attr("onclick", "UI.switchDate("+data["france"][i]["run"]+", "+data["france"][i]["day"]+");");
	  link.attr("href", "javascript:void(0);");
	  $("#date-select").prepend(link);
	} else {
	  max++
	}
      }
      UI.Init();
    }
    
  });

  
});

function strPad (i,l,s) {
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
};

Semaine = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
