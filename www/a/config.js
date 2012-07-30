function ConfigObject () {
  
  this.Start = {
    
  };
  
  
  this.ParamsCat = {
    therms: ["Thermiques", [["wstar", "Vitesse Moyenne Thermiques"],["bsratio","Flotabilité/Cisaillement"]]],
    vent: ["Vent", [["windblavg", "Moyenne Vent Couche Conv."],["windbltop", "Vent Sommet Couche Conv"],["blwindshear","Cisaillement"],["wblmaxmin","Convergence"]]],
    conv: ["Couche Conv", [["pblh", "Epaisseur Couche Convective"],["pbltop", "Altitude Plafond Couche Conv"]]],
    //developpement: ["Développement", [["zsfclclmask", "Base Cumulus"], ["zblclmask", "Base Surdéveloppement"]]],
    nuages: ["Nébulosité", [["cfrach", "Couverture Haute"], ["cfracm", "Couverture Moyenne"],["cfracl", "Couverture Basse"]]],
    autre: ["Divers", [["tc2", "Température à 2m"],["ter", "Topographie modèle"]]]
  };

}

var Conf = new ConfigObject ();