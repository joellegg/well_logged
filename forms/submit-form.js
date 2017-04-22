'use strict'


var http = require("http")
const { appendFile } = require('fs')


// An object of options to indicate where to POST to
var options = {
  hostname: 'cogcc.state.co.us',
  port: 80,
  path: '/cogis/facilitysearch2.asp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
}

// Set up the request
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode)
  console.log('Headers: ' + JSON.stringify(res.headers))
  res.setEncoding('utf8')
  res.on('data', function(chunk) {
    appendFile('forms/response-apis.txt', `${chunk}`, (err) => {
      if (err) throw err
    })
  })
})
req.on('error', function(e) {
  console.log('problem with request: ' + e.message)
})

// post the form data
req.write(`factype=%27WELL%27&county=123&twp=&rng=&maxrec=100&Button1=Submit`)
req.end()


// factype:'WELL'
// county:123
// ApiCountyCode:
// ApiSequenceCode:
// Operator:
// operator_name_number:name
// Facility_Lease:
// facility_name_number:name
// qtrqtr:
// sec:
// twp:
// rng:
// Field:
// field_name_number:name
// maxrec:100
// Button1:Submit

// Take the response and pull out the APIs
// Push the APIs into database


// POST to http://cogcc.state.co.us/weblink/results.aspx?id=12305800
// Use each API to get log data
