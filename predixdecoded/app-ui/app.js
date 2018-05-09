'use strict';
var appname = 'My Awesome Microapp';

var express = require('express');
//var rp = require('request-promise');
var errors = require('request-promise/errors');
var serveStatic = require('serve-static');
var proxy = require('express-request-proxy');
var debug = require('debug')('app');
var app = express();
var router = express.Router();

var endPoints ={};
var assetPath;
var userPath;
var vcap;

if(process.env.VCAP_SERVICES){
  vcap= JSON.parse(process.env.VCAP_SERVICES);
}


if(vcap){
  var userProvided = vcap["user-provided"];
  if(userProvided){
    userProvided.forEach(function (arrayItem){
      endPoints[arrayItem.name] = arrayItem.credentials.uri;
    });
  }
}

//apm-ext-microservice-predixdecoded
//if(endPoints && endPoints["apm-ext-microservice-dev"]){
//  assetPath = endPoints["apm-ext-microservice-dev"];
/*************************************

HACK4LYFE


*************************/
if(endPoints && endPoints["apm-ext-microservice-predixdecoded"]){
  assetPath = endPoints["apm-ext-microservice-predixdecoded"];
  console.log("APM_EXT_SERVICE_BASE_URL is being read from VCAP_SERVICES");
  assetPath= "https://apm-ext-microservice-predixdecoded.run.aws-usw02-pr.ice.predix.io/v1";
} else {
  console.log("APM_EXT_SERVICE_BASE_URL is not set");
  if (process.env.AUTHTOKEN && process.env.TENANT) {
    //assetPath = "https://apm-ext-microservice-hackapm.run.aws-usw02-pr.ice.predix.io/v1";
    assetPath= "https://apm-ext-microservice-predixdecoded.run.aws-usw02-pr.ice.predix.io/v1";
  } else {
    assetPath = "http://localhost:8080/v1";
  }
}

console.log("assetPath", assetPath);

//app.use(serveStatic('public'));
function setCacheControl(res, path) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
}
app.use('/', serveStatic('public', {
	setHeaders: setCacheControl
}));

// Note: If you're not running behind an app hub, you'll need to add an
//       'Authorization' and tenant headers to any authenticated service requests.
//       For example, if you set an environment variables called
//       'AUTHTOKEN' and TENANT you need to get Headers as below:
function getHeaders() {
   if(process.env.AUTHTOKEN && process.env.TENANT) {
       let headers = {
         'Authorization': process.env.AUTHTOKEN,
         'tenant': process.env.TENANT
        }
        console.log('Headers:', headers);
        return headers;
   }
   console.log('Headers: null');
    return null;
}
let myHeaders = getHeaders();

app.use('/timeseries/*', (req, res, next) => {
  proxy({
    url: 'https://apm-timeseries-services-hackapm.run.aws-usw02-pr.ice.predix.io/v1' + '/*',
    headers: {'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3ODI3ZjIyOC1jZWEyLTRhZjMtYmIzNC0yYzFjMTcyOTk5NmEiLCJzdWIiOiI2MjM0YWIxYS1kMGY5LTRhZDItOWMzNy1kYWVhMmI1NTk5ODMiLCJzY29wZSI6WyJwYXNzd29yZC53cml0ZSIsIm9wZW5pZCJdLCJjbGllbnRfaWQiOiJpbmdlc3Rvci45Y2YzM2NlMzdiZjY0YzU2ODFiNTE1YTZmNmFhZGY0NyIsImNpZCI6ImluZ2VzdG9yLjljZjMzY2UzN2JmNjRjNTY4MWI1MTVhNmY2YWFkZjQ3IiwiYXpwIjoiaW5nZXN0b3IuOWNmMzNjZTM3YmY2NGM1NjgxYjUxNWE2ZjZhYWRmNDciLCJncmFudF90eXBlIjoicGFzc3dvcmQiLCJ1c2VyX2lkIjoiNjIzNGFiMWEtZDBmOS00YWQyLTljMzctZGFlYTJiNTU5OTgzIiwib3JpZ2luIjoidWFhIiwidXNlcl9uYW1lIjoiY3JlYW0tdXNlciIsImVtYWlsIjoiY3JlYW1AZ2UuY29tIiwiYXV0aF90aW1lIjoxNDY5NDUyMjA5LCJyZXZfc2lnIjoiMjYwYTE4OTMiLCJpYXQiOjE0Njk0NTIyMDksImV4cCI6MTQ2OTUzODYwOSwiaXNzIjoiaHR0cHM6Ly9kOWVmMTA2Yy03MDQ4LTQ4NmUtYTc5Zi05YzgwODI3YjhhMTQucHJlZGl4LXVhYS5ydW4uYXdzLXVzdzAyLXByLmljZS5wcmVkaXguaW8vb2F1dGgvdG9rZW4iLCJ6aWQiOiJkOWVmMTA2Yy03MDQ4LTQ4NmUtYTc5Zi05YzgwODI3YjhhMTQiLCJhdWQiOlsiaW5nZXN0b3IuOWNmMzNjZTM3YmY2NGM1NjgxYjUxNWE2ZjZhYWRmNDciLCJwYXNzd29yZCIsIm9wZW5pZCJdfQ.SMJBMeg-OGXiywy7nVOdiNKTNAOMVtEKuAxMsOqQmnO9GTsNPfn6oRF3__O36GQo39RZqnCVy8GcXe76z5DxELnCkwcoNfCaoXg1AsAdIItyCJOkmyb05o3_PsMG4pT0EIcLCMbvIwLYG1iGorGM4VBNR6Saon5PW_rANcU1oJFC_ABDbCL5U9AuWQZJw6PHvIPbGaWW6X_S8VmuQvrt8qi-_rfqPj5NJeTxwVoLRoUTgFT0RZhslv0T2_V3ZJpsj3Pdv2KKBEp5EKeKDfFXbi4M4tdf2thH9zCbyipKYsJD0y0kUn79nEqokJF-HmeCrYY1ry7s-X0oKr_HKBtFBw',
        'tenant': 'EBEF3763E5784244A217299524AF8F64',
        'Content-Type': 'application/json'},
    timeout: parseInt(req.headers.timeout) || 3600000
  })(req, res, next);
});

app.use('/heatmap_summary/*', (req, res, next) => {
  proxy({
    url: 'https://spiderman-heatmap-ingestor.run.aws-usw02-pr.ice.predix.io/api' + '/*',
    //url: 'http://localhost:3000/api' + '/*',
    headers: {},
    timeout: parseInt(req.headers.timeout) || 3600000
  })(req, res, next);
});

app.use('/api/*', (req, res, next) => {
  proxy({
    url: assetPath + '/*',
    headers: myHeaders,
    timeout: parseInt(req.headers.timeout) || 3600000
  })(req, res, next);
});

app.use(function (req, res, next) {
  console.log('page not found - request url', req.hostname + ':' + port + req.originalUrl);
  res.render('not-found.html');
});

app.use(function (err, req, res, next) {
  console.log('error - request url', req.hostname + ':' + port + req.originalUrl);
  console.error('err', err);
  res.render('error.html');
});

// Need to let CF set the port if we're deploying there.
var port = process.env.PORT || 9000;
app.listen(port);
console.log(appname + ' started on port ' + port);
