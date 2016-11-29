
proj4.defs("EPSG:3577", "+proj=aea +lat_1=-18 +lat_2=-36 +lat_0=0 +lon_0=132 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

var content = document.getElementById('popup-content');

var l_bbox;
var latlong;

var dataObj = [];
var dataPart = new Object;
var g_bandData = [];
var g_count = 0;
var l_divideBy = 10000;

runQuery(116.431, -31.523);

function runQuery(l_lat, l_long)
	{
	alert(1);
		
	var l_result;

	var coordinate = evt.coordinate;
	
	//Tile index function, used to translate the tile index select. This should not be a client side function, but will do for now.
	var l_tileIndex = function(metres) {return Math.floor(metres / 100000)};
	
	var tile = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:3577').map(l_tileIndex);
	//var l_spatialTransform = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
		
	l_spatialTransform = [l_lat,l_long]
	//http://dapds00.nci.org.au/thredds/ncss/uc0/rs0_dev/all_the_ncmls/LS5_TM_NBAR/LS5_TM_NBAR_-11_-36.ncml?req=station&var=blue&var=green&var=nir&var=red&var=swir1&var=swir2&temporal=all&accept=csv&latitude=-32&longitude=121
	
	var l_wmsURL = "http://dapds00.nci.org.au/thredds/wms/uc0/rs0_dev/misc_test/LS8_OLI_TIRS_NBAR_3577_" + tile[0] + "_" + tile[1] + ".ncml";
	//var l_wmsURL = "http://dapds00.nci.org.au/thredds/ncss/uc0/rs0_dev/all_the_ncmls/LS5_TM_NBAR/LS5_TM_NBAR_" + tile[0] + "_" + tile[1] + ".ncml";
	var l_getCapURL = l_wmsURL + "?service=WMS&version=1.3.0&request=GetCapabilities";
		
	//GetCapabilities of tile
	var l_parser = new ol.format.WMSCapabilities();
	
	deleteGraph();
	
	console.log(l_spatialTransform);
	
	content.innerHTML = '<p>You clicked on coord:</p><code>' + l_spatialTransform + '</code>';
	content.innerHTML += '<p>You clicked on tile:</p><code>' + tile + '</code>';
	content.innerHTML += ("<p>Getting Capabilities with url:</p><code>" + l_getCapURL + "</code>");

	fetch(l_getCapURL).then(function(l_response) {
		return l_response.text();
		}).then(
		function(text) {
			var l_result = l_parser.read(text);
			l_sensorbands = [];
			for (let cap_layer of l_result.Capability.Layer.Layer[0].Layer) 
				{
				l_sensorbands.push(cap_layer.Name)
				}
			content.innerHTML += ("<p>Got results with bands:</p><code>" + l_sensorbands + "</code>")
			var l_times = l_result.Capability.Layer.Layer[0].Layer[0].Dimension[0].values

			var l_aBit = 0.00001
			var l_bbox = (l_spatialTransform[0]-l_aBit) + "%2C" + (l_spatialTransform[1]-l_aBit) + "%2C" + (l_spatialTransform[0]+l_aBit) + "%2C" + (l_spatialTransform[1]+l_aBit)
			//content.innerHTML += ("<p>Got timestamps:</p><code>" + l_times.split(',').length + "</code>");
			g_bandData = [];

			g_count = 0;
			
			content.innerHTML += ("<p>Processing results</p>");
			
			for (let l_sensorname of l_sensorbands) 
				{					
				var l_getFeatureInfoURL = l_wmsURL + "?LAYERS="+l_sensorname+"&QUERY_LAYERS="+l_sensorname+"&TIME="+l_times+"&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&FORMAT=text%2Fxml&SRS=EPSG%3A4326&bbox="+l_bbox+"&X=0&Y=0&INFO_FORMAT=text%2Fxml&WIDTH=1&HEIGHT=1"
				//l_getFeatureInfoURL = l_sensorname+".xml"
				fetch(l_getFeatureInfoURL).then(function(l_response) {
				return l_response.text();
				}).then(
				function(l_response) 
					{					
					doc = ol.xml.parse(l_response)
					var l_parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse
					node = doc.childNodes[0]
					for (var i = 0, ii = node.children.length; i < ii; i++) 
						{
						var layer = node.children[i];
						if (layer.nodeName !== "FeatureInfo") {	continue; }
						ts = layer.children[0].innerHTML;
						ts = l_parseDate(ts);
						val = layer.children[1].innerHTML;
						val = parseFloat(val/l_divideBy);
						//l_bandNumber = parseInt(l_sensorname.substr(l_sensorname.indexOf("_")+1));
						g_bandData.push({band: l_sensorname,time: ts, value: val})
						}
					//onNewData(l_sensorname, g_bandData)
					g_count += 1;
					
					if (g_count == l_sensorbands.length) createGraph1(g_specName);						
					});				
				}
	});

  //For each variables
    //GetFeatureInfo

  //ol.format.WMSGetFeatureInfo
  overlay.setPosition(coordinate);
}
