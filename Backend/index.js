var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

app.get('/', function(req, res) {
    res.sendFile(__dirname+"/index.html");
});

app.get('/api', function(req, res) {
    if (req.query.hasOwnProperty("q")) {
        res.json({ message: req.query.q });
    } else {
        res.json({ message: 'Hello world!' });
    }
});

app.get('/api', function(req, res) {
    res.json({ message: req.query.q });   
});

app.listen(port);
console.log('Magic happens on port ' + port);


