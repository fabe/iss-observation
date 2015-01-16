// Variables
var range = [];
var bool;
var intBool;

var lon = 13.064472900000055;
var lat = 52.3905689;
var apikey = "Kimono API Key goes here";

$.ajax({
	"url": "https://www.kimonolabs.com/api/6vhhybq8?apikey=" + apikey + "&callback=kimonoCallback&lon=" + lon + "&lat=" + lat,
	"crossDomain": true,
	"dataType": "jsonp",
	jsonpCallback: 'kimonoCallback',
	contentType: "application/json"
}).done(function(data) {

	// Write begin of visibility as a string we can use
	var begin = JSON.stringify(data.results.collection1[0].begin);
	begin = begin.slice(7, 15);

	// Write duration of visibility as a string we can use
	var duration = JSON.stringify(data.results.collection1[0].time);
	duration = duration.slice(6, 10);

	// Write current time as a sring we can use
	var d = new Date();
	d.getHours();
	d.getMinutes();
	d.getSeconds();
	var clock = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

	// Count the duration as seconds
	var seconds = parseInt(toSeconds(duration));

	// Split our begin time to Integers
	var apiClock = begin.split(":");
	apiClock[0] = parseInt(apiClock[0]);
	apiClock[1] = parseInt(apiClock[1]);
	apiClock[2] = parseInt(apiClock[2]);

	// Write every second as a timestamp (H:M:S) in range array
	for (var i = 0; i <= seconds; i++) {
		if (apiClock[2] == 59) {
			apiClock[1] = apiClock[1] + 1;
			apiClock[2] = 0;
		} else if (apiClock[1] > 59) {
			apiClock[0] = apiClock[0] + 1;
			apiClock[1] = 0;
			apiClock[2] = 1;
		} 
		else {
			apiClock[2] = apiClock[2] + 1;
		};
		range.push(apiClock[0] + ":" + apiClock[1] + ":" + apiClock[2]);
	};

	// Search for the current time in given time frame
	bool = $.inArray(clock, range) > -1;

	// Convert result to binary
	if (bool == "true") {
		intBool = 1;
	} else {
		intBool = 0;
	}

	// Show result (true or false)
	$(".wrap").append(String("<ul><li>Longitude: " + lon + "</li><li>Latitude: " + lat + "</li></ul>"));
	$(".wrap").append(String("<p id='v' dataType='" + intBool + "'><strong>Result: " + bool + "</strong></p>"));

	// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //
	// Common Functions –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– //
	function toSeconds(str) {
	    var pieces = str.split(":");
	    var result = Number(pieces[0]) * 60 + Number(pieces[1]);
	    return(result);
	}
});