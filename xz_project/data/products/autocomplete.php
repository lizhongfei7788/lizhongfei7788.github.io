<?php
header("Content-Type:application/json");
require_once("../init.php");
//$sql="select title as label from xz_laptop";
$sql="select lid,title,sold_count from xz_laptop";
@$kw=$_REQUEST["term"];
if($kw){
	$kws=explode(" ",$kw);
	for($i=0;$i<count($kws);$i++){
		$kws[$i]=" title like '%".$kws[$i]."%' ";
	}
	$where=" where ".implode(" and ",$kws);
	$sql.=$where;
}
$sql.=" order by sold_count desc limit 10 ";
$result=mysqli_query($conn,$sql);
echo json_encode(mysqli_fetch_all($result,1));