/*signalHeatmap.js
javascript file responsible for getting geo and signal data implementing and saving
Cory Lotz
12/7/2014 - 12/15/2014
CSCI N 300

*/

//constant for signal strength maximum
var SIGNAL_MAX = 6

//constant for zoom level
var ZOOM_LEVEL = 14


//constant for coordinat decimal places
var COORDS_LENGTH = 4

//array for heatmap data
var data = [];

//wait for stuffs to load
document.addEventListener("deviceready", onDeviceReady, false);

var watchID = null;


	

function onDeviceReady(){
	
	//recenter the map at the users location
	reCenter()
	

	//load up old data
	loadData()
	
		
	//start watching location
	getLocation()
	
	//save the data periodically
	periodicSave()
	

	
	
}//end on dev ready

//function to redraw map
function reDraw(){

	
	
	var testData = {
	  max: SIGNAL_MAX,
	  data: data
	};//end test data

	
	heatmap.setData(testData)
	heatmap.draw()
	
}//end reDraw

//function to save the data every 10 seconds
function periodicSave(){
	setInterval(saveData, 10000)
	
}



//function to save array of data objects
function saveData(){
	
	//serialize each object in array as text and add them to the text file
	var dataAsText = JSON.stringify(data)
	
//	alert(dataAsText)
	
	//Regular Write Code ( modified from prof kevins exampe)

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    

    function gotFS(fileSystem) {
		var filename = "signalData";
			fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.write(dataAsText);
    }
	
}	//end file writing

//function to bring data in from text file
function loadData(){
	
	

	////Read and Show Code (modified from professor kevins example)
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSRead, fail);
	

	function gotFSRead(fileSystem) {
		var filename =  "signalData";
			fileSystem.root.getFile(filename, null, gotFileEntryRead, fail);
	}

	function gotFileEntryRead(fileEntry) {
		fileEntry.file(gotFileRead, fail);
	}

	function gotFileRead(file){		
		readAsText(file);
	}

	function readAsText(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			var dataAsTextOut = evt.target.result;
			
//			alert("tester" + dataAsTextOut)
			
			data = JSON.parse(dataAsTextOut);
			
//			alert(JSON.stringify(data))
			
			
		};
		reader.readAsText(file);
	}
	
	reDraw()
		
}//end file reading


 function fail(error) {
	alert("File Error:" + error.code);
}
 

//html geolocation
function getLocation() {
    if (navigator.geolocation) {
		navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy: true, maximumAge:2000});
    } 
	else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


//function to get gps data and add data to array of signal data objects
function onSuccess(position) {
	//get signal strength
	var signal = getSignalStrength()
	
	
	//get coordinates
	var lat = position.coords.latitude
	var lng = position.coords.longitude
	
	//tunicate coords to COORDS_LENGTH decimal places
	lat = lat.toFixed(COORDS_LENGTH)
	lng = lng.toFixed(COORDS_LENGTH)
	
	//pass data to add data function
	addData(lat, lng, signal)
	
	//save data to file -now done periodically elswhere
//	saveData()
	
	//redraw the map
	reDraw()
	
	
}//end on sucess



// onError Callback receives a PositionError object
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}//end on error



//function to get signal strength (max value until plugin completed)
function getSignalStrength(){
	//generate random signal strength between 6 and 1
	var signal = Math.floor((Math.random() * 6) + 1);
	console.log(signal)
	//return it
	return signal
}//end get signal
	



//funciton to add data to array of signal data objects
function addData(lat, lng, signal){

	//boolean determining if lat lng point is not a duplicate
	var notDuplicate = true
	
	//check if there is a value at that data lat lng point
	for(i =0; i < data.length; i++){
		//if there is average the data then update the data at that point
		//if data at the lat check the lng
		if(lat == data[i].lat){			
			//if data at lng average signal strength
			if(lng == data[i].lng){	
				//change not duplicate to false
				notDuplicate = false
				//take current strength and mult by point counter atribute
				var signalWeighted = data[i].signal * data[i].points
				//increment point counter attibute
				data[i].points++				
				//add mult number to given signal and divide my counter attribute
				data[i].signal = (signalWeighted + signal)/(data[i].points);		
				
			}//end if
		}//end if
	}//end for
	
	//if not duplicate add the new point and data to object array
	if(notDuplicate){		
		//create new object at end of array and add data to new object and set point counter to 1
		var newObj = {lat: lat, lng: lng, signal: signal, points: 1};
		
		//add the new object to the end of the array
		data[data.length] = newObj	
		
	}//end if
}//end addData



//funciton to initalize google maps and heat map
function initialize() {
	
	//set map options
	var mapOptions = {
		zoom: ZOOM_LEVEL,
		center: new google.maps.LatLng(39.773778, -86.171536)
	};
	//place map in the html doc
	map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions);


	// heatmap layer
	heatmap = new HeatmapOverlay(map,
	  {
		// radius should be small ONLY if scaleRadius is true (or small radius is intended)
		"radius": 10,
		"maxOpacity": 1, 
		// scales the radius based on map zoom
		"scaleRadius": false, 
		// if set to false the heatmap uses the global maximum for colorization
		// if activated: uses the data maximum within the current map boundaries 
		//   (there will always be a red spot with useLocalExtremas true)
		"useLocalExtrema": false,
		// which field name in your data represents the latitude - default "lat"
		latField: 'lat',
		// which field name in your data represents the longitude - default "lng"
		lngField: 'lng',
		// which field name in your data represents the data value - default "value"
		valueField: 'signal'
	  }
	);
	
		

	
	
	var testData = {
	  max: SIGNAL_MAX,
	  data: data
	};

	heatmap.setData(testData);

}//end initalize

function addTest(){
	addData(39.7736, -86.171536, 6)
	addData(39.7736, -86.171436, 6)
	
	

}

function clearData(){
	data = [];
	addData(0,0,0)
	
	//overwrite previous file data
	saveData()
}

function rawData(){
	//output current data as text
	alert(JSON.stringify(data))
	
	
}

function reCenter(){
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(reCenterGmap, onError, {maximumAge:6000});
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
	
}

function reCenterGmap(position){
	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(pos);
		
	reDraw()
		
	
		
}//end reCenter

//load map and heatmap
google.maps.event.addDomListener(window, 'load', initialize);
