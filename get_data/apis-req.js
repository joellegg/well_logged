'use strict'
// to run 'node req_forms/apis-req'

var http = require("http")
const { readFile, writeFile, appendFile } = require('fs')
var path = require('path')

// Weld Co. CO 1-12N 56-68W
// TODO if you want more counties, change the i and j iteration for the T&Rs of interest
// and change req.write to remove or change the county
// http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
for (let i = 10; i < 11; i++) {
  for (let j = 60; j < 61; j++) {
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

    let apiArray = [];
    // read in the apis from temp_files/apis.json
    readFile(path.join(__dirname, 'temp_files/apis.json'), 'utf8', (err, data) => {
      if (err) throw err
      apiArray = JSON.parse(data);
      reqFunction();
    })
    let merge_chunk = '';

    // Set up the request
    function reqFunction() {
      var req = http.request(options, (res) => {
        res.setEncoding('utf8')
        res.on('data', (chunk) => merge_chunk += chunk)
          // when the request is complete, log the entire response
        res.on('end', () => {
          // pull out the apis using regex, chunk_APIs returns an array
          const regex = /\d{2}-\d{3}-\d{5}/g
          let chunk_APIs = merge_chunk.match(regex)
            // TO DO if API exists, don't save it to the file
            // loop through the chunk_APIs array to get each API
          if (chunk_APIs !== null) {
            // console.log('chunk_api length', chunk_APIs.length)
            // console.log('apiArray length', apiArray.length);
            // if the apiArrary length is zero then just add just the new data
            if (apiArray.length === 0) {
              for (let k = 0; k < chunk_APIs.length; k++) {
                // console.log('length is 0', chunk_APIs[k])
                apiArray.push({ api: `${chunk_APIs[k]}` })
              }
            }
            // exclude duplicates
            else if (apiArray.length > 0) {
              // loop through the chunk apis to see if they exist in the apiArray from apis.json
              for (let k = 0; k < chunk_APIs.length; k++) {
                let well_id = { api: chunk_APIs[k] }
                let pos = apiArray.map(function(res) {
                  return res.api
                }).indexOf(chunk_APIs[k])
                if (pos === -1) {
                  apiArray.push({ api: `${chunk_APIs[k]}` })
                }
              }
            }
            // push array to file
            writeFile('get_data/temp_files/apis.json', JSON.stringify(apiArray), (err) => {
              if (err) throw err
            })
          }
        })
      })
      req.on('error', (e) => console.log('problem with request: ' + e.message))

      // post the form
      req.write(`factype=%27WELL%27&county=123&twp${i}N=&rng=${j}W&maxrec=10&Button1=Submit`)
      req.end()
    }
  }
}
