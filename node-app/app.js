require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss.l" });

var express = require("express");
var bodyParser = require("body-parser");
var b = require('bonescript');

///////////////////////
var MOTOR  = 'P8_8';
var ROCKER = 'P8_10';

// set to output, turn off, monitor rocker switch
b.pinMode(MOTOR, b.OUTPUT);
b.digitalWrite(MOTOR, b.LOW);
b.pinMode(ROCKER, b.INPUT);

// watch the rocker switch
var db = debounce(function() {
    if (rotations == 0) { return; }
    console.log("Rotations left: " + (rotations-1));
    rotations--;
    if (rotations <= 0) {
        // stop the motor, thanks!
        b.digitalWrite(MOTOR, b.LOW);
    }
}, 350);
b.attachInterrupt(ROCKER, true, b.CHANGE, db);

// The main show
rotations = 0;
function rotate(cnt) {
    rotations = cnt;
    b.digitalWrite(MOTOR, b.HIGH);
}
///////////////////////

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname+'/home.html');
});

app.get("/rotate/:count", function(req, res) {
    var count = req.params.count;
    var isInt = /^\d+$/.test(count);
    if (!isInt) {
        var m = {"result": "error", "message": "Invalid count"};
        res.status(500);
    }
    else {
        rotate(count);
        var m = {"result":"success", "message": "rotating", "count": count};
    }
    res.send(m);
    console.log(m)
});

// start 'er up
var server = app.listen(9090, function () {
    console.log("Listening on port %s...", server.address().port);
});

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
