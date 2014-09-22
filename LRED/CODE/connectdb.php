<HTML>
	<head>
	        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
			<title>LRED</title>
			<link rel="stylesheet" href="http://js.arcgis.com/3.10/js/esri/css/esri.css"/>
			<link rel="stylesheet" type="text/css" href="css/main.css">
			<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
			<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
			<script src="http://js.arcgis.com/3.10/"></script>
			<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
			<script src="jquery.corner.js"></script>
			
			
        
	</head>
	<border>		
		<div class="appHeader">
            <div class="headerLogo">
                <img alt="logo" src="images/unlogo.jpg" height="60" />
            </div>
            <div class="headerTitle">
                Sampling stations   
                <div class="subHeaderTitle">
                Environmental App
                </div>
            </div>
		</div>
	</border>


<script type="text/javascript">

 var map;
 var identifyTask;
 var identifyParams;

require(["esri/tasks/IdentifyTask",   
        "esri/tasks/IdentifyParameters",
        "esri/InfoTemplate",
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ImageParameters"
      ], function (
         IdentifyTask, IdentifyParameters,InfoTemplate, Map, ArcGISDynamicMapServiceLayer, ImageParameters) {

        map = new Map("mapDiv", {
		   center: [-71.4939779, 46.8958633],
		zoom: 10,
		basemap: "topo"
        });

		
        var imageParameters = new ImageParameters();
        imageParameters.format = "jpeg"; //set the image type to PNG24, note default is PNG8.

        //Takes a URL to a non cached map service.
		var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("http://servername.esri.local/server/rest/services/stations/MapServer", {
		"id": "stationLayer",
		infoTemplates: {0: {
                    		infoTemplate: new InfoTemplate("Station  #${STATIONID}", "<TABLE><TR><TD><B>${NO_}</B></TD></TR>  <TR><TD><B>&nbsp;</B></TD></TR>  <TR><TD>Type: ${TYPE_TXT}</TD></TR>  <TR><TD>Territoire: ${TERRITOIRE}</TD></TR>  <TR><TD>Secteur: ${SECTEUR}</TD></TR>  <TR><TD>Date sondage: ${DATE_SONDAGE}</TD></TR> <TR><TD>Etude: ${ETUDE_COORD}</TD></TR></TABLE>"),
							layerUrl:null
						}
						},
						
		                
          "opacity" : 1,
          "imageParameters" : imageParameters
        });
		
		
        identifyTask = new IdentifyTask("http://servername.esri.local/server/rest/services/stations/MapServer/0");      

          identifyParams = new IdentifyParameters();   

          identifyParams.tolerance = 3;   
          identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;   

        map.addLayer(dynamicMapServiceLayer);
 
  
      });

	  
	  
	 


function selectScenario(str) {

//document.getElementById("scenarios").value="0";

  if (document.getElementById("family").value != "0") {
  
   var layerDefinitions = [];
	
		layerDefinitions[0] ="";
		
		identifyParams.layerDefinitions = layerDefinitions;
		map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
   document.getElementById("family").value="0";
   document.getElementById('cname').innerHTML = "";
   
   $("#tableSample").hide( "slow" );
   
   var myTable = document.getElementById('divTabSample');


		myTable.style.border = "";
   
   }
   
   


document.getElementById("selected_scenario").innerHTML = "loading scenario...";

  if (str=="") {
    document.getElementById("selected_scenario").innerHTML="";
    return;
  } 
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
	

    xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
 
    if ( xmlhttp.readyState==4 && xmlhttp.status==200) {
	  $("#tableSample").show( "slow" );
	  
      document.getElementById("tableSample").innerHTML=xmlhttp.responseText;


	var b = document.getElementById("queryStationWhere").value;
		
		b.replace("/n","");
		b.replace("/r","");
		
		var layerDefinitions = [];
		layerDefinitions[0] = b;
		
		map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
	//	$("#tabSample").tablesorter();  
	     
		var myTable = document.getElementById('divTabSample');

		myTable.style.border = "thin solid black";
		//scrolify($('#tabSample'), 330);


    }
  }

  xmlhttp.open("GET","http://servername:5050/loadscenario.php?id="+str,true);
  xmlhttp.send();
 
}

