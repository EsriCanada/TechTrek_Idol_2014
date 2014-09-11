//Martin Couture publiccouture@icloud.com
//Août 2014 /August 2014
//Permet de calculer le lever et coucher du soleil selon le fuseau horaire, la latitude et la longitude.
//La déclaration se fait par le constructor, voir exemple plus bas.
//Calculate the sunrise and sunset, you need to begins with the constructor, see example below.
// 
//<script>
//require({
//	baseUrl: "/dojomodule/",
//    packages: [
//	 { name: "dojo", location: "//ajax.googleapis.com/ajax/libs/dojo/1.9.3/dojo" },
//	 { name: "digit", location: "//ajax.googleapis.com/ajax/libs/dojo/1.9.3/digit" },
//     { name: "js", location: "js" } 
//	 ]
//	 }, ["js/sunsetsunrise"], function(Ville){
//  var Qc = new Ville("Quebec", 46.845, 71.335, -4, 12, 08, 2014);
//  console.log(Qc.latitude);
//  console.log(Qc.Lever());
//  console.log(Qc.Coucher());
//  
//  Qc.latitude = 50;
//  console.log(Qc.latitude);
//  console.log(Qc.Lever());
//  console.log(Qc.Coucher());
//});
//</script>
//Translated words
//Attributes : Decalage => Timezone, Jour => Day, mois => Month, an => Year
//Functions : 

define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/domReady!"], function(declare){
  return declare("mcouture.Ephemerides",null, {
    constructor: function(latitude, longitude, Decalage, jour, mois, an){
	  this.latitude = latitude;
      this.longitude = longitude;
      this.Decalage = Decalage;
	  this.jour = jour;
	  this.mois = mois;
	  this.an = an;
    },
	
	
//Calcule du lever et coucher du soleil
//Calcule du rang du jour dans l'année
JourDeAnnee : function()
	{
	N1 = Math.floor((this.mois*275)/9);
	N2 = Math.floor((this.mois+9)/12);
	
	K = 1 + Math.floor((this.an-4 * Math.floor(this.an/4)+2)/3);
				
	RangDuJour = N1-N2*K+this.jour-30;
	return RangDuJour; 
	},//virgule entre chaque fonction

_ValeurM : function ()
	{
	M = (357+0.9856* this.JourDeAnnee())%360
	return M
	}, //virgule entre chaque fonction

_ValeurC : function ()
	{
	C = 1.914*Math.sin(Math.PI/180*this._ValeurM())+0.02*Math.sin(Math.PI/180*2*this._ValeurM())
	return C
	},//virgule entre chaque fonction

_ValeurL : function ()
	{
	L = 280+this._ValeurC()+0.9856*this.JourDeAnnee() % 360
	return L
	},//virgule entre chaque fonction

_ValeurR : function ()
	{
	R = -2.466*Math.sin(Math.PI/180*2*this._ValeurL())+0.053*Math.sin(Math.PI/180*4*this._ValeurL())
	return R
	},//virgule entre chaque fonction

_Declinaison : function ()
	{
	Dec = Math.asin(0.3978*Math.sin(Math.PI/180*this._ValeurL()))*180/Math.PI
	return Dec
	},//virgule entre chaque fonction

_AngleHoraire : function ()
	{
	HO = Math.acos((-0.01454-Math.sin(Math.PI/180*this._Declinaison())*Math.sin(Math.PI/180*this.latitude))/(Math.cos(Math.PI/180*this._Declinaison())*Math.cos(Math.PI/180*this.latitude)))*180/Math.PI
	return HO
	},//virgule entre chaque fonction

_AngleHoraireHeure : function()
	{
	return this._AngleHoraire()/15
	},//virgule entre chaque fonction

_EquationTempsMinuteDEC : function ()
	{
	ETMD = (this._ValeurC() + this._ValeurR())*4
	return ETMD
	},//virgule entre chaque fonction

_EquationTempsMinuteSec : function()
	{
	return Math.abs(this._EquationTempsMinuteDEC())/24
	},//virgule entre chaque fonction

Lever : function ()
	{
	return  (Math.floor(12-this._AngleHoraireHeure()+this._EquationTempsMinuteDEC()/60+(this.longitude*-1)*4/60+this.Decalage)+Math.round((((12-this._AngleHoraireHeure())+this._EquationTempsMinuteDEC()/60+(this.longitude*-1)*4/60+this.Decalage)-Math.floor((12-this._AngleHoraireHeure())+this._EquationTempsMinuteDEC()/60+(this.longitude*-1)*4/60+this.Decalage))*60,0)/60)/24;
	},//virgule entre chaque fonction

Conversion_DecJour_Heure : function (HeureDEC) //(HeureDEC)
	{
	//Retourne l'heure du jour par rapport d'une variable ddécimale de la journdée
	Heure = Math.floor(HeureDEC*24) 
	Minutes = Math.round(((HeureDEC*24)-Heure)*60)
	return Heure +"h"+ this._deuxchiffres(Minutes)
	},//virgule entre chaque fonction

	//Calcule la durdée du jour par rapport au lever et coucher du soleil
DureeJour :	function () //(LAT, LONG, Decalage, LeJour, LeMois, LAn)
	{
	DJ_DEC = this.Coucher() - this.Lever()
	return DJ_DEC
	},//virgule entre chaque fonction

DureeNuit : function ()
	{
	return 1-this.DureeJour(); 	
	}, 


Coucher : function() // (LAT, LONG, Decalage, LeJour, LeMois, LAn)
	{
	return (Math.floor(12+this._AngleHoraireHeure()+this._EquationTempsMinuteDEC()/60+(this.longitude*-1)*4/60+this.Decalage)+Math.round(((12+this._AngleHoraireHeure()+this._EquationTempsMinuteDEC()/60+(this.longitude*-1)*4/60+this.Decalage)-Math.floor(12+this._AngleHoraireHeure()+this._EquationTempsMinuteDEC()/60+(this.longitude*-1)*4/60+this.Decalage))*60,0)/60)/24;
	},//virgule entre chaque fonction

	// Donne les minutes en bas de zero sur 2 chiffres
_deuxchiffres : function (nombre)
	{
	if (nombre < 10)
	{retour = "0" + nombre }
	else
	{retour = nombre}

	return retour
}

  });
});