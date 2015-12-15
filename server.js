var express = require('express');
var app = express();

var http = require('http');
var url = require('url');

app.use('/interactive-maps', express.static(__dirname + '/src/main/webapp'));
app.use('/interactive-maps/api', express.static(__dirname + '/src/main/webapp'));
app.use('/ogc-client/rest/json', function (request, response) {

    var endPoint = url.parse(request.query.endpoint);

    var proxy = http.request(endPoint, function (res) {
        res.pipe(response, {
            end: true
        })
    }).on('error', function (err) {
        return(err);
    });

    proxy.setTimeout(10000);

    proxy.on('timeout', function (socket) {
        response.statusCode = 408;
        response.end();
    });

    request.pipe(proxy, {
        end: true
    });
});
app.listen(process.env.PORT || 3000);