'use strict'
// to run 'node req_forms/apis-req'

var http = require("http")
const { readFile, writeFile, appendFile } = require('fs')
var path = require('path')

// Weld Co. CO 1-12N 56-68W
// TODO if you want more counties, change the i and j iteration for the T&Rs of interest
// and change req.write to remove or change the county
// http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
for (let i = 0; i < countyArray.length; i++) {
  console.log(countyArray[i])
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

  // Set up the request
  function reqFunction() {
    var req = http.request(options, (res) => {
      res.setEncoding('utf8')

      let merge_chunk = '';
      res.on('data', (chunk) => merge_chunk += chunk)
        // when the request is complete, log the entire response
      res.on('end', () => {
        // pull out the apis using regex, chunk_APIs returns an array
        const regex = /\d{2}-\d{3}-\d{5}/g
        let chunk_APIs = merge_chunk.match(regex)
          // TO DO if API exists, don't save it to the file
          // loop through the chunk_APIs array to get each API
        if (chunk_APIs !== null) {
          // if the apiArray is empty, add just the new data
          if (apiArray.length === 0) {
            for (let k = 0; k < chunk_APIs.length; k++) {
              let abv_api = chunk_APIs[k].replace(/(^.{2})*(-)/g, '')
              apiArray.push({ api: `${chunk_APIs[k]}`, api_abv: `${abv_api}` })
            }
          }
          // loop to exclude duplicates
          else if (apiArray.length > 0) {
            // loop through the chunk apis to see if they exist in the apiArray from apis.json
            for (let k = 0; k < chunk_APIs.length; k++) {
              let abv_api = chunk_APIs[k].replace(/(^.{2})*(-)/g, '')
              let pos = apiArray.map(function(res) {
                return res.api
              }).indexOf(chunk_APIs[k])
              if (pos === -1) {
                apiArray.push({ api: `${chunk_APIs[k]}`, api_abv: `${abv_api}` })
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
    req.write(`factype=%27WELL%27&county=${countyArray[i]}&maxrec=20000&Button1=Submit`)
    req.end()
  }
}
