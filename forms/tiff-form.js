'use strict'

var http = require("http")
var path = require('path')
const { readFile, writeFile, appendFile } = require('fs')

// loop through APIs to make a POST to http://cogcc.state.co.us/weblink/results.aspx?id=12305800
let api_array = [];
readFile(path.join(__dirname, 'apis.txt'), 'utf8', (err, data) => {
  if (err) throw err
  // split data on ,
  let api_array = data.split(', ')
  for (let i = 0; i < api_array.length; i++) {
    console.log('data', i, api_array[i])
  }
})

// and pull out the well logs and directional data if present
http.get('http://cogcc.state.co.us/weblink/results.aspx?id=12305800', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  } else if (!/^text\/html/.test(contentType)) {
    error = new Error(`Invalid content-type.\n` +
                      `Expected text/html but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      console.log(rawData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
