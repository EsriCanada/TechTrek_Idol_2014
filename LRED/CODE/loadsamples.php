
<?php

$name=  urldecode($_GET['name']);

if ($name == "") { 
echo "";
exit;
}

$chemicals = explode(";", $name);

$orClause = " AND CHEMICAL_NAME IN (";

foreach ($chemicals as $value) {

    $orClause = $orClause . "q'[" . $value . "]',";
}
$orClause = $orClause. "'BIDON')";


$conn = oci_connect('username', 'password', 'instancename', 'AL32UTF8');
if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}


$SampleQuery = "";


$SampleQuery = "select TO_CHAR(ps.STATION) as STATION,  TO_CHAR(ps.SAMPLE_ID) AS SAMPLE_ID,  TO_CHAR(ps.LAB_CERTIFICATE) AS LAB_CERTIFICATE,  TO_CHAR(ps.LAB_ID) AS LAB_ID,  TO_CHAR(ps.DUPLICATE) AS DUPLICATE,  TO_CHAR(ps.SAMPLE_DATE) AS SAMPLE_DATE,  TO_CHAR(ps.CHAIN_CUST) AS CHAIN_CUST,  TO_CHAR(ps.COMMENT_) AS COMMENT_,  TO_CHAR(ps.LABORATORY) AS LABORATORY,  TO_CHAR(ps.DATE_SENT) AS DATE_SENT,  TO_CHAR(ps.DATE_RECEIVED) AS DATE_RECEIVED,  TO_CHAR(ps.SAMP_MATRIX) AS SAMP_MATRIX,  TO_CHAR(ps.SAMPLE_CLASS) AS SAMPLE_CLASS,  TO_CHAR(ps.SAMPLE_TYPE) AS SAMPLE_TYPE,  TO_CHAR(ps.SAMPLER_NAME) AS SAMPLER_NAME,  TO_CHAR(ps.REF_REPORT) AS REF_REPORT,  TO_CHAR(ps.ENTERED_BY) AS ENTERED_BY, to_char(pr.chemical_name) as CHEMICAL_NAME   from parameter_sample ps, parameter_result pr where ps.sample_id = pr.sample_id {$orClause}" ;




$stid = oci_parse($conn, $SampleQuery);


oci_execute($stid);

 echo "<table id=\"tabSample\"  style=\" font-size:small;\">";
 echo "<thead style=\"background-color:#338533; color:white;\"><tr>  <th>CHEMICAL NAME</th>  <th>STATION</th>   <th>SAMPLE_ID</th>  <th>LAB CERTIFICATE</th>   <th>LAB ID</th>   <th>DUPLICATE</th>   <th>SAMPLE DATE</th>   <th>CHAIN CUST</th>   <th>COMMENT_</th>   <th>LABORATORY</th>   <th>DATE SENT</th>   <th>DATE RECEIVED</th>   <th>SAMP MATRIX</th>   <th>SAMPLE CLASS</th>   <th>SAMPLE TYPE</th>   <th>SAMPLER NAME</th>   <th>REF REPORT</th>   <th>ENTERED BY</th>   </tr> </thead> <tbody>";

 
$i = 1; 
while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {

if ($i%2 == 0) {
echo "<tr previouscolor=\"white\"  title=\"click to identify the Station {$row['STATION']} on the map\" style=\"background-color:white;cursor: pointer\" onclick=\"selectStationOnMap2(this, 'white','".$row['STATION']."')\" >  <td>{$row['CHEMICAL_NAME']}</td> <td>{$row['STATION']}</td>   <td>{$row['SAMPLE_ID']}</td>  <td>{$row['LAB_CERTIFICATE']}</td> <td>{$row['LAB_ID']}</td>  <td>{$row['DUPLICATE']}</td> <td>{$row['SAMPLE_DATE']}</td>  <td>{$row['CHAIN_CUST']}</td> <td>{$row['COMMENT_']}</td>   <td>{$row['LABORATORY']}</td> <td>{$row['DATE_SENT']}</td> <td>{$row['DATE_RECEIVED']}</td> <td>{$row['SAMP_MATRIX']}</td>  <td>{$row['SAMPLE_CLASS']}</td> <td>{$row['SAMPLE_TYPE']}</td> <td>{$row['SAMPLER_NAME']}</td>  <td>{$row['REF_REPORT']}</td> <td>{$row['ENTERED_BY']}</td>  </tr>  ";
}
else 
{
echo "<tr previouscolor=\"rgb(204, 235, 204)\" title=\"click to identify the Station {$row['STATION']} on the map\" style=\"background-color:#CCEBCC;cursor: pointer\" onclick=\"selectStationOnMap2(this,'rgb(204, 235, 204)','".$row['STATION']."')\"> <td>{$row['CHEMICAL_NAME']}</td>  <td>{$row['STATION']}</td>   <td>{$row['SAMPLE_ID']}</td>     <td>{$row['LAB_CERTIFICATE']}</td> <td>{$row['LAB_ID']}</td>  <td>{$row['DUPLICATE']}</td> <td>{$row['SAMPLE_DATE']}</td>  <td>{$row['CHAIN_CUST']}</td> <td>{$row['COMMENT_']}</td>   <td>{$row['LABORATORY']}</td> <td>{$row['DATE_SENT']}</td> <td>{$row['DATE_RECEIVED']}</td> <td>{$row['SAMP_MATRIX']}</td>  <td>{$row['SAMPLE_CLASS']}</td> <td>{$row['SAMPLE_TYPE']}</td> <td>{$row['SAMPLER_NAME']}</td>  <td>{$row['REF_REPORT']}</td> <td>{$row['ENTERED_BY']}</td>  </tr>  ";
}

$i = $i +1;
}

    echo "     </tbody></table>";
        
$SampleQuery2 = "";
$SampleQuery2 = "select distinct TO_CHAR(ps.STATION) as STATION   from parameter_sample ps, parameter_result pr where ps.sample_id = pr.sample_id {$orClause}" ;
$stid2 = oci_parse($conn, $SampleQuery2);




oci_execute($stid2);




echo "<input type=\"hidden\" id=\"querySampleStationWhere\" value=\" NO_ IN (";


while ($row2 = oci_fetch_array($stid2, OCI_ASSOC+OCI_RETURN_NULLS)) {

  echo " '" . $row2['STATION'] . "', ";
  
}
echo " '0') \"/>";
   
?>