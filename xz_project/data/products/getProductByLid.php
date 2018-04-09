<?php
//data/products/getProductByLid.php
header("Content-Type:application/json");
require_once("../init.php");
@$lid=$_REQUEST["lid"];
$output=[
	//"product"=>{ lid, family_id, title, ...},
	//"specs"=>[ {lid:1, spec:xxx}, {lid:2, spec:xxx}, ...],
	//"imgs"=>[{sm:xxx,md:xxx,lg:xxx},xxx]
];
if($lid){
	$sql="SELECT * FROM xz_laptop where lid=$lid";
	$result=mysqli_query($conn,$sql);
	$product=mysqli_fetch_all($result,1)[0];
	$output["product"]=$product;
	$family_id=$product["family_id"];
	$sql="SELECT lid, spec FROM xz_laptop where family_id=$family_id";
	$result=mysqli_query($conn,$sql);
	$output["specs"]=mysqli_fetch_all($result,1);
	$sql="SELECT * FROM xz_laptop_pic where laptop_id=$lid";
	$result=mysqli_query($conn,$sql);
	$output["imgs"]=mysqli_fetch_all($result,1);
}
echo json_encode($output);