<?php
//data/cart/clearCart.php
require_once("../init.php");
session_start();
@$uid=$_SESSION["uid"];
$sql="delete from xz_shoppingcart_item where user_id=$uid";
mysqli_query($conn,$sql);