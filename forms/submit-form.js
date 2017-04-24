'use strict'

var http = require("http")
const { writeFile, appendFile } = require('fs')

// http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
// An object of options to indicate where to POST
var options = {
  hostname: 'cogcc.state.co.us',
  port: 80,
  path: '/cogis/facilitysearch2.asp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
}

let chunk_merged = ''

// Set up the request
var req = http.request(options, function(res) {
  res.setEncoding('utf8')
  res.on('data', function(chunk) {
      chunk_merged += chunk
    })
    // when the request is complete, log the entire response
  res.on('end', function() {
    const regex = /\d{2}-\d{3}-\d{5}/g
    let chunk_match = chunk_merged.match(regex)
    if (chunk_match !== null) {
      // Push the APIs into database
      appendFile('forms/response-apis.txt', `, ${chunk_match}`, (err) => {
        if (err) throw err
      })
    }
  })
})

req.on('error', function(e) {
  console.log('problem with request: ' + e.message)
})

// post the form data
// Weld Co. CO 1-12N 56-68W
for (let i = 1; i < 13; i++) {
  for (let j = 56; j < 69; j++) {
    req.write(`factype=%27WELL%27&county=123&twp${i}N=&rng=${j}W&maxrec=5&Button1=Submit`)
  }
}
req.end()





// POST to http://cogcc.state.co.us/weblink/results.aspx?id=12305800
// Use each API to get log data
