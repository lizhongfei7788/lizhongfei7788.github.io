$(()=>{
	var $form=$("form");
	$("#btn").click(()=>{
		$.post("data/users/login.php",$form.serialize())
			.then(text=>{
			if(text=="false"){
				$form[0].reset();
				alert("用户名或密码不正确!")
			}else{
				alert("登录成功!");
				if(location.search!==""){
					var back=location.search.slice(6);
					location=back;
				}else{
					location="index.html";
				}
			}
		})
	});
	$(window).keyup(e=>{
		if(e.keyCode==13) $("#btn").click();
	})
})