function loadCart(){
	$.get("data/users/islogin.php").then(data=>{
	if(data.ok==0)
		location="login.html?back="+location.href;
	else{
		$.get("data/cart/getCart.php").then(items=>{
			var html="",total=0,count=0,checkAll=true;
			if(items.length==0) checkAll=false;
			else{
				for(var p of items){
					html+=`<div class="imfor">
						<div class="check">
							<img src="img/cart/${p.is_checked==1?'product_true.png':'product_normal.png'}" data-iid="${p.iid}" alt="">
						</div>
						<div class="product">
							<a href="product_details.html?lid=${p.lid}">
								<img src="${p.sm}" alt="">
							</a>
							<span class="desc">
								<a href="product_details.html?lid=${p.lid}">${p.title}</a>
							</span>
							<p class="col">
								<span>规格：</span>
								<span class="color-desc">${p.spec}</span>
							</p>
						</div>
						<div class="price">
							<p class="price-desc">阿甲专享价</p>
							<p>
								<b>¥</b><b>${p.price}</b>
							</p>
						</div>
						<div class="num" data-iid="${p.iid}">
							<span class="reduce">-</span>
							<input type="text" value="${p.count}">
							<span class="add">+</span>
						</div>
						<div class="total-price">
							<span>¥</span>
							<span>${(p.price*p.count).toFixed(2)}</span>
						</div>
						<div class="del">
							<a href="#" data-iid="${p.iid}">删除</a>
						</div>
					</div>`;
					if(p.is_checked==1){
						total+=p.price*p.count;
						count+=parseInt(p.count);
					}else{
						checkAll=false;
					}
				}
			}
			
			$("#content-box-body").html(html);
			$(".total,.totalOne").html(count);
			$(".totalPrices,.foot-price").html(total.toFixed(2));
			if(checkAll)
				$(".xz-check_box").addClass("checked");
			else
				$(".xz-check_box").removeClass("checked");
		})
	}
})
}
$(()=>{
	loadCart();
});
$(()=>{
	$("#content-box-body").on("click",".reduce,.add",e=>{
		var $tar=$(e.target);
		var count=$tar.parent().children(":eq(1)").val();
		if($tar.is(".add"))
			count++;
		else
			count--;
		var iid=$tar.parent().data("iid");
		$.get("data/cart/updateCount.php",{iid,count})
			.then(loadCart);
	}).on("click",".del>a",e=>{
		var $tar=$(e.target);
		var iid=$tar.data("iid");
		var title=
		$tar.parent().parent().find(".product>.desc>a").html();
		if(confirm("是否继续删除 "+title+" 吗?"))
			$.get("data/cart/deleteItem.php",{iid})
				.then(loadCart)
	}).on("click",".imfor>.check>img",e=>{
		var $tar=$(e.target);
		var src=$tar.attr("src");
		var iid=$tar.data("iid");
		if(src.endsWith("product_true.png"))
			var is_checked=0;
		else
			var is_checked=1;
		$.get("data/cart/checkItem.php",{iid,is_checked})
			.then(loadCart);
	})

	$(".xz-check_box").click(e=>{
		var check_all=$(e.target).is(".checked")?0:1;
		$.get("data/cart/checkAll.php",{check_all})
			.then(loadCart);
	})
	$(".base>a").click(e=>{
		e.preventDefault();
		if(confirm("是否继续删除?"))
			$.get("data/cart/deleteChecked.php").then(loadCart);
	})
})