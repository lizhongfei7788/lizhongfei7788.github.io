<?php
//data/cart/addCart.php
require_once("../init.php");
session_start();
@$uid=3;//$_SESSION["uid"];
@$lid=$_REQUEST["lid"];
@$count=$_REQUEST["count"];
$sql="select * from xz_shoppingcart_item where user_id=$uid and product_id=$lid";
$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_row($result);
if($row==null)
	$sql="insert into xz_shoppingcart_item (user_id, product_id, count, is_checked) values ($uid,$lid,$count,0)";
else
	$sql="update xz_shoppingcart_item set count=count+$count where user_id=$uid and product_id=$lid";
mysqli_query($conn,$sql);