function loadPage(pageNo=1){
	var pageSize=9;
	//拼查询字符串
	var query={pageNo,pageSize};
	var search=location.search;//?kw=mac i7
	if(search!==""){
		query.kw=decodeURI(search.split("=")[1]);
	}
	console.log(query);
	$.get("data/products/getProductsByKw.php",query)
		.then(result=>{
		var {pageNo, pageCount, data}=result
		var html="";
		for(var p of data){
			html+=`<li>
            <a href="product_details.html?lid=${p.lid}">
              <img src="${p.md}" alt="">
            </a>
            <p>
              ¥<span class="price">${p.price}</span>
              <a href="product_details.html?lid=${p.lid}">${p.title}</a>
            </p>
            <div>
              <span class="reduce">-</span>
              <input type="text" value="1">
              <span class="add">+</span>
              <a href="javascript:;" data-lid="${p.lid}" class="addCart">加入购物车</a>
            </div>
          </li>`
		}
		document.getElementById("show-list")
			.innerHTML=html;
		html=`<a href="javascript:;" class='${pageNo==1?"previous disabled":"previous"}'>上一页</a>`;
		for(var i=1;i<=pageCount;i++){
			html+=`<a href="javascript:;" class=${pageNo==i?"current":""}>${i}</a>`
		}
		html+=`<a href="javascript:;" class='${pageNo==pageCount?"next disabled":"next"}'>下一页</a> `;
		document.getElementById("pages").innerHTML=html;
	})
}
function loadCart(){
	$.get("data/users/islogin.php").then(data=>{
		if(data.ok==1){
			$.get("data/cart/getCart.php")
			.then(items=>{
				var html="", total=0;
				for(var p of items){
					html+=`<div class="item">
						<span title="${p.title}">${p.title}</span>
						<div data-iid="${p.iid}">
							<span class="reduce">-</span>
							<input type="text" value="${p.count}">
							<span class="add">+</span>
						</div>
						<p>
							<span>¥${(p.price*p.count).toFixed(2)}</span>	
						</p>
					</div>`;
					total+=p.price*p.count;
				}
				$(".cart_content").html(html);
				$("#total").html(total.toFixed(2))
			});
		}
	})	
}
$(()=>{
	loadPage();
	loadCart();
});
$(()=>{//分页
	var divPages=document.getElementById("pages");
	divPages.onclick=e=>{
		var tar=e.target;
		if(tar.nodeName=="A"
			&&!/disabled|current/.test(tar.className)){
			var i=1;
			if(/previous/.test(tar.className)){
				//获得divPages下class为current的a的内容转为整数保存在i中
				var a=divPages.querySelector(".current");
				i=parseInt(a.innerHTML)-1;//i-1
			}else if(/next/.test(tar.className)){
				//获得divPages下class为current的a的内容转为整数保存在i中
				var a=divPages.querySelector(".current");
				i=parseInt(a.innerHTML)+1;//i+1
			}else{//获得tar的内容转为整数保存在i中
				i=parseInt(tar.innerHTML);
			}//用i为pageNo重新加载当前页面
			loadPage(i);
		}
	};
});
$(()=>{//商品列表中单击按钮
	$("#show-list")//改为用jquery实现加减
		.on("click",".reduce,.add",e=>{
			var $tar=$(e.target);
			//查找tar的父元素下的第二个子元素input
			var $input=$tar.parent().children(":eq(1)");
			//获得input的内容，转为整数保存在n
			var n=parseInt($input.val());
			//如果tar的className为add
			if($tar.is(".add"))
				n++;//n++
			else if(n>1)//否则 如果n>1
				n--;//n--
			//将n保存回input的内容中
			$input.val(n);
		})
		//在27行插入:data-lid="${p.lid}"
		.on("click",".addCart",e=>{
			var $tar=$(e.target);
			$.get("data/users/islogin.php")
				.then(data=>{
				if(data.ok==0)
					location="login.html?back="+location.href;
				else{
					var lid=$tar.data("lid"),
							count=$tar.prev().prev().val();
					$.post("data/cart/addCart.php",{lid,count})
						.then(loadCart);
					$tar.prev().prev().val(1);
				}
			})
		});
});
$(()=>{//购物车操作
	//50行: 添加: data-iid="${p.iid}"
	$("#cart")
		.on("click",".reduce,.add",e=>{
			var $tar=$(e.target);
			var count=$tar.parent().children(":eq(1)").val();
			if($tar.is(".add"))
				count++;
			else
				count--;
			var iid=$tar.parent().data("iid");
			$.get("data/cart/updateCount.php",{iid,count})
				.then(loadCart);
		})
		.on("click",".title>a",e=>{
			e.preventDefault();
			$.get("data/cart/clearCart.php").then(()=>{
				$(".cart_content").empty();
				$("#total").html("0.00");
			});
		})
})