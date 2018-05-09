var express = require('express');
var app = express();
var url = require('url');
var request = require('request')

// Setting up express server port
var config = {
  express: {
    port: process.env.VCAP_APP_PORT || 3000
  }
};

var vcapsServices = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : undefined;
console.log(vcapsServices);

var server = app.listen(config.express.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log (`Server Started at ${host}:${port}`);
});

app.use('/api',function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var startDate = new Date(query.startDate);
  var endDate = new Date(startDate.getTime() + (1000*60*60*24*7) - 1);

  var options = {
    method: 'post',
    body: {"name":"filter1","defaultFilterSet":false,"filters":[{"operation":"eq","operand2":["OrchestrationManager"],"operand1":{"builderClass":"com.ge.apm.filtering.impl.SimpleFilterQueryBuilder","displayName":"Source","entity":"PROFILE","path":"LowHeatRate","type":"STRING","operand2Translations":{"OrchestrationManager":"profile.source.central","SmartSignal":"profile.source.sscentral"},"operationTranslations":{"eq":"filters.operation.equals","not(eq)":"filters.operation.notEquals"},"possibleEnumValues":[{"label":"Central","selectionValues":["OrchestrationManager"]},{"label":"SSCentral","selectionValues":["SmartSignal"],"isSelected":true}]}}]}, // Javascript object
    json: true, // Use,If you are sending JSON data
    url: 'https://apm-alarm-management-hackapm.run.aws-usw02-pr.ice.predix.io/v1/alarms/filter?fields=name,incident.firstOccurance,incident.lastOccurance,incident.incidentEventCount,tagsOfInterest.uuid,severity,incident.incidentEventCount&page=0&pageSize=20&sortField=storageReceiveTime&sortOrder=desc',
    headers: {
      'Authorization': 'bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI2ODNmYTEyNS1kNGNmLTQ4ODItOWQyOC0wOTMyNjdmNDQ5ZTQiLCJzdWIiOiI0OTZlOTQ1Yi03NjA4LTRlYjctOTFhOC0yODk0OTk1YmIwMjgiLCJzY29wZSI6WyJwYXNzd29yZC53cml0ZSIsIm9wZW5pZCJdLCJjbGllbnRfaWQiOiJpbmdlc3Rvci45Y2YzM2NlMzdiZjY0YzU2ODFiNTE1YTZmNmFhZGY0NyIsImNpZCI6ImluZ2VzdG9yLjljZjMzY2UzN2JmNjRjNTY4MWI1MTVhNmY2YWFkZjQ3IiwiYXpwIjoiaW5nZXN0b3IuOWNmMzNjZTM3YmY2NGM1NjgxYjUxNWE2ZjZhYWRmNDciLCJncmFudF90eXBlIjoicGFzc3dvcmQiLCJ1c2VyX2lkIjoiNDk2ZTk0NWItNzYwOC00ZWI3LTkxYTgtMjg5NDk5NWJiMDI4Iiwib3JpZ2luIjoidWFhIiwidXNlcl9uYW1lIjoiY3JlYW1tZ3IiLCJlbWFpbCI6ImNyZWFtQGdlLmNvbSIsImF1dGhfdGltZSI6MTQ2OTQwNDAzMSwicmV2X3NpZyI6ImU0MmVhZTgwIiwiaWF0IjoxNDY5NDA0MDMxLCJleHAiOjE0Njk0OTA0MzEsImlzcyI6Imh0dHBzOi8vZDllZjEwNmMtNzA0OC00ODZlLWE3OWYtOWM4MDgyN2I4YTE0LnByZWRpeC11YWEucnVuLmF3cy11c3cwMi1wci5pY2UucHJlZGl4LmlvL29hdXRoL3Rva2VuIiwiemlkIjoiZDllZjEwNmMtNzA0OC00ODZlLWE3OWYtOWM4MDgyN2I4YTE0IiwiYXVkIjpbImluZ2VzdG9yLjljZjMzY2UzN2JmNjRjNTY4MWI1MTVhNmY2YWFkZjQ3IiwicGFzc3dvcmQiLCJvcGVuaWQiXX0.jlgMoXYoyHaDxBK_OsUdxM9iD6AtQrXnUawtehBZVrfnMXCKVGY8g7JY99wJYJ7nJMWacvSP9Locb4O387uyCRppdkj_RsoBfuBcZyaow3FfF7PgHqwMe_H23Iqavtx0jYfJkxIH0dmk1L0WHG27o220XvMvs-DAj9HtqXIZ1EpTyhglE3Vep4VRKHUg0ZfjnZh6XNVARngFHT88pydvBn8Ygf65DFp-wEb76hbe9Itpvan8VrQgh2ewsdrEv2ahhjo2qw_V4z8bBifyZ-vd3eyWK7IurkQA_QN82xBB_O0cCe0Dsde_jNB_s3nAfFQ4VezXRJLAMZgA6pw3kTxpDA',
      'tenant': 'EBEF3763E5784244A217299524AF8F64',
      'Content-Type': 'application/json;charset=UTF-8',
      'Cache-Control': 'no-cache'
    }
  }

  request(options, function (err, res2, body) {
    if (err) {
      console.log('Error :', err);
      return;
    }
    alarmData=body;
    console.log('APM data retrieved successfully');
    var summaryData = []; // d 1-7, h 1-24
    // var startDate = new Date('2016-07-25T00:00:00.000Z');

    var days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

    // Create empty summary json
    var day=1;
    days.forEach(function(d) {
      var hour=1;
      times.forEach(function(h) {
        summaryData.push({"day":day, "hour":hour,"value": 0});
        hour++;
      });
      day++;
    });

    //console.log(summaryData);

    alarmData.content.forEach(function (d) {
      var incident = d.incident;
      if (incident) {
        var start = new Date(incident.firstOccurance);
        var end = new Date(incident.lastOccurance);
        var count = JSON.parse(incident.incidentEventCount);
        if (start >= startDate && end <= endDate) {
          //console.log("Kept", start);
          var secondsDifference = (start - startDate)/1000;
          var hoursDifference = secondsDifference/60/60;
          var daysDifference = hoursDifference/24;

          var wholeDays=Math.floor(daysDifference);
          var wholeHours = Math.floor(hoursDifference - (24*wholeDays));

          var arrayCount= (wholeDays * 24) + wholeHours -1;
          // hack4lyfe. thanks hicharts
          if (count > 300) {
            summaryData[arrayCount].value = 300;
          } else {
            summaryData[arrayCount].value += count;
          }
          //console.log(start, startDate, wholeDays,wholeHours, count);
        } else {
          //console.log("Discarded", start);
        }
      }
    });

    res.send(JSON.stringify(summaryData));

  });

});









  // alarmData =
  // {
  //   "content": [
  //     {
  //       "id": 40,
  //       "name": "LowHeatRate",
  //       "severity": 3,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T16:37:45",
  //         "lastOccurance": "2016-07-25T16:37:55",
  //         "incidentEventCount": "1"
  //       }
  //     },
  //     {
  //       "id": 39,
  //       "name": "LowHeatRate",
  //       "severity": 1,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T16:37:25",
  //         "lastOccurance": "2016-07-25T16:37:35",
  //         "incidentEventCount": "8"
  //       }
  //     },
  //     {
  //       "id": 38,
  //       "name": "LowHeatRate",
  //       "severity": 1,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T16:37:15",
  //         "lastOccurance": "2016-07-25T16:37:25",
  //         "incidentEventCount": "10"
  //       }
  //     },
  //     {
  //       "id": 37,
  //       "name": "LowHeatRate",
  //       "severity": 1,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T16:37:05",
  //         "lastOccurance": "2016-07-25T16:37:15",
  //         "incidentEventCount": "9"
  //       }
  //     },
  //     {
  //       "id": 36,
  //       "name": "LowHeatRate",
  //       "severity": 3,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T15:31:42",
  //         "lastOccurance": "2016-07-25T15:31:52",
  //         "incidentEventCount": "2"
  //       }
  //     },
  //     {
  //       "id": 32,
  //       "name": "LowHeatRate",
  //       "severity": 3,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T14:47:21",
  //         "lastOccurance": "2016-07-25T14:47:31",
  //         "incidentEventCount": "2"
  //       }
  //     },
  //     {
  //       "id": 33,
  //       "name": "LowHeatRate",
  //       "severity": 3,
  //       "incident": {
  //         "firstOccurance": "2016-07-25T14:47:21",
  //         "lastOccurance": "2016-07-25T14:47:31",
  //         "incidentEventCount": "2"
  //       }
  //     },
  //     {
  //       "id": 17,
  //       "name": "LowTemp",
  //       "severity": 2
  //     },
  //     {
  //       "id": 35,
  //       "name": "LowTemp",
  //       "severity": 3,
  //       "tagsOfInterest": [
  //         {
  //           "uuid": "/tags/719c8bb8-26ff-4cc5-86b1-6a2ebf983136",
  //           "name": "ptransform_Tag_Temperature_Classification_name"
  //         }
  //       ],
  //       "incident": {
  //         "firstOccurance": "2016-07-24T11:00:00",
  //         "incidentEventCount": "3",
  //         "lastOccurance": "2016-07-24T11:22:00"
  //       }
  //     },
  //     {
  //       "id": 34,
  //       "name": "LowTemp",
  //       "severity": 3,
  //       "tagsOfInterest": [
  //         {
  //           "uuid": "/tags/719c8bb8-26ff-4cc5-86b1-6a2ebf983136",
  //           "name": "ptransform_Tag_Temperature_Classification_name"
  //         }
  //       ],
  //       "incident": {
  //         "firstOccurance": "2016-07-27T11:00:00",
  //         "incidentEventCount": "3",
  //         "lastOccurance": "2016-07-27T11:22:00"
  //       }
  //     },
  //     {
  //       "id": 31,
  //       "name": "LowTemp",
  //       "severity": 3,
  //       "tagsOfInterest": [
  //         {
  //           "uuid": "/tags/719c8bb8-26ff-4cc5-86b1-6a2ebf983136",
  //           "name": "ptransform_Tag_Temperature_Classification_name"
  //         }
  //       ],
  //       "incident": {
  //         "firstOccurance": "2016-07-24T11:00:00",
  //         "incidentEventCount": "3",
  //         "lastOccurance": "2016-07-24T11:22:00"
  //       }
  //     },
  //     {
  //       "id": 18,
  //       "name": "LowTemp",
  //       "severity": 3,
  //       "tagsOfInterest": [
  //         {
  //           "uuid": "/tags/719c8bb8-26ff-4cc5-86b1-6a2ebf983136",
  //           "name": "ptransform_Tag_Temperature_Classification_name"
  //         }
  //       ],
  //       "incident": {
  //         "firstOccurance": "2016-07-24T11:00:00",
  //         "incidentEventCount": "3",
  //         "lastOccurance": "2016-07-24T11:22:00"
  //       }
  //     }
  //   ],
  //   "last": true,
  //   "totalElements": 12,
  //   "totalPages": 1,
  //   "numberOfElements": 12,
  //   "first": true,
  //   "sort": [
  //     {
  //       "direction": "DESC",
  //       "property": "storageReceiveTime",
  //       "ignoreCase": false,
  //       "nullHandling": "NATIVE",
  //       "ascending": false
  //     }
  //   ],
  //   "size": 20,
  //   "number": 0
  // };