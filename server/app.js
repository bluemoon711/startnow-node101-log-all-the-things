//import { METHODS } from 'http';

const express = require('express');
const fs = require('fs');
const app = express();

var log = {};
var csv = require('csv');

let logHeaders = ["Agent", "Time", "Method", "Resource", "Version", "Status"+ "\n"];
fs.writeFile('log.csv', logHeaders, 'utf8', function() {});


//The toISOString() method returns a string in simplified extended ISO format (ISO 8601) 
//'Request HTTP Version: ', req.httpVersion
app.use((req, res, next) => {
// write your logging code here
//need to replace , to nothing in the "agent" part!
    
    let formattedData = [
        req.headers['user-agent'].replace(/,/g, ''),
        new Date().toISOString(),
        req.method,
        req.path,
        'HTTP/' + req.httpVersion,
        res.statusCode
    ].join(',') + '\n';

   
    console.log(formattedData);

    fs.appendFile('log.csv', formattedData, 'utf8', function() {});
    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('log.csv', 'utf8', function(err, csv) {
        var lines = csv.split('\n');
        var result = [];
        var headers = lines[0].split(',');
        for (var i = 1; i < lines.length; i++) {
             var obj = {};
             var data = lines[i].split(',');
             for (var j = 0; j < data.length; j++) {
                obj[headers[j]] = data[j];
             }
             if (obj.Agent !== '') result.push(obj);
        }
        res.json(result);  
    });


});

module.exports = app;
