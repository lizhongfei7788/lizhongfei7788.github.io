//在当前页面加载header.html
$(()=>{
	$("#header").load(
		"header.html",
		()=>{//回调函数
			//设置搜索帮助
			$(document.body).on(
				"click",
				"[data-trigger=search]",
				function(){
					var $a=$(this);
					var $txtSearch=$a.prev().children(".txtSearch");
					if($txtSearch.val().trim()!=="")
						location="products.html?kw="+$txtSearch.val().trim();
					else
						location="products.html";
				}
			);
			$(document.body).on(
				"keyup",
				".txtSearch",
				e=>{
					var $txtSearch=$(e.target);
					var $shelper=$txtSearch.prev();
					switch(e.keyCode){
						case 13:
							$txtSearch.parent().next().click();//模拟触发!
							break;					
						case 38:
							if(!$shelper.is(":has(.focus)"))
								$shelper.children().last()
									.addClass("focus")
							else if($shelper.children().first().is(".focus"))
								$shelper.children().removeClass("focus")
									.last().addClass("focus");
							else
								$shelper.children(".focus").removeClass("focus")
									.prev().addClass("focus")
							$(".txtSearch").val(
								$shelper.children(".focus")
									.children().first().html()	
							)
							break;
						case 40:
							if(!$shelper.is(":has(.focus)"))
								$shelper.children().first()
									.addClass("focus")
							else if($shelper.children().last().is(".focus"))
								$shelper.children().removeClass("focus")
									.first().addClass("focus");
							else
								$shelper.children(".focus").removeClass("focus")
									.next().addClass("focus")
							$(".txtSearch").val(
								$shelper.children(".focus")
									.children().first().html()	
							)
							break;
						default:
							if($txtSearch.val().trim()!==""){
								$(".txtSearch").val($txtSearch.val());
								$.get(
									"data/products/autocomplete.php",
									{term:$txtSearch.val().trim()}
								).then(data=>{
									var html="";
									for(var p of data){
										html+=`<li>
											<div class="search-item" title="${p.title}">${p.title}</div>
										</li>`;
									}
									$txtSearch.prev().html(html).show();
								})
							}
					}
				}
			)
			var search=location.search;//?kw=mac i7 256g
			if(search.indexOf("kw")!=-1)
				$(".txtSearch").val(
					decodeURI(search.split("=")[1])
				);

			//登录状态
			function isLogin(){
				$.get("data/users/islogin.php")
					.then(data=>{
					if(data.ok==0){
						$("[data-toggle=loginList]").show()
							.next().hide();
					}else{
						$("[data-toggle=loginList]").hide()
							.next().show()
								.find("[data-name=uname]")
									.html(data.uname);
					}
				})
			}
			isLogin();
			$(document.body).on(//为登录按钮绑定事件
				"click",
				"[data-toggle=loginList]>li:last-child>a",
				e=>{
					var $tar=$(e.target);
					location="login.html?back="+location.href;
				}
			);
			$(document.body).on(
				"click",
				"[data-toggle=welcomeList]>li:last-child>a",
				e=>{
					$.get("data/users/logout.php").then(()=>{
						location.reload(true);
					})
				}
			);
		}
	)
});
//为页面添加滚动事件
$(()=>{
	$(window).scroll(()=>{
		var scrollTop=$(window).scrollTop();
		if(scrollTop>=60+385){
			$("#header-top").clone(true)
				.addClass("fixed_nav")
				.appendTo(document.body);
		}else{
			$(".fixed_nav").remove();
		}
	})
})