const express = require("express");
const app = express();

const port = process.env.PORT || 8080;
var APP_VERSION = '1.1';
var APP_COLOUR = 'yellow'; // change me
 var APP_LOOP = 2000;
var APP_COMPUTE = 12;
var HOSTNAME = require('os').hostname();

function redirect(service, port, optionalurl) {
	const request = require('request');
	console.log ("Generation of redirect function");
	const f =  function (req, res) {
		var endpoint = optionalurl? optionalurl : req.url;
		var url = 'http://' + service + ':' + port + endpoint; 
		console.log ("Redirect to "+url);
		request(url, { json: true }, (err, response, body) => {
			if (err) {
				console.log(err);
				body = { "error": "an error occcured " }
			}
			res.send(body);
		});
	};
	return f;
}
function fib(n) {
	if (n < 3) return 1;
	return fib(n - 1) + fib(n - 2);
}
function returnIndex   (req, res) {
	res.sendFile(__dirname + "/index.html");
}

var count = 0;
app.get("/", returnIndex);
app.get("/index.html", returnIndex);
app.get("/usage.html", returnIndex);
app.get('/newtest', redirect ('localhost', port, '/newtest1') );
app.get("/newtest1", function (req, res) {
	var response = { 
		"count": count++,
		"redirect": 'true' 
	};  
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(JSON.stringify(response, undefined, 4));
});
app.get("/test", function (req, res) {
	var response = {
		"hostname": HOSTNAME + '-' + process.pid,
		"version": APP_VERSION,
		"colour": APP_COLOUR, 
		"count": ++count,
		"stack": 'node.js',  
		"loop": APP_LOOP,
		"compute": 'fib(' + APP_COMPUTE + ')'
	};
	var start = new Date(); 
	var c = APP_LOOP;
	while (c--) fib(APP_COMPUTE);
	var end = new Date();
	response.time = end - start;

	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.send(JSON.stringify(response, undefined, 4));
});
app.get("/terminate", function     (req, res) {
	process.exit(-1);
});

app.listen(port, function () {
	console.log("Hello world listening on port", port);
});

