'use strict'
// to run: 'node req_forms/tiff-url-req'

var http = require("http")
var path = require('path')
const { readFile, writeFile, appendFile } = require('fs')
const cheerio = require('cheerio');

// read in the APIs from local file
let api_array = [];
readFile(path.join(__dirname, 'temp_files/apis.json'), 'utf8', (err, data) => {
  if (err) throw err
  api_array = JSON.parse(data);
  makeUrlReq();
})

// TO DO loop through APIs to GET well logs and directional data if present
function makeUrlReq() {
  for (let i = 0; i < api_array.length; i++) {
    http.get(`http://cogcc.state.co.us/weblink/results.aspx?id=${api_array[i].api}`, (res) => {
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
      // when data chunks are recieved, combine them
      res.on('data', (chunk) => { rawData += chunk; });
      // when the chunks stop coming in parse the html and pull out the data
      res.on('end', () => {
        try {
          rawData.replace(/(?:\n|\t|\r)/g, "")
            // $ parse html with cheerio
          var $ = cheerio.load(rawData)
            // this gets an array of <span>...</span>
          $('td span').each((i, el) => {
            if ($(el).text().toLowerCase() === 'well logs') {
              let well_logs = $(el).text()
              let log_description = $(el).parent().parent().next().next().text()
              let log_href = $(el).parent().parent().next().next().next().next().next().children().children().attr('href')
              console.log(well_logs, log_description, log_href);
            }
          })
        } catch (e) {
          console.error(e.message)
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }
}
