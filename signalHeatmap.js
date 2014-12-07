/*signalHeatmap.js
javascript file responsible for getting geo and signal data implementing and saving it
Cory Lotz
12/7/2014
CSCI N 300

*/

//constant for signal strength maximum
var SIGNAL_MAX = 6

//constant for zoom level
var ZOOM_LEVEL = 17

//constant for coordinat decimal places
var COORDS_LENGTH = 4

//array for heatmap data
var data = [];

//wait for stuffs to load
document.addEventListener("deviceready", onDeviceReady, false);

var watchID = null;


	

function onDeviceReady(){
	
	//time out if new update is recieved every 30 seconds
	
	var options = {timeout: 30000};
	watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);	
	alert("entered onDeviceReady")
}//end on dev ready

//function to redraw map
function reDraw(){

	alert("redraw")
	
	
	var testData = {
	  max: SIGNAL_MAX,
	  data: data
	};

	addData(39.7736, -86.171536, 6)
	addData(39.7734, -86.171536, 6)
	
	heatmap.setData(testData)
	heatmap.draw()
	
	
}//end reDraw



//function to save array of data objects

	//serialize each object in array as text and add them to the text file
	
	

//function to get gps data and add data to array of signal data objects
// onSuccess Geolocation
//
function onSuccess(position) {
	//get signal strength
	var signal = getSignalStrength()
	alert("entered onSuccess")
	
	//get coordinates
	var lat = position.coords.latitude
	var lng = position.coords.longitude
	
	//tunicate coords to COORDS_LENGTH decimal places
	lat = lat.toFixed(COORDS_LENGTH)
	lng = lng.toFixed(COORDS_LENGTH)
	
	//pass data to add data function
	addData(lat, lng, signal)
}

// onError Callback receives a PositionError object
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}


//function to get signal strength (random value until plugin completed)
function getSignalStrength(){
	//generate random signal strength
	var signal = Math.floor((Math.random() * 6) + 0)
	
	//return it
	return signal
}
	



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
	//create new latlng variable
	 var treeLatlng = new google.maps.LatLng(41.9, -87.630197)
	//set map options
	var mapOptions = {
		zoom: 17,
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
	
	addData(39.7736, -86.171536, 4)
	
	
	var testData = {
	  max: SIGNAL_MAX,
	  data: data
	};

	heatmap.setData(testData);

}



//load map and heatmap
google.maps.event.addDomListener(window, 'load', initialize);