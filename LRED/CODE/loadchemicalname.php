
<?php

$name=  urldecode($_GET['name']);




if ($name == "") { 
echo "";
exit;
}

$conn = oci_connect('username', 'password', 'instancename', 'AL32UTF8');
if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}


$chemicalNameQuery = "";


$chemicalNameQuery = "select distinct TO_CHAR(CHEMICAL_NAME) as CHEMICAL_NAME from PARAMETER_RESULT where  CHEMICAL_NAME IS NOT NULL and UPPER(family) like UPPER('%{$name}%') order by 1";


$stid = oci_parse($conn, $chemicalNameQuery);


oci_execute($stid);


    echo "<select id=\"chemicalName\" onClick=\"selectChemical();\" style=\"\" multiple>";

while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {

echo "            <OPTION value=\"{$row['CHEMICAL_NAME']}\">{$row['CHEMICAL_NAME']}</OPTION>";

}



    echo "    </SELECT>";
        
        


?>