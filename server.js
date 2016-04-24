var express = require('express'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	JsonDB = require('node-json-db'),
	app = express();

var db = new JsonDB("jsonDataBase", true, false);

//
// Define the port to use
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//
// Define the different routes we support
app.get('/', function(request, response) {
	response.sendFile('index.html');
});

app.get('/scores', function(request, response) {
    response.send(JSON.stringify(topScores()));
});
app.post('/scores', function(request, response) {
    var score = request.body.newScore;
	addScore(score);
    response.send(JSON.stringify(topScores()));
});

//
// Get the server created and listening for requests
http.createServer(app).listen(app.get('port'), function() {
	console.log('TowerDefense server listening on port ' + app.get('port'));
});

/////////////////////////////////////////////////////////////////////////
//HighScores

var highScores = (function(){
	try {
		return db.getData("/scores");
	} catch(error) {
		return [];
	}
}());

function persistHighScores(){
	db.push("/scores",highScores);
}

function addScore(score) {
	highScores.push(score);
	highScores.sort(function(a,b){return b-a;});
	// persistHighScores();
}

function removeScore(index) {
	if(0<index && index<highScores.length){
		highScores.splice(index,1);
		// persistHighScores();
	}
}

function clearScores() {
	highScores = [];
	// persistHighScores();
}

function topScores(){
	return highScores.slice(0,3);
}

//////////////////////////////////////////////////////////////////////////////
//On Exit

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
	persistHighScores();

    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
