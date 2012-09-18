function ConfigObject () {
  
  this.Start = {
    
  };
  
  
  this.ParamsCat = {
    therms: [i18n("thermiques"), [["wstar", i18n("wstar_label")],["bsratio",i18n("bsratio_label")]]],
    vent: [i18n("vent"), [/*["windsfc", i18n("windsfc_label")]*/,["windblavg", i18n("windblavg_label")],["windbltop", i18n("windbltop_label")],["blwindshear",i18n("blwindshear_label")],["wblmaxmin",i18n("wblmaxmin_label")],/*["wind1000","1000m Wind"],["wind2000","2000m Wind"],["wind3000","3000m Wind"],["wind4000","4000m Wind"]*/]],
    conv: [i18n("couche_conv"), [["pblh", i18n("pblh_label")],["pbltop", i18n("pbltop_label")]]],
    //developpement: ["Développement", [["zsfclclmask", "Base Cumulus"], ["zblclmask", "Base Surdéveloppement"]]],
    nuages: [i18n("nebulosite"), [["cfrach", i18n("cfrach_label")], ["cfracm", i18n("cfracm_label")],["cfracl", i18n("cfracl_label")]]],
    //rain: [i18n("rain"), [["raintot", i18n("raintot_label")]]],
    autre: [i18n("divers"), [["tc2", i18n("tc2_label")],["ter", i18n("ter_label")]]],
    //experimental: ["experiments", [["wsfc10", "slope wind updraft @10m"],["wsfc30", "slope wind updraft @30m"]]]
  };

}

var Conf = new ConfigObject ();