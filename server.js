var express = require('express');
var app = express();

var http = require('http');

app.use('/interactive-maps', express.static(__dirname + '/src/main/webapp'));
app.use('/interactive-maps/api', express.static(__dirname + '/src/main/webapp'));
app.listen(process.env.PORT || 3000);