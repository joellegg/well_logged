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

let api_data = [];
let chunk_merged = [];

// Set up the request
var req = http.request(options, function(res) {
  res.setEncoding('utf8')
  res.on('data', function(chunk) {
    // merge all the data chunks
    chunk_merged.push(chunk)
    appendFile('forms/chunks.txt', `${chunk}`, (err) => {
      if (err) throw err
    })
    // use regex to pull the APIs from each chunk
    const regex = /\d{2}-\d{3}-\d{5}/g
    let API_chunk = chunk.match(regex);
    // if there is an API in the string, push it to forms/response-apis.txt
    if (API_chunk !== null) {
      appendFile('forms/response-apis.txt', API_chunk, (err) => {
        if (err) throw err
      })
      console.log('API_chunk', API_chunk);
    }
  })
  // when the request is complete, log the entire response
  res.on('end', function() {
    console.log('chunk_merged', chunk_merged);
  })
})

req.on('error', function(e) {
  console.log('problem with request: ' + e.message)
})

// post the form data
req.write(`factype=%27WELL%27&county=123&twp=&rng=&maxrec=1&Button1=Submit`)
req.end()


// Take the response and pull out the APIs

// Push the APIs into database


// POST to http://cogcc.state.co.us/weblink/results.aspx?id=12305800
// Use each API to get log data
