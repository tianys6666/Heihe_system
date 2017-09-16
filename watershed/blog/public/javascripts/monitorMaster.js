/*
	monitorMaster.js是用于对monitor.ejs进行js绑定
	对界面进行操作，所有和界面进行操作的都绑定在JQuery中,
	对leaflet进行操作，定义多个leaflet方法
	对界面记性初始化
	
	author: zhaoRui， gaorui ，tianyunsheng
*/
$(function(){

	initNavcontent();
	var map = initMap();
	var count = 0;
	var layers;

	var openedArea = null;
	var maplayers = new Array();
	var pointName = null;
	var pointObject = null;
	var changePoint = null;

	//存储显示点的效果的配置
	var iIcon = L.icon({
		iconUrl: '/images/marker-icon1.png',
		iconSize: [10.5, 18],
		iconAnchor: [12, 26],
		popupAnchor: [0, -28]
	});

	var iIcon1 = L.icon({
		iconUrl: '/images/icon1.png',
		iconSize: [10.5, 18],
		iconAnchor: [12, 26],
		popupAnchor: [0, -28]
	});

	var iIconPump = L.icon({
		iconUrl: '/images/icon2.png',
		iconSize: [10.5, 18],
		iconAnchor: [12, 26],
		popupAnchor: [0, -28]
	});
	var rDrag = {
		o: null,
		target: null,
		init: function(target, o) {
			this.target = target;
			o.onmousedown = this.start;
		},
		start: function(e) {
			var o;
			e = rDrag.fixEvent(e);
			e.preventDefault && e.preventDefault();
			rDrag.o = o = this;
			console.log(this);
			o.x = e.clientX - rDrag.target.offsetLeft;
			o.y = e.clientY - rDrag.target.offsetTop;
			document.onmousemove = rDrag.move;
			document.onmouseup = rDrag.end;
		},
		move: function(e) {
			e = rDrag.fixEvent(e);
			var oLeft, oTop;
			oLeft = e.clientX - rDrag.o.x;
			oTop = e.clientY - rDrag.o.y;
			rDrag.target.style.left = oLeft + 'px';
			rDrag.target.style.top = oTop + 'px';
		},
		end: function(e) {
			e = rDrag.fixEvent(e);
			rDrag.o = document.onmousemove = document.onmouseup = null;
		},
		fixEvent: function(e) {
			if (!e) {
				e = window.event;
				e.target = e.srcElement;
				e.layerX = e.offsetX;
				e.layerY = e.offsetY;
			}
			return e;
		}
	};
	/*========================界面绑定事件===============================*/
	//树形结构一级地区目录的绑定事件：1）隐藏下拉菜单 2）对右面显示名称进行变动 3）切换一级地区目录  4）加载地区的geoJson数据
	$('.area-list').bind("click", function() {
		var currentArea = $(this);
		var areaname = currentArea.find('a').text();
		if (count == 0) {
			layers = initAreaData(areaname);
			count = 1;
		}
		setXY(map);

		// this is used for Judge whether click same area
		if (openedArea !== null) {
			if (openedArea.find('a').text() !== currentArea.find('a').text()) {
				openedArea.next().hide();
				openedArea.next().find('li').each(function() {
					$(this).find('input').prop("checked", false);
				});
				$('.main-right-introduction').find('.area-name').remove();
				$('.main-right-introduction').find('.map-name').remove();
			}
			//
			removeall(map, layers, maplayers);
		}
		//if the map-list is displayed ,enter the if branch
		//it the map-list is non-displayed ,enter the else branch 
		if ($(this).next().is(":visible")) {
			//make the checked status initialization
			$(this).next().find('li').each(function() {
				$(this).find('input').prop("checked", false);
			});
			//hide the map-list
			$(this).next().hide();
			//
			removeall(map, layers, maplayers);
			openedArea = null;
			$('.main-right-introduction').find('.map-name').remove();
		} else {
			openedArea = currentArea;
			//judge whether the main-right directory has had the areaname,
			//if it has had,delete it  
			if ($('.main-right-introduction').find('.area-name')) {
				$('.main-right-introduction').find('.area-name').remove();
				$('.main-right-introduction').find('.map-name').remove();
			}
			//if it has not had,create it 
			$('.main-right-introduction').find('#selected-name')
				.after('<mark class="area-name">' + currentArea.find('a').text() + '/  </mark> ');
			//show the map-list
			$(this).next().show();
		}
	});
	//树形结构二级地图目录的绑定事件：1）操作二级地图目录 2）对右面显示名称进行变动 3）显示地图
	$('.map-item').bind("click", function(event) {

		var selectedStatus;
		var selectedMap;
		var mapName;
		var mapList = new Array();

		selectedStatus = $(this).find('input[type=checkbox]');
		selectedMap = $(this).find('label');

		if (selectedStatus.is(':checked') == false) {
			if (event.target.tagName == 'INPUT') {
				event.preventDefault();
				return;
			}
			selectedStatus.prop("checked", true);

			$('.main-right-introduction').find('.area-name')
				.after('<mark class="map-name">  ' + selectedMap.find('a').text() + '  </mark> ');

			mapName = selectedMap.find('a').text();
			addLayers(layers, mapName, map, maplayers);
		} else {
			if (event.target.tagName == 'INPUT') {
				event.preventDefault();
				return;
			}
			selectedStatus.prop("checked", false);
			mapName = selectedMap.find('a').text();

			//
			map.removeLayer(layers[mapName]);

			$('.main-right-introduction').find('mark').each(function() {
				mapList[mapList.length] = $(this);
			})
			for (var i = 0; i < mapList.length; i++) {
				var tmp = $(this).find('a').text();
				// console.log('  '+tmp+'  ');
				// console.log(mapList[i].text());
				// console.log(mapList[i].text()=='  '+tmp+'  '?true:false);
				if (mapList[i].text() == '  ' + tmp + '  ') {
					mapList[i].remove();
				}
			}
		}
	});

	$('#map').bind('click', function(e) {
		if ($('#datapanel').is(':visible')) {
			$('#datapanel').css('display', 'none');
			if (changePoint!=null) {
				changePoint.setIcon(iIcon);
			}
		}
	});
	$('.leaflet-control-layers').bind('click', function(e) {
		stopPropagation(e);
	});

	var obj = document.getElementById('datapanel');
	var obj2 = document.getElementById('datapanel-header');
	rDrag.init(obj, obj2);
	$('#echartPanel1').bind("mousedown", function(e) {
		console.log(e);
	});

	$('#datapanel').bind('click', function(e) {
		stopPropagation(e);
	});
	/*=======================================*/
	/*========================界面初始化相关函数==================================*/
	function initMap() {
		var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
				maxZoom: 18,
				minZoom: 5
			}),
			normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
				maxZoom: 18,
				minZoom: 5
			}),
			imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
				maxZoom: 18,
				minZoom: 5
			}),
			imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
				maxZoom: 18,
				minZoom: 5
			});
		var normal = L.layerGroup([normalm, normala]),
			image = L.layerGroup([imgm, imga]);

		//leaflet中选择影像和正常
		var baseLayers = {
			"地图": normal,
			"影像": image
		};
		var overlayLayers = {};
		//加载底图
		var map = L.map("map", {
			center: [39.249421, 119.859402],
			zoom: 7,
			layers: [normal, image],
			zoomControl: true
		});
		//加载控制面板
		control = L.control.layers(baseLayers).addTo(map);
		return map;
	}

	function initNavcontent() {
		$.ajax({
			type: 'get',
			async: false,
			url: '/readArea',
			dataType: 'json',
			success: function(areas) {
				for (var i = 0; i < areas.length; i++) {
					$('.list-identify').append('<li class="list-group-item area-list">' +
						'<span class="glyphicon glyphicon-list item-prefix-icon" aria-hidden="true"></span>' +
						'<a>' + areas[i].district + '</a>' +
						'<span class="glyphicon glyphicon-menu-down item-postponed-icon" aria-hidden="true"></span>' +
						'</li>' +
						'<ul class="list-group map-list">');
					var directory = stringToObject(areas[i].directory);
					for (var j = 0; j < directory.length; j++) {
						$('.map-list:eq(' + i + ')').append('<li class="list-group-item map-item">' +
							'<form class="list-item">' +
							'<label>' +
							'<input type="checkbox" class="item-checkbox" id="item-checkbox">' +
							'<span class="glyphicon glyphicon-picture item-prefix-icon" aria-hidden="true"></span>' +
							'<a>' + directory[j].Name + '</a>' +
							'</label>' +
							'</form>' +
							'</li>');
					}
					$('.list-group').append("</ul>");
				}
			}
		});
	}

	function initGeoJsonLayer(name, data) {
		if (name == 'geofeature') {
			var layer = L.geoJson(data, {
				style: boundstyle
			});
			return layer;
		}
		if (name == 'irrigation') {
			var layer = L.geoJson(data, {
				style: irrstyle
			});
			return layer;
		}
		if (name == 'obswell') {
			var layer = L.geoJson(data, {
				pointToLayer: function(feature, latlng) {
					return L.marker(latlng, {
						icon: iIcon
					});
				}
			});
			layer.on('click', function(e) {
				if (changePoint!=null) {
					changePoint.setIcon(iIcon);
				}
				changePoint = e.layer;
				e.layer.setIcon(iIcon1);
				clickObswell(e);
			});
			layer.on('mouseover',function(e){
				pointObject = e.layer;
				overPoint(e);
				e.layer.bindPopup(pointName);
				e.layer.openPopup();
				pointName = null;
			});
			layer.on('mouseout',function(e){
				pointObject.closePopup();
			});
			return layer;
		}
		if (name == 'pumpwell') {
			var layer = L.geoJson(data, {
				pointToLayer: function(feature, latlng) {
					return L.marker(latlng, {
						icon: iIconPump
					});
				}
			});
			return layer;
		}
		if (name == 'channel') {
			console.log(data);
			var layer = L.geoJson(data, {
				style: channelStyle
			});
			return layer;
		}
	}
	/*========================================================*/
	//边界样式设定
	function boundstyle(feature) {
		return {
			fillColor: '#007EA7',
			weight: 2,
			opacity: 0.5,
			color: 'white',
			dashArray: '2',
			fillOpacity: 0.3
		}
	}
	//灌区样式设定
	function irrstyle(feature) {
		return {
			fillColor: '#007EA7',
			weight: 3,
			opacity: 1,
			color: 'white',
			dashArray: '2',
			fillOpacity: 0.5
		}
	}

	function channelStyle(feature) {
		return {
			color: '#EE4000',
			weight: 3
		}
	}
	/*============================================================================*/
	//该函数中将调用ajax,实现一级目录的点击事件，添加地区数据
	function initAreaData(areaname) {
		var areadata;
		params = {
			areaname: areaname
		};
		var data = $.ajax({
			type: 'post',
			async: false,
			url: '/readGeoJson',
			contentType: "application/json;charset=utf-8",
			data: JSON.stringify(params),
			dataType: 'json',
			success: function(msg) {
				areadata = msg.text;
			},
			error: function() {
				alert('error');
			}
		});
		data = stringToObject(data.responseText);
		var layers = {
			obswell: initGeoJsonLayer('obswell', stringToObject(data.text.obswell)),
			irrigation: initGeoJsonLayer('irrigation', stringToObject(data.text.irrigation)),
			channel: initGeoJsonLayer('channel', stringToObject(data.text.channel)),
			bound: initGeoJsonLayer('geofeature', stringToObject(data.text.geofeature)),
			pumpwell: initGeoJsonLayer('pumpwell', stringToObject(data.text.pumpwell))
		};
		return layers;
	}
	//该函数实现从后台传入观测点具体信息，包括介绍，年份数据
	function overPoint(event){
		var temp = {};
		temp.lat = event.latlng.lat;
		temp.lng = event.latlng.lng;
		$.ajax({
			type: 'post',
			async: false,
			url: '/readPointName',
			contentType: 'application/json;charest = utf-8',
			data: JSON.stringify(temp),
			dataType: 'json',
			success: function(msgn) {
				// console.log(msgn.pointdataName.name);
				pointName = msgn.pointdataName.name;
			},
			error: function(msgn) {
				console.log(err);
			}
		});
		// console.log(aa);
	}
	function clickObswell(event) {
		var params = {};
		console.log(event.originalEvent);
		params.lat = event.latlng.lat;
		params.lng = event.latlng.lng;
		$.ajax({
			type: 'post',
			url: '/readPoint',
			contentType: 'application/json;charest = utf-8',
			data: JSON.stringify(params),
			dataType: 'json',
			success: function(msg) {
				showpPanel(msg.pointdata, event);
			},
			error: function(msg) {
				console.log(err);
			}
		});
	}

	function showpPanel(data, event) {
		//初始化数据面板和echart内容
		var mindata = data.data[0];
		var maxdata = data.data[0];
		var yearData = new Array();
		var monthData = new Array();
		var yearDate = new Array();
		var monthDate = new Array();

		var sum = 0;
		for (var i = 0; i < data.data.length; i++) {
			if (mindata > data.data[i]) {
				mindata = data.data[i];
			}
			if (maxdata < data.data[i]) {
				maxdata = data.data[i];
			}
			monthData.push(data.data[i]);
			if (i % 12 == 11) {
				sum += data.data[i];
				yearData.push((sum / 12).toFixed(3));
				//alert(sum/12);
				sum = 0;
			} else {
				sum += data.data[i];
			}
		}
		for (var i = 1984; i <= 2006; i++) {
			yearDate.push(i);
			for (var j = 1; j <= 12; j++) {
				monthDate.push(i + "-" + j);
			}
		}
		$('#obswell-name').html("<h3>抽水井:" + data.name + "</h3>");
		$('#obswell-lng').html("<strong>经度：" + data.lng + "</strong>");
		$('#obswell-lat').html("<strong>维度：" + data.lat + "</strong>");
		$('#obswell-alt').html("<strong>海拔：" + data.alt + "</strong>");
		$('#obswell-max').html("<strong>历史最高水位：" + maxdata.toFixed(3) + "</strong>");
		$('#obswell-min').html("<strong>历史最低水位：" + mindata.toFixed(3) + "</strong>");

		var mychart_year = echarts.init(document.getElementById('echartPanel1'));
		var mychart_month = echarts.init(document.getElementById('echartPanel2'));
		var option_year = {
			title: {
				text: '黑河地下水年变化',
			},
			tooltip: {
				tigger: 'axis'
			},
			legend: {
				data: ['年均水位']
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: yearDate
			}],
			yAxis: [{
				type: 'value',
				axisLabel: {
					formatter: '{value} m'
				},
				min: mindata.toFixed(0),
				max: maxdata.toFixed(0)
			}],
			series: [{
				name: '年平均水位',
				type: 'line',
				data: yearData
			}],
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
		};
		var option_mongth = {
			title: {
				text: '黑河地下水月变化',
			},
			tooltip: {
				tigger: 'axis'
			},
			legend: {
				data: ['月均水位']
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar', 'stack', 'tiled']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: monthDate
			}],
			yAxis: [{
				type: 'value',
				axisLabel: {
					formatter: '{value} m'
				},
				min: mindata.toFixed(0),
				max: maxdata.toFixed(0)
			}],
			dataZoom: [{
				type: 'inside',
				start: 0,
				end: 10
			}, {
				start: 0,
				end: 10
			}],
			series: [{
				name: '月平均水位',
				type: 'line',
				data: monthData,
				itemStyle: {
					normal: {
						color: 'rgb(255, 70, 131)'
					}
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgb(255, 158, 68)'
						}, {
							offset: 1,
							color: 'rgb(255, 70, 131)'
						}])
					}
				}
			}],
		};
		mychart_year.setOption(option_year);
		mychart_month.setOption(option_mongth);
		//初始化datapaenl位置
		console.log(event);
		console.log($('datapanel'));
		$('#datapanel').css('left', event.originalEvent.layerX - 570 + 'px');
		$('#datapanel').show();
	}

	/*========================地图操作等的函数定义=====================================*/
	//更改地图中心坐标以及zoom级别
	function setXY(map) {
		var latlng = L.latLng(39.249421, 99.859402);
		map.setView(latlng, 9);
	}

	//加载图层
	function addLayers(layers, name, map, maplayers) {
		layers[name].addTo(map);
		maplayers.push(name);
	}
	//删除指定数组元素
	function remove_maplayers(layers, name, map, maplayers) {
		var index = -1;
		for (var i = 0, len = maplayers.length; i < len; i++) {
			if (maplayers[i] == name) {
				index = i;
				break;
			}
		}
		map.removeLayer(layers[name]);
	}
	//删除所有图层
	function removeall(map, layers, maplayers) {
		for (var i = 0, len = maplayers.length; i < len; i++) {
			map.removeLayer(layers[maplayers[i]]);
		}
	}
	//------------------------------------------------------------------------------------//
	/*============================*/
	//string转换成object
	function stringToObject(json) {
		return eval("(" + json + ")");
	}
	//jquery阻止事件冒泡
	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
});