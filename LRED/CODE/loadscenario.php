<?php

$id = intval($_GET['id']);



if ($id ==0 ) { 
echo "";
exit;
}
$conn = oci_connect('username', 'password', 'instancename', 'AL32UTF8');
if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}


			


$scenarioQuery = "";
$scenarioQuery2 = "";

if  ($id == 1) {
$scenarioQuery = "SELECT TO_CHAR (Station.STATIONID) AS stationid,TO_CHAR (Station.NO_) AS NO_,TO_CHAR (Station.ANCIEN_NO) AS ancien_NO,TO_CHAR (Station.TYPE_TXT) AS type_txt, TO_CHAR (Station.TYPE_VALUE) AS type_value, TO_CHAR (Station.TERRITOIRE) AS territoire,TO_CHAR (Station.SECTEUR) AS secteur, TO_CHAR (Station.BASSIN_VERSANT) AS bassin_versant,TO_CHAR (Station.X) AS x,TO_CHAR (Station.Y) AS y,TO_CHAR (Station.Z_SOL) AS z_sol,TO_CHAR (Station.Z_PVC) AS z_pvc,TO_CHAR (Station.GROUPE) AS groupe, TO_CHAR (CritSout.scenario1) AS scenario1, TO_CHAR (parameter_result.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.STATION) AS STATION,TO_CHAR (parameter_sample.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.LAB_CERTIFICATE) AS LAB_CERTIFICATE,TO_CHAR (parameter_sample.LAB_ID) AS LAB_ID,TO_CHAR (parameter_sample.DUPLICATE) AS DUPLICATE,TO_CHAR (parameter_sample.SAMPLE_DATE) AS SAMPLE_DATE,TO_CHAR (parameter_sample.CHAIN_CUST) AS CHAIN_CUST,TO_CHAR (parameter_sample.COMMENT_) AS COMMENT_, TO_CHAR (parameter_sample.LABORATORY) AS LABORATORY,TO_CHAR (parameter_sample.DATE_SENT) AS DATE_SENT,TO_CHAR (parameter_sample.DATE_RECEIVED) AS DATE_RECEIVED, TO_CHAR (parameter_sample.SAMP_MATRIX) AS SAMP_MATRIX,TO_CHAR (parameter_sample.SAMPLE_CLASS) AS SAMPLE_CLASS, TO_CHAR (parameter_sample.SAMPLE_TYPE) AS SAMPLE_TYPE,   TO_CHAR (parameter_sample.SAMPLER_NAME) AS SAMPLER_NAME,TO_CHAR (parameter_sample.REF_REPORT) AS REF_REPORT,TO_CHAR (parameter_sample.ENTERED_BY) AS ENTERED_BY, TO_CHAR (parameter_result.chemical_name) AS CHEMICAL_NAME FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_1%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO1";
$scenarioQuery2 = "SELECT DISTINCT TO_CHAR(Station.STATIONID) as stationid FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_1%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO1";
} elseif ($id == 2) {

$scenarioQuery = "SELECT TO_CHAR (Station.STATIONID) AS stationid,TO_CHAR (Station.NO_) AS NO_,TO_CHAR (Station.ANCIEN_NO) AS ancien_NO,TO_CHAR (Station.TYPE_TXT) AS type_txt, TO_CHAR (Station.TYPE_VALUE) AS type_value, TO_CHAR (Station.TERRITOIRE) AS territoire,TO_CHAR (Station.SECTEUR) AS secteur, TO_CHAR (Station.BASSIN_VERSANT) AS bassin_versant,TO_CHAR (Station.X) AS x,TO_CHAR (Station.Y) AS y,TO_CHAR (Station.Z_SOL) AS z_sol,TO_CHAR (Station.Z_PVC) AS z_pvc,TO_CHAR (Station.GROUPE) AS groupe, TO_CHAR (CritSout.scenario2) AS scenario2, TO_CHAR (parameter_result.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.STATION) AS STATION,TO_CHAR (parameter_sample.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.LAB_CERTIFICATE) AS LAB_CERTIFICATE,TO_CHAR (parameter_sample.LAB_ID) AS LAB_ID,TO_CHAR (parameter_sample.DUPLICATE) AS DUPLICATE,TO_CHAR (parameter_sample.SAMPLE_DATE) AS SAMPLE_DATE,TO_CHAR (parameter_sample.CHAIN_CUST) AS CHAIN_CUST,TO_CHAR (parameter_sample.COMMENT_) AS COMMENT_, TO_CHAR (parameter_sample.LABORATORY) AS LABORATORY,TO_CHAR (parameter_sample.DATE_SENT) AS DATE_SENT,TO_CHAR (parameter_sample.DATE_RECEIVED) AS DATE_RECEIVED, TO_CHAR (parameter_sample.SAMP_MATRIX) AS SAMP_MATRIX,TO_CHAR (parameter_sample.SAMPLE_CLASS) AS SAMPLE_CLASS, TO_CHAR (parameter_sample.SAMPLE_TYPE) AS SAMPLE_TYPE,   TO_CHAR (parameter_sample.SAMPLER_NAME) AS SAMPLER_NAME,TO_CHAR (parameter_sample.REF_REPORT) AS REF_REPORT,TO_CHAR (parameter_sample.ENTERED_BY) AS ENTERED_BY, TO_CHAR (parameter_result.chemical_name) AS CHEMICAL_NAME FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_2%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO2";
$scenarioQuery2 = "SELECT DISTINCT TO_CHAR(Station.STATIONID) as stationid FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_2%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO2";
} elseif ($id == 3) {

$scenarioQuery = "SELECT TO_CHAR (Station.STATIONID) AS stationid,TO_CHAR (Station.NO_) AS NO_,TO_CHAR (Station.ANCIEN_NO) AS ancien_NO,TO_CHAR (Station.TYPE_TXT) AS type_txt, TO_CHAR (Station.TYPE_VALUE) AS type_value, TO_CHAR (Station.TERRITOIRE) AS territoire,TO_CHAR (Station.SECTEUR) AS secteur, TO_CHAR (Station.BASSIN_VERSANT) AS bassin_versant,TO_CHAR (Station.X) AS x,TO_CHAR (Station.Y) AS y,TO_CHAR (Station.Z_SOL) AS z_sol,TO_CHAR (Station.Z_PVC) AS z_pvc,TO_CHAR (Station.GROUPE) AS groupe, TO_CHAR (CritSout.scenario3) AS scenario3, TO_CHAR (parameter_result.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.STATION) AS STATION,TO_CHAR (parameter_sample.SAMPLE_ID) AS SAMPLE_ID,TO_CHAR (parameter_sample.LAB_CERTIFICATE) AS LAB_CERTIFICATE,TO_CHAR (parameter_sample.LAB_ID) AS LAB_ID,TO_CHAR (parameter_sample.DUPLICATE) AS DUPLICATE,TO_CHAR (parameter_sample.SAMPLE_DATE) AS SAMPLE_DATE,TO_CHAR (parameter_sample.CHAIN_CUST) AS CHAIN_CUST,TO_CHAR (parameter_sample.COMMENT_) AS COMMENT_, TO_CHAR (parameter_sample.LABORATORY) AS LABORATORY,TO_CHAR (parameter_sample.DATE_SENT) AS DATE_SENT,TO_CHAR (parameter_sample.DATE_RECEIVED) AS DATE_RECEIVED, TO_CHAR (parameter_sample.SAMP_MATRIX) AS SAMP_MATRIX,TO_CHAR (parameter_sample.SAMPLE_CLASS) AS SAMPLE_CLASS, TO_CHAR (parameter_sample.SAMPLE_TYPE) AS SAMPLE_TYPE,   TO_CHAR (parameter_sample.SAMPLER_NAME) AS SAMPLER_NAME,TO_CHAR (parameter_sample.REF_REPORT) AS REF_REPORT,TO_CHAR (parameter_sample.ENTERED_BY) AS ENTERED_BY, TO_CHAR (parameter_result.chemical_name) AS CHEMICAL_NAME  FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_3%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO3";
$scenarioQuery2 = "SELECT DISTINCT TO_CHAR(Station.STATIONID) as stationid FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_3%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO3";
} elseif ($id == 4) {

$scenarioQuery = "SELECT TO_CHAR (Station.STATIONID) AS stationid,TO_CHAR (Station.NO_) AS NO_,TO_CHAR (Station.ANCIEN_NO) AS ancien_NO,TO_CHAR (Station.TYPE_TXT) AS type_txt, TO_CHAR (Station.TYPE_VALUE) AS type_value, TO_CHAR (Station.TERRITOIRE) AS territoire,TO_CHAR (Station.SECTEUR) AS secteur, TO_CHAR (Station.BASSIN_VERSANT) AS bassin_versant,TO_CHAR (Station.X) AS x,TO_CHAR (Station.Y) AS y,TO_CHAR (Station.Z_SOL) AS z_sol,TO_CHAR (Station.Z_PVC) AS z_pvc,TO_CHAR (Station.GROUPE) AS groupe, TO_CHAR (CritSout.scenario4) AS scenario4, TO_CHAR (parameter_result.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.STATION) AS STATION,TO_CHAR (parameter_sample.SAMPLE_ID) AS SAMPLE_ID,TO_CHAR (parameter_sample.LAB_CERTIFICATE) AS LAB_CERTIFICATE,TO_CHAR (parameter_sample.LAB_ID) AS LAB_ID,TO_CHAR (parameter_sample.DUPLICATE) AS DUPLICATE,TO_CHAR (parameter_sample.SAMPLE_DATE) AS SAMPLE_DATE,TO_CHAR (parameter_sample.CHAIN_CUST) AS CHAIN_CUST,TO_CHAR (parameter_sample.COMMENT_) AS COMMENT_, TO_CHAR (parameter_sample.LABORATORY) AS LABORATORY,TO_CHAR (parameter_sample.DATE_SENT) AS DATE_SENT,TO_CHAR (parameter_sample.DATE_RECEIVED) AS DATE_RECEIVED, TO_CHAR (parameter_sample.SAMP_MATRIX) AS SAMP_MATRIX,TO_CHAR (parameter_sample.SAMPLE_CLASS) AS SAMPLE_CLASS, TO_CHAR (parameter_sample.SAMPLE_TYPE) AS SAMPLE_TYPE,   TO_CHAR (parameter_sample.SAMPLER_NAME) AS SAMPLER_NAME,TO_CHAR (parameter_sample.REF_REPORT) AS REF_REPORT,TO_CHAR (parameter_sample.ENTERED_BY) AS ENTERED_BY, TO_CHAR (parameter_result.chemical_name) AS CHEMICAL_NAME FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_4%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO4";
$scenarioQuery2 = "SELECT DISTINCT TO_CHAR(Station.STATIONID) as stationid  FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_4%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO4";
} elseif ($id == 5) {

$scenarioQuery = "SELECT TO_CHAR (Station.STATIONID) AS stationid,TO_CHAR (Station.NO_) AS NO_,TO_CHAR (Station.ANCIEN_NO) AS ancien_NO,TO_CHAR (Station.TYPE_TXT) AS type_txt, TO_CHAR (Station.TYPE_VALUE) AS type_value, TO_CHAR (Station.TERRITOIRE) AS territoire,TO_CHAR (Station.SECTEUR) AS secteur, TO_CHAR (Station.BASSIN_VERSANT) AS bassin_versant,TO_CHAR (Station.X) AS x,TO_CHAR (Station.Y) AS y,TO_CHAR (Station.Z_SOL) AS z_sol,TO_CHAR (Station.Z_PVC) AS z_pvc,TO_CHAR (Station.GROUPE) AS groupe, TO_CHAR (CritSout.scenario5) AS scenario5, TO_CHAR (parameter_result.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.STATION) AS STATION,TO_CHAR (parameter_sample.SAMPLE_ID) AS SAMPLE_ID,TO_CHAR (parameter_sample.LAB_CERTIFICATE) AS LAB_CERTIFICATE,TO_CHAR (parameter_sample.LAB_ID) AS LAB_ID,TO_CHAR (parameter_sample.DUPLICATE) AS DUPLICATE,TO_CHAR (parameter_sample.SAMPLE_DATE) AS SAMPLE_DATE,TO_CHAR (parameter_sample.CHAIN_CUST) AS CHAIN_CUST,TO_CHAR (parameter_sample.COMMENT_) AS COMMENT_, TO_CHAR (parameter_sample.LABORATORY) AS LABORATORY,TO_CHAR (parameter_sample.DATE_SENT) AS DATE_SENT,TO_CHAR (parameter_sample.DATE_RECEIVED) AS DATE_RECEIVED, TO_CHAR (parameter_sample.SAMP_MATRIX) AS SAMP_MATRIX,TO_CHAR (parameter_sample.SAMPLE_CLASS) AS SAMPLE_CLASS, TO_CHAR (parameter_sample.SAMPLE_TYPE) AS SAMPLE_TYPE,   TO_CHAR (parameter_sample.SAMPLER_NAME) AS SAMPLER_NAME,TO_CHAR (parameter_sample.REF_REPORT) AS REF_REPORT,TO_CHAR (parameter_sample.ENTERED_BY) AS ENTERED_BY, TO_CHAR (parameter_result.chemical_name) AS CHEMICAL_NAME FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_5%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO5";
$scenarioQuery2 = "SELECT DISTINCT TO_CHAR(Station.STATIONID) as stationid FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_5%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO5";
} elseif ($id == 6) {

$scenarioQuery = "SELECT TO_CHAR (Station.STATIONID) AS stationid,TO_CHAR (Station.NO_) AS NO_,TO_CHAR (Station.ANCIEN_NO) AS ancien_NO,TO_CHAR (Station.TYPE_TXT) AS type_txt, TO_CHAR (Station.TYPE_VALUE) AS type_value, TO_CHAR (Station.TERRITOIRE) AS territoire,TO_CHAR (Station.SECTEUR) AS secteur, TO_CHAR (Station.BASSIN_VERSANT) AS bassin_versant,TO_CHAR (Station.X) AS x,TO_CHAR (Station.Y) AS y,TO_CHAR (Station.Z_SOL) AS z_sol,TO_CHAR (Station.Z_PVC) AS z_pvc,TO_CHAR (Station.GROUPE) AS groupe, TO_CHAR (CritSout.scenario6) AS scenario6, TO_CHAR (parameter_result.SAMPLE_ID) AS SAMPLE_ID, TO_CHAR (parameter_sample.STATION) AS STATION,TO_CHAR (parameter_sample.SAMPLE_ID) AS SAMPLE_ID,TO_CHAR (parameter_sample.LAB_CERTIFICATE) AS LAB_CERTIFICATE,TO_CHAR (parameter_sample.LAB_ID) AS LAB_ID,TO_CHAR (parameter_sample.DUPLICATE) AS DUPLICATE,TO_CHAR (parameter_sample.SAMPLE_DATE) AS SAMPLE_DATE,TO_CHAR (parameter_sample.CHAIN_CUST) AS CHAIN_CUST,TO_CHAR (parameter_sample.COMMENT_) AS COMMENT_, TO_CHAR (parameter_sample.LABORATORY) AS LABORATORY,TO_CHAR (parameter_sample.DATE_SENT) AS DATE_SENT,TO_CHAR (parameter_sample.DATE_RECEIVED) AS DATE_RECEIVED, TO_CHAR (parameter_sample.SAMP_MATRIX) AS SAMP_MATRIX,TO_CHAR (parameter_sample.SAMPLE_CLASS) AS SAMPLE_CLASS, TO_CHAR (parameter_sample.SAMPLE_TYPE) AS SAMPLE_TYPE,   TO_CHAR (parameter_sample.SAMPLER_NAME) AS SAMPLER_NAME,TO_CHAR (parameter_sample.REF_REPORT) AS REF_REPORT,TO_CHAR (parameter_sample.ENTERED_BY) AS ENTERED_BY, TO_CHAR (parameter_result.chemical_name) AS CHEMICAL_NAME   FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_6%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO6";
$scenarioQuery2 = "SELECT DISTINCT TO_CHAR(Station.STATIONID) as stationid FROM ((Station INNER JOIN parameter_sample ON Station.NO_ = parameter_sample.STATION) INNER JOIN parameter_result ON parameter_sample.SAMPLE_ID = parameter_result.SAMPLE_ID) LEFT JOIN CritSout ON parameter_result.CHEMICAL_NAME = CritSout.SUBSTANCE WHERE parameter_sample.SAMPLE_CLASS='EAU SOUTERRAINE' and GROUPE LIKE '%scenario_sout_6%' AND RESULT_VALUE is not null and RESULT_VALUE_CALC > SCENARIO6";
} 