function selectStationOnMap(obj, color, str) {

if (obj.style.background == 'rgb(204, 235, 204)' || obj.style.background == 'white')
{
 var layerDefinitions = [];
		layerDefinitions[0] = " STATIONID = '" + str + "'";
		
		identifyParams.layerDefinitions = layerDefinitions;

	map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
	
	
	 $('#tableSample').find('tbody tr').each(function(){
	 var color = $(this).css('background-color',$(this).attr("previouscolor"));
           
	
        });
	
	
	obj.style.background = '#99CCFF';
	}
 else {

 var b = document.getElementById("queryStationWhere").value;
		
		b.replace("/n","");
		b.replace("/r","");
		
		var layerDefinitions = [];
		layerDefinitions[0] = b;
		
		map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
        obj.style.background = color;

}
 




 
}


function selectStationOnMap2(obj, color,str) {

if (obj.style.background == 'rgb(204, 235, 204)' || obj.style.background == 'white')
{
 

 var layerDefinitions = [];
		layerDefinitions[0] = " NO_ = '" + str + "'";
		
		identifyParams.layerDefinitions = layerDefinitions;

	map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
 	
	
	 $('#tableSample').find('tbody tr').each(function(){
	 var color = $(this).css('background-color',$(this).attr("previouscolor"));
           
	
        });
	
	
	obj.style.background = '#99CCFF';
	}
 else {

 var b = document.getElementById("querySampleStationWhere").value;
		
		b.replace("/n","");
		b.replace("/r","");
		
		var layerDefinitions = [];
		layerDefinitions[0] = b;
		
		map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
        obj.style.background = color;

}
 


 
}


function selectChemical() {

var selectedList = "";

var selectBox = document.getElementById('chemicalName');

 for (var i = 0; i < selectBox.options.length; i++) { 
             if (selectBox.options[i].selected){
				selectedList = selectedList + selectBox.options[i].value + ";";
			 
			 }; 
        } 

		if (selectedList == "") {
		document.getElementById("tableSample").innerHTML= " <table border=1  style=\" font-size:x-small;\">  <tr> <th> CHEMICAL_NAME </TH>  <th>STATION</th>   <th>SAMPLE_ID</th>  <th>LAB CERTIFICATE</th>   <th>LAB ID</th>   <th>DUPLICATE</th>   <th>SAMPLE DATE</th>   <th>CHAIN CUST</th>    <th>LABORATORY</th>   <th>DATE SENT</th>   <th>DATE RECEIVED</th>   <th>SAMP MATRIX</th>   <th>SAMPLE CLASS</th>   <th>SAMPLE TYPE</th>   <th>SAMPLER NAME</th>   <th>REF REPORT</th>   <th>ENTERED BY</th>   </tr>      </table> ";
		} else {
		
	document.getElementById("tableSample").innerHTML= "Loading...";
	
 if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
	 

    xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if ( xmlhttp.readyState==4 && xmlhttp.status==200) {
	
        $("#tableSample").show( "slow" );
	document.getElementById("tableSample").innerHTML=xmlhttp.responseText;
    var layerDefinitions = [];
	
		layerDefinitions[0] = document.getElementById("querySampleStationWhere").value;
		
		identifyParams.layerDefinitions = layerDefinitions;

	map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
	//$("#tabSample").tablesorter();  
	var myTable = document.getElementById('divTabSample');

		myTable.style.border = "thin solid black";
	  
    }
  }

  xmlhttp.open("GET","http://servername:5050/loadsamples.php?name="+encodeURIComponent(selectedList),true);
  xmlhttp.send();	
	
		}

}


function scrolify(tblAsJQueryObject, height){
        var oTbl = tblAsJQueryObject;

        // for very large tables you can remove the four lines below
        // and wrap the table with <div> in the mark-up and assign
        // height and overflow property  
        var oTblDiv = $("<div/>");
        oTblDiv.css('height', height);
        oTblDiv.css('overflow','scroll');               
        oTbl.wrap(oTblDiv);

        // save original width
        oTbl.attr("data-item-original-width", oTbl.width());
        oTbl.find('thead tr td').each(function(){
            $(this).attr("data-item-original-width",$(this).width());
        }); 
        oTbl.find('tbody tr:eq(0) td').each(function(){
            $(this).attr("data-item-original-width",$(this).width());
        });                 


        // clone the original table
        var newTbl = oTbl.clone();

        // remove table header from original table
        oTbl.find('thead tr').remove();                 
        // remove table body from new table
        newTbl.find('tbody tr').remove();   

        oTbl.parent().parent().prepend(newTbl);
        newTbl.wrap("<div/>");

        // replace ORIGINAL COLUMN width                
        newTbl.width(newTbl.attr('data-item-original-width'));
        newTbl.find('thead tr td').each(function(){
            $(this).width($(this).attr("data-item-original-width"));
        });     
        oTbl.width(oTbl.attr('data-item-original-width'));      
        oTbl.find('tbody tr:eq(0) td').each(function(){
            $(this).width($(this).attr("data-item-original-width"));
        });                 
    }
	
	

function selectFamily(str) {
   if (document.getElementById("scenarios").value != "0") {
   var layerDefinitions = [];
	
		layerDefinitions[0] ="";
		
		identifyParams.layerDefinitions = layerDefinitions;
		map.getLayer("stationLayer").setLayerDefinitions(layerDefinitions);
   document.getElementById("scenarios").value="0";
   $("#tableSample").hide( "slow" );
   var myTable = document.getElementById('divTabSample');
   myTable.style.border = "";
   
   
   }
  
  
   document.getElementById("cname").innerHTML= "loading....";

  if (str=="") {
  document.getElementById("tableSample").innerHTML= " <table border=1  style=\" font-size:x-small;\">  <tr> <th> CHEMICAL_NAME </TH>  <th>STATION</th>   <th>SAMPLE_ID</th>     <th>LAB CERTIFICATE</th>   <th>LAB ID</th>   <th>DUPLICATE</th>   <th>SAMPLE DATE</th>   <th>CHAIN CUST</th>  <th>COMMENT</th>  <th>LABORATORY</th>   <th>DATE SENT</th>   <th>DATE RECEIVED</th>   <th>SAMP MATRIX</th>   <th>SAMPLE CLASS</th>   <th>SAMPLE TYPE</th>   <th>SAMPLER NAME</th>   <th>REF REPORT</th>   <th>ENTERED BY</th>   </tr>      </table>";
  $("#tableSample").hide( "slow" );
document.getElementById("cname").innerHTML="<select id=\"chemicalName\" onClick=\"selectChemical();\" style=\"width:300px;height:300px;overflow:auto;\" multiple />";
    return;
  } 
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
	 

    xmlhttp=new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function() {
    if ( xmlhttp.readyState==4 && xmlhttp.status==200) {
	
      document.getElementById("cname").innerHTML=xmlhttp.responseText;
	  
    }
  }

  xmlhttp.open("GET","http://servername:5050/loadchemicalname.php?name="+encodeURIComponent(str),true);
  xmlhttp.send();
}



</script>

<style>





body
{
	font-family: "Courier New", Courier, monospace;
}
table#tabSample
{
    
    border-width: 0 0 0 0;
    border-style: solid;

}

table#tabSample td
{
    border-color: #600;
    border-width: 1px 1px 0 0;
    border-style: solid;
    margin: 0;
    padding: 1px;
    
}
table#tabSample th
{
    border-color: #600;
    border-width: 0 1px 0 0;
    border-style: solid;
    margin: 0;
    padding: 1px;
	 
	 
    
}
</style>

<BODY style="background-color:white">
	<!--MAP-->
	<DIV class = "map">
		<div id="mapDiv"></div>	
	</DIV>
	
	<!--SCENARIOS-->
	<DIV class = "scenario" style="display:block;">
		
		<DIV id="selected_scenario"></DIV>
	</DIV>
	
	<!--CHEMICAL-->
	

	<DIV id="chemsBox" class = "chemicalFam" style="margin:5px;background-color:#EFFBEF; width:99%; height:400px;" >
	<div style="float:left;padding:5px;">
<script> $('#chemsBox').corner();	</script>

<div style="float:left;">
<div style="float:left">
<div class = "selectScenario">
		<B>		Select a scenario</B><BR/>
			
				<SELECT id="scenarios" onChange="selectScenario(this.options[this.selectedIndex].value);">
					<OPTION  value="0" ></OPTION>
					<OPTION value="1" >1: Nelson/ more than 20m /drinking water + marine life</OPTION>
					<OPTION value="2" >2: J-C + R-a-P / more than 20m /drinking water + marine life</OPTION>
					<OPTION value="3" >3: Nelson / less than 20m /drinking water + marine life</OPTION>
					<OPTION value="4" >4: R-a-P / less than 20m /drinking water + marine life</OPTION>
					<OPTION value="5" >5: J-C + R-a-P / more than 20m /drinking water + marine life 		</OPTION>
					<OPTION value="6" >6: J-C  / less than 20m /marine life</OPTION>
				</SELECT>
		</div>
</DIV>

<div style="float:left;margin-left:30px;">		
	<B>Choose a chemical Family</B><BR/>
		
<SELECT id="family" onChange="selectFamily(this.options[this.selectedIndex].value);">
			<OPTION  value="0" ></OPTION>			
					<?php

					$conn = oci_connect('username', 'password', 'instancename', 'AL32UTF8');
					if (!$conn) {
							$e = oci_error();
							trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
					}

					$stid = oci_parse($conn, 'select distinct TO_CHAR(family) as FAMILY from PARAMETER_RESULT where family is not null order by 1 ASC');
					oci_execute($stid);

					while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {

					echo "			<OPTION value=\"{$row['FAMILY']}\">{$row['FAMILY']}</OPTION>";

					}
					?>
		</SELECT>
		
</div>		
<div style="float:left;margin-left:30px;">		
		<B>Chemical Names</B><BR/>
		
		<div id="cname">
		
		</div>
</div>
</div>
		</div>

<div id="divTabSample" style=" clear:both;height:300px;overflow:auto;">
<div id="tableSample" style=";margin:1px;display: none;height:300px">  
					<table id="tabSample"   style="float:right;font-size:x-small;">
					<thead>
						<tr>
						<th>CHEMICAL NAME</th>
						<th>STATION</th>
						<th>SAMPLE_ID</th>
						<th>LAB CERTIFICATE</th>
						<th>LAB ID</th>
						<th>DUPLICATE</th>
						<th>SAMPLE DATE</th>
						<th>CHAIN CUST</th>
						<th>COMMENT</th>
						<th>LABORATORY</th>
						<th>DATE SENT</th>
						<th>DATE RECEIVED</th>
						<th>SAMP MATRIX</th>
						<th>SAMPLE CLASS</th>
						<th>SAMPLE TYPE</th>
						<th>SAMPLER NAME</th>
						<th>REF REPORT</th>
						<th>ENTERED BY</th>
						</tr>
						</thead>
						<tbody>
						<td>CHEMICAL NAME</td>
						<td>STATION</td>
						<td>SAMPLE_ID</td>
						<td>LAB CERTIFICATE</td>
						<td>LAB ID</td>
						<td>DUPLICATE</td>
						<td>SAMPLE DATE</td>
						<td>CHAIN CUST</td>
						<td>COMMENT</td>
						<td>LABORATORY</td>
						<td>DATE SENT</td>
						<td>DATE RECEIVED</td>
						<td>SAMP MATRIX</td>
						<td>SAMPLE CLASS</td>
						<td>SAMPLE TYPE</td>
						<td>SAMPLER NAME</td>
						<td>REF REPORT</td>
						<td>ENTERED BY</td>
						</tbody>
					</table>
				</div>
				</div>
		</DIV>

</BODY>
</HTML>