<?php
//data/cart/checkItem.php
require_once("../init.php");
@$iid=$_REQUEST["iid"];
@$is_checked=$_REQUEST["is_checked"];
$sql="update xz_shoppingcart_item set is_checked=$is_checked where iid=$iid";
mysqli_query($conn,$sql);