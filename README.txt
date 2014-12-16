The purpose of this project was to create an app that would gather cell signal information and store it and display it as a heatmap overlayed on google maps. I used an external JavaScript library called "heatmap.js." 

I did not get a chance to build the custom cordova plug-in needed to grab the signal strength from the android native side. Therefore, I used a random function to simulate the signal strength. It generates a value between 1 and 6 to simulate the 1 to 6 bars. Unfortunately, the value averages out at a single point to around 3.5 since the Geolocaiton watcher pulls data so quickly. 

If you're zoomed out a lot you will just see all the data points blended together rather inaccurately(this is a part of the heatmap.js library that I could not figure out how to change). However, if you zoom in you can see the individual points, and the signal strength at each point becomes more clear. 

I have an "index.html" that is totally blank because phonegap would not build without it but I point the app to a different file in the config.xml.

Running the app:
Once the app has started and the page has loaded it recenters the map at the users location. It the loads in any previously saved data. It then kicks off the geolocation wathcer and the periodic saver. I have it so the data is saved every 10 seconds. I previously had it save after each new data point but it ran far too slow. 

Buttons:
ReDraw: redraws the points on the map(useful if you move the map and the points do not show up)

ERASE ALL DATA: empties the data array and adds a 0 value point at (0,0) and saves(overwrite with the new data). (at least one point must be kept in the array to keep things running smoothly) 

Test Data: Adds 2 test points near the university library to the data array. This can be useful if you think new points are not being generated.

Refresh: reload the entire page incase things get messy

Raw Data: this pops up an alert that displays a string representation of the data array 

ReCenter: recenters the map at the users location.




Works Cited:
I used an external library called heatmap.js they also have a version for google maps called gmaps-heatmap.js that I implemented as well. I could have used the built in google maps heat map function but I found the data structure in the heatmaps.js library easier to work with. The heatmap.js library simply uses an array of javascript objects to store the data.

You can find the documentation for the heatmap.js library at: http://www.patrick-wied.at/static/heatmapjs/

The cell signal bars used in the Icon and splash screen can be found at: http://kevinmehall.net/2009/cell-signal-monitoring

I also used various code snipits from profesor kevins examples.






