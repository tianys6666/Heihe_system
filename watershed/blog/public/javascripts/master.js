/*

*/
$(function(){

	var openedArea =null;
	init();

	$('.area-list').bind("click",function(){
		var currentArea = $(this);

		// this is used for Judge whether click same area
		if(openedArea!==null){
			if(openedArea.find('a').text()!==currentArea.find('a').text()){
				openedArea.next().hide();
				openedArea.next().find('li').each(function(){
					$(this).find('input').prop("checked",false);
				});
				$('.main-right-introduction').find('.area-name').remove();
				$('.main-right-introduction').find('.map-name').remove();
			}
		}
		//if the map-list is displayed ,enter the if branch
		//it the map-list is non-displayed ,enter the else branch 
		if($(this).next().is(":visible")){
			//make the checked status initialization
			$(this).next().find('li').each(function(){
				$(this).find('input').prop("checked",false);
		  });
			//hide the map-list
			$(this).next().hide();
			openedArea=null;
			$('.main-right-introduction').find('.map-name').remove();
		}

		else{
			openedArea=currentArea;
			//judge whether the main-right directory has had the areaname,
			//if it has had,delete it  
			if($('.main-right-introduction').find('.area-name')){
				$('.main-right-introduction').find('.area-name').remove();
				$('.main-right-introduction').find('.map-name').remove();
			}
			//if it has not had,create it 
			$('.main-right-introduction').find('#selected-name')
			.after('<mark class="area-name">'+currentArea.find('a').text()+'/  </mark> ');
			//show the map-list
			$(this).next().show();
		}
	});

	$('.map-item').bind("click",function(event){

		var selectedStatus;
		var selectedMap
		var mapList= new Array();

		selectedStatus=$(this).find('input[type=checkbox]');
		selectedMap=$(this).find('label');

		if(selectedStatus.is(':checked')==false){
			if(event.target.tagName =='INPUT'){
				event.preventDefault();
				return;
			}
			selectedStatus.prop("checked",true);

			$('.main-right-introduction').find('.area-name')
			.after('<mark class="map-name">  '+selectedMap.find('a').text()+'  </mark> ');
		}

		else{
			if(event.target.tagName=='INPUT'){
				event.preventDefault();
				return;
			}
			selectedStatus.prop("checked",false);
			var mapName = selectedMap.find('a').text();

			$('.main-right-introduction').find('mark').each(function(){
				mapList[mapList.length]=$(this);
			})
			for(var i=0;i<mapList.length;i++){
				var tmp = $(this).find('a').text();
				// console.log('  '+tmp+'  ');
				// console.log(mapList[i].text());
				// console.log(mapList[i].text()=='  '+tmp+'  '?true:false);
				if(mapList[i].text()=='  '+tmp+'  '){
					mapList[i].remove();
					console.log(mapList.length);
				}
			}

		}
	});

	function init(){
		var mapHeight=$(document).find('.main-right-canvas').height();
		console.log(mapHeight);
	}
});