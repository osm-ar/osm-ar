var map;

var feature;
function cargar_mapa() {



	    var osmar = L.tileLayer('http://tile.openstreetmap.com.ar/mapnik/{z}/{x}/{y}.png', {
		    attribution: 'Datos © Colaboradores de OpenStreetMap, Tiles de OSM-Ar'
	    });
	    var osmar2 = L.tileLayer('http://2.tile.openstreetmap.com.ar/osm-tiles/{z}/{x}/{y}.png', {
		    attribution: 'Datos © Colaboradores de OpenStreetMap, Tiles de OSM-Ar #2'
	    });
	    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '© Colaboradores de OpenStreetMap'
	    });

      var baseLayers = {
          "OSM-Ar": osmar,
          "OSM-Ar #2": osmar2,
          "OSM.org": osm
      };

      map = new L.map('map', {
          center: [-34.723,-58.536],
          zoom: 10,
          layers: [osmar]
      });

      L.control.layers(baseLayers).addTo(map);



}

    $(document).ready(function (){



      $('#buscar').bind('click',function(){
        $('#modal-resultados').modal({show:true,backdrop:false});
        var inp = document.getElementById("addr");
        $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
            var items = [];

            $.each(data, function(key, val) {
                bb = val.boundingbox;
                items.push("<p><a href='#' onclick='elegirResultado(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></p>');
            });

		    $('#resultados').empty();
            if (items.length != 0) {
                $('#resultados').html(items.join(''));
            
            } else {
                $('<div/>', { html: "No se encontraron resultados." }).appendTo('#resultados');
            }
           
        });

      });


    });

    function elegirResultado(lat1, lng1, lat2, lng2, osm_type) {
        $('#modal-resultados').modal('toggle');
	    var loc1 = new L.LatLng(lat1, lng1);
	    var loc2 = new L.LatLng(lat2, lng2);
	    var bounds = new L.LatLngBounds(loc1, loc2);

	    if (feature) {
		    map.removeLayer(feature);
	    }
	    if (osm_type == "node") {
		    feature = L.circle( loc1, 16, {color: 'cyan', fill: false}).addTo(map);
            feature.bindPopup(loc1+" ");
		    map.fitBounds(bounds);
		    map.setZoom(18);
	    } else {
		    var loc3 = new L.LatLng(lat1, lng2);
		    var loc4 = new L.LatLng(lat2, lng1);

		    feature = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'red'}).addTo(map);
            feature.bindPopup(loc1+" "+loc1+" "+loc2+" "+loc3);
		    map.fitBounds(bounds);
	    }
    }


window.onload = cargar_mapa;
