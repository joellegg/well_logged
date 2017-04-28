'use strict'

var http = require("http")
const { readFile, writeFile, appendFile } = require('fs')

// http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
// An object of options to indicate where to POST
// Weld Co. CO 1-12N 56-68W
// TODO if you want more counties, change the i and j iteration for the T&Rs of interest
// and change req.write to remove or change the county
for (let i = 10; i < 11; i++) {
  for (let j = 60; j < 61; j++) {
    var options = {
      hostname: 'cogcc.state.co.us',
      port: 80,
      path: '/cogis/facilitysearch2.asp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }

    let merge_chunk = '';
    // read in the local apis.json file

    // Set up the request
    var req = http.request(options, function(res) {
      res.setEncoding('utf8')
      res.on('data', function(chunk) {
        merge_chunk += chunk
      });
      // when the request is complete, log the entire response
      res.on('end', function() {
        const regex = /\d{2}-\d{3}-\d{5}/g
        let chunk_APIs = merge_chunk.match(regex)
          // chunk_APIs returns an array
          // TODO if API exists, don't save it to the file
        if (chunk_APIs !== null) {
          for (let i = 0; i < chunk_APIs.length; i++) {
            console.log(i, { 'api': chunk_APIs[i] })
              // Push the APIs into database
            appendFile('req_forms/temp_files/apis.txt', `{ 'api': ${chunk_APIs[i]} },`, (err) => {
              if (err) throw err
            })
          }
        }
      })
    })

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message)
    })

    // post the form
    req.write(`factype=%27WELL%27&county=123&twp${i}N=&rng=${j}W&maxrec=10&Button1=Submit`)
    req.end()
  }
}
