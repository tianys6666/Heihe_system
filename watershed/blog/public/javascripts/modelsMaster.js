/**
 * Created by ufeimiya on 16-4-21.
 */

$(function(){
    var map= initMap();

    $('.panel-zoom-in').bind('click',function(){
       if($('.panel-content').is(":visible")){
            $('.panel-content').hide();
            $('#map').addClass('map-wrapper-zoomin');
            map.invalidateSize();
        }
    });
    $('.panel-zoom-out').bind('click',function(){
        $('.panel-content').show();
        $('#map').removeClass('map-wrapper-zoomin');
        map.invalidateSize();
    });
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
            center: [39.308996, 99.833743],
            zoom: 8,
            layers: [normal, image],
            zoomControl: true
        });
        //加载控制面板
        control = L.control.layers(baseLayers).addTo(map);
        return map;
    }

});