$stid = oci_parse($conn, $scenarioQuery);

oci_execute($stid);

 
 echo "<table id=\"tabSample\"     style=\" font-size:small;\">";
 echo "<thead><tr style=\"background-color:#338533; color:white;\">  <th>CHEMICAL NAME</th> <th>CRITERIA</th>  <th>STATION</th>   <th>SAMPLE_ID</th>   <th>LAB CERTIFICATE</th>   <th>LAB ID</th>   <th>DUPLICATE</th>   <th>SAMPLE DATE</th>   <th>CHAIN CUST</th>   <th>COMMENT_</th>   <th>LABORATORY</th>   <th>DATE SENT</th>   <th>DATE RECEIVED</th>   <th>SAMP MATRIX</th>   <th>SAMPLE CLASS</th>   <th>SAMPLE TYPE</th>   <th>SAMPLER NAME</th>   <th>REF REPORT</th>   <th>ENTERED BY</th>   </tr>  </thead><tbody>";

 
$i = 1; 
while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {

if ($i%2 == 0) {
echo "<tr  previouscolor=\"white\" title=\"click to identify the Station {$row['STATION']} on the map\" style=\"background-color:white;cursor: pointer\" onclick=\"selectStationOnMap(this, 'white','".$row['STATIONID']."')\">  <td>{$row['CHEMICAL_NAME']}</td> <td>{$row['SCENARIO'.$id]} </td> <td>{$row['STATION']}</td>   <td>{$row['SAMPLE_ID']}</td>    <td>{$row['LAB_CERTIFICATE']}</td> <td>{$row['LAB_ID']}</td>  <td>{$row['DUPLICATE']}</td> <td>{$row['SAMPLE_DATE']}</td>  <td>{$row['CHAIN_CUST']}</td> <td>{$row['COMMENT_']}</td>   <td>{$row['LABORATORY']}</td> <td>{$row['DATE_SENT']}</td> <td>{$row['DATE_RECEIVED']}</td> <td>{$row['SAMP_MATRIX']}</td>  <td>{$row['SAMPLE_CLASS']}</td> <td>{$row['SAMPLE_TYPE']}</td> <td>{$row['SAMPLER_NAME']}</td>  <td>{$row['REF_REPORT']}</td> <td>{$row['ENTERED_BY']}</td>  </tr>  ";
}
else 
{
echo "<tr  previouscolor=\"rgb(204, 235, 204)\" title=\"click to identify the Station {$row['STATION']} on the map\" style=\"cursor: pointer;background-color:#CCEBCC;\" onclick=\"selectStationOnMap(this,'rgb(204, 235, 204)','".$row['STATIONID']."')\" > <td>{$row['CHEMICAL_NAME']}</td> <td>{$row['SCENARIO'.$id]} <td>{$row['STATION']}</td>   <td>{$row['SAMPLE_ID']}</td>    <td>{$row['LAB_CERTIFICATE']}</td> <td>{$row['LAB_ID']}</td>  <td>{$row['DUPLICATE']}</td> <td>{$row['SAMPLE_DATE']}</td>  <td>{$row['CHAIN_CUST']}</td> <td>{$row['COMMENT_']}</td>   <td>{$row['LABORATORY']}</td> <td>{$row['DATE_SENT']}</td> <td>{$row['DATE_RECEIVED']}</td> <td>{$row['SAMP_MATRIX']}</td>  <td>{$row['SAMPLE_CLASS']}</td> <td>{$row['SAMPLE_TYPE']}</td> <td>{$row['SAMPLER_NAME']}</td>  <td>{$row['REF_REPORT']}</td> <td>{$row['ENTERED_BY']}</td>  </tr>  ";
}

$i = $i +1;
}

    echo "     </tbody></table>";


$stid2 = oci_parse($conn, $scenarioQuery2);




oci_execute($stid2);




echo "<input type=\"hidden\" id=\"queryStationWhere\" value=\" STATIONID IN (";



while ($row = oci_fetch_array($stid2, OCI_ASSOC+OCI_RETURN_NULLS)) {

  echo " '" . $row['STATIONID'] . "', ";
  
}
echo " '0') \"/>";


?>