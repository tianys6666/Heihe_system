$(document).ready(function(){

	function refresh(){
    	window.location.reload();	//刷新当前页面.
    
    //或者下方刷新方法
    //parent.location.reload()刷新父亲对象（用于框架）--需在iframe框架内使用
    // opener.location.reload()刷新父窗口对象（用于单开窗口
  	//top.location.reload()刷新最顶端对象（用于多开窗口）
	}

	$("#submit-1").bind('click',null,function(){

		var params = {
			username:$("#name-1").val(),
			password:$("#password-1").val()
		};

		if (params.username === ""|| params.password === "") 
		{	
			$('#jimModal').modal('show');
			$('#err1').html("Please enter name and pass")
					  .css({color:"red"});

		}
		else
		{

		$.ajax({
      		type: "POST",
      		url:'/form1',
      		dataType:"json",
            data:JSON.stringify(params),
      		contentType: "application/json; charset=utf-8",
   			success: function(msg) {
   				if(msg.codeId === 0){
	            	$('#err1').html(msg.text)
            				  .css({color:"red"});
            	}
            	else if (msg.codeId === 1)
            	{
            		$('#jimModal').modal('toggle');
            		refresh();
            	}
			/*        
			$('#jimModal').modal('toggle'); */            
			},
            error: function(err) {
/*            	已修改后台json回调方式 */
/*            	if (err.status == 200) 
            	{
            		$('#jimModal').modal('toggle');
            		refresh();
            	}
       			else
       			{
       				var msg = 'Status: ' + err.status + ': ' + err.responseText;
        			alert(msg);
        		}*/
        		var msg = 'Status: ' + err.status + ': ' + err.responseText;
        		alert(msg);
            }
			});
		}
	});

	$("#submit-2").bind('click',null,function(){

		$('#jimModal').modal('hide');

		var params = {
			username: $("#name-2").val(),
			password: $("#password-2").val(),
			repeat:$("#repeat-2").val(),
			email:$("#email-2").val()
		};

		if (params.username === "") {
			$('#jimModal1').modal('show');
			$('#err2').html("Please enter username")
					  .css({color:"red"});			
		}
		else if (params.password === "") {
			$('#jimModal1').modal('show');
			$('#err2').html("Please enter password")
					  .css({color:"red"});			
		}
		else if (params.repeat === "") {
			$('#jimModal1').modal('show');
			$('#err2').html("Please enter repeat-password")
					  .css({color:"red"});		
		}
		else if (params.email === "") {	
			$('#jimModal1').modal('show');
			$('#err2').html("Please enter email")
					  .css({color:"red"});
		}
		else if (params.password != params.repeat) {
			$('#jimModal1').modal('show');
			$('#err2').html("Passwords must be the same.")
					  .css({color:"red"});
		} else {

		$.ajax({
      		type: "POST",
      		url:'/form2',
      		dataType:"json",
            data:JSON.stringify(params),
      		contentType: "application/json; charset=utf-8",
   			success: function(msg) {
   				if(msg.codeId === 0){
            		$('#err2').html(msg.text)
            				  .css({color:"red"});
            	} else if( msg.codeId === 1)
            	{

            		//$('#jimModal1').modal('toggle');
            		alert("进来了没有？");

            		
            		setTimeout(function(){
            		$.ajax({
      					type: "POST",
      					url:'/form1',
      					dataType:"json",
   						data:JSON.stringify(params),
      					contentType: "application/json; charset=utf-8",
   						success: function(msg) {
   						if(msg.codeId === 0){
	            		$('#err1').html(msg.text)
            					  .css({color:"red"});
            			}
            			else if (msg.codeId === 1)
            			{
            			$('#jimModal').modal('toggle');
            			refresh();
            			} 
						},
            			error: function(err) {
        				var msg = 'Status: ' + err.status + ': ' + err.responseText;
        				alert(msg);
            			}
					});
            		},100);
					
            	} 
			/* $('#jimModal').modal('toggle'); */            
			},
            error: function(err) {
       			var msg = 'Status: ' + err.status + ': ' + err.responseText;
        		alert(msg);
            }
			});

		}

	});  // #submit-2

});