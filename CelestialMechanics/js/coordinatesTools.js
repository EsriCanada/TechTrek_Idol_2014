define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/domReady!"], function(declare){
  return {

	// Donne les minutes en bas de zero sur 2 chiffres
_deuxchiffres : function (nombre)
	{
	if (nombre < 10)
	{retour = "0" + nombre }
	else
	{retour = nombre}

	return retour
	}, 
	
DDtoDMStoLISTE : function (value)
	{
	var posneg;
	if (value < 0)
		{posneg = -1}
	else
		{posneg = 1}
	absValue = Math.abs(value);		
	deg = Math.trunc(Math.abs(absValue)); 
	min = this._deuxchiffres(Math.trunc((absValue - deg)*60));  
	sec = this._deuxchiffres(Math.trunc((((absValue - deg)*60)-min)*60));
	
	return [deg * posneg, min, sec];
	}, 
	
DDtoDMStoTXT : function (value)
	{
	var posneg;
	if (value < 0)
		{posneg = -1}
	else
		{posneg = 1}
	absValue = Math.abs(value);	
	/*Math.trunc fonctionne uniquement avec Firefox.
	//deg = Math.trunc(Math.abs(absValue)); 
	//min = this._deuxchiffres(Math.trunc((absValue - deg)*60));  
	//sec = this._deuxchiffres(Math.trunc((((absValue - deg)*60)-min)*60));
	*/
	deg = Math.floor(Math.abs(absValue)); 
	min = this._deuxchiffres(Math.floor((absValue - deg)*60));  
	sec = this._deuxchiffres(Math.floor((((absValue - deg)*60)-min)*60));
	return deg * posneg + "&deg;" + min + "'" + sec + "''";
	}

  };
});