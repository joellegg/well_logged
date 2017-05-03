'use strict'
// to run: 'node req_forms/tiff-url-req'

var http = require("http")
var path = require('path')
const { readFile, writeFile, appendFile } = require('fs')
const cheerio = require('cheerio');

// read in the APIs from local file
let apis = []
let api_data = []
readFile(path.join(__dirname, 'temp_files/apis.json'), 'utf8', (err, data) => {
  if (err) throw err
  apis = JSON.parse(data)
  getApiData()
})

function getApiData() {
  readFile(path.join(__dirname, 'temp_files/log_data.json'), 'utf8', (err, data) => {
    if (err) throw err
    api_data = JSON.parse(data)
    makeUrlReq()
  })
}

// TO DO loop through APIs to GET well logs and directional data if present
function makeUrlReq() {
  for (let i = 0; i < apis.length; i++) {
    // console.log('api', apis[i].api_abv)
    // console.log('website', `http://cogcc.state.co.us/weblink/results.aspx?id=${apis[i].api_abv}`);
    http.get(`http://cogcc.state.co.us/weblink/results.aspx?id=${apis[i].api_abv}`, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type']

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
          $('td span').each((j, el) => {
            // if well logs exist
            if ($(el).text().toLowerCase() === 'well logs') {
              let well_logs = $(el).text()
              let log_description = $(el).parent().parent().next().next().text()
              let log_href = $(el).parent().parent().next().next().next().next().next().children().children().attr('href')
              console.log(apis[i].api_abv, well_logs, log_description, log_href);
              // push data to file
              // writeFile('get_data/temp_files/apis.json', JSON.stringify(apiArray), (err) => {
              //   if (err) throw err
              // })
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
