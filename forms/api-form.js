'use strict'

var http = require("http")
const { writeFile, appendFile } = require('fs')

// http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
// An object of options to indicate where to POST
// Weld Co. CO 1-12N 56-68W
for (let i = 1; i < 13; i++) {
  for (let j = 56; j < 69; j++) {
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
        console.log('chunk_match', chunk_match)
        if (chunk_match !== null) {
          // Push the APIs into database
          appendFile('forms/apis.txt', `, ${chunk_match}`, (err) => {
            if (err) throw err
          })
        }
      })
    })

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    // post the form data
    // console.log('running through loop', `${i}N, ${j}W`)
    req.write(`factype=%27WELL%27&county=123&twp${i}N=&rng=${j}W&maxrec=1&Button1=Submit`)
    req.end()
  }
}
