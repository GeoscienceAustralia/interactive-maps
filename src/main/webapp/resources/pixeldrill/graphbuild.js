console.log("vg.version", vg.version);

var vis, theSpec, data;
var g_specName = "graphspec1.json";

//ANSWER https://groups.google.com/forum/#!topic/vega-js/U2WiPBlfO-Y

var sample_data1 = [
		{"band":"band1","time":"2013-03-29T02:05:01.814Z","value":24},
		{"band":"band1","time":"2013-04-13T02:07:15.840Z","value":43},
		{"band":"band1","time":"2013-04-29T02:07:14.125Z","value":135},
		{"band":"band1","time":"2013-05-31T02:07:31.256Z","value":560},
		{"band":"band2","time":"2013-03-29T02:05:01.814Z","value":30},
		{"band":"band2","time":"2013-04-13T02:07:15.840Z","value":143},
		{"band":"band2","time":"2013-04-29T02:07:14.125Z","value":95},
		{"band":"band2","time":"2013-05-31T02:07:31.256Z","value":630}		
		];

//{"type": "filter", "test": "datum.band != 'band_1'"}
var templateFilter = {"type": "filter", "test": ""}
		
// load the spec
function loadSpec() {
	d3.json("graphspec.json", function(_) {
	  theSpec = _;
	  initVis(theSpec);
	})
}

// initialize the vis
function initVis(theSpec) {
  console.log("spec", theSpec);
  vg.parse.spec(theSpec, function(chart) { 
    d3.select("#spec").property("value", JSON.stringify(theSpec, null, 2))
    vis = chart({el:"#vis", renderer: "svg"}).update();
  });  
}

// attach button handler to mutate data
d3.select("#deleteData").on("click", function() {
	this.blur();
	deleteGraph();
	})

function deleteGraph()
	{
	try
		{
		vis.data("NBRT").remove(function(d) {return true})
		vis.update(); // the x axis doesn't seem to recalculate after new data load
		}
	catch (err)
		{		
		}
	}

var vegaSpec;
// attach button handler to mutate data
d3.select("#changeData").on("click", function() {
	g_specName = "graphspec1.json";
	createGraph1(g_specName);	
})

var g_bandFilter = "band_1";

var tempFilter;

function createGraph1(theSpecName)
	{
	//content.innerHTML += g_count;
	d3.json(theSpecName, function(_) {
		vegaSpec = _;
		vegaSpec["data"][0]["values"] = g_bandData;

		/*tempFilter = vegaSpec["data"][0]["transform"];		
		templateFilter.test = "datum.band != 'band_1'";
		vegaSpec["data"][0]["transform"] = tempFilter.push(templateFilter);*/
		
		vg.parse.spec(vegaSpec, function(chart) { 
		d3.select("#spec").property("value", JSON.stringify(vegaSpec, null, 2))
		vis = chart({el:"#vis", renderer: "svg"}).update();
		});  
		//this.blur();
		//vis.data("NBRT").remove(function(d) { false }).insert(data1);
		//vis.data("NBRT").values(data1);
		vis.update();
		})
	}

d3.select("#changeData2").on("click", function() {
	g_specName = "graphspec2.json";
	createGraph1(g_specName);
	});

/*	d3.json("graphspec2.json", function(_) {
	  vegaSpec = _;
	  vegaSpec["data"][0]["values"] = g_bandData;
	  vg.parse.spec(vegaSpec, function(chart) { 
		d3.select("#spec").property("value", JSON.stringify(vegaSpec, null, 2))
		vis = chart({el:"#vis", renderer: "svg"}).update();
	  });  
		//this.blur();
		//vis.data("NBRT").remove(function(d) { false }).insert(data1);
		//vis.data("NBRT").values(data1);
		vis.update();
	})
})*/

d3.select("#resetData").on("click", function() {
	loadSpec()
})

loadSpec();
