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
  readFile(path.join(__dirname, '../db/seeds/log_data.json'), 'utf8', (err, data) => {
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
              let log_description = $(el).parent().parent().next().next().text()
              let log_href = $(el).parent().parent().next().next().next().next().next().children().children().attr('href')

              let dataObj = {
                api: apis[i].api,
                api_abv: apis[i].api_abv,
                doc_type: log_description,
                doc_link: log_href
              }


              // see if the doc_link is already in the database
              let linkPos = api_data.map(function(res) {
                return res.doc_link
              }).indexOf(log_href)

              console.log('link position', linkPos)

              if (linkPos === -1) {
                api_data.push(dataObj)
                writeFile('db/seeds/log_data.json', JSON.stringify(api_data), (err) => {
                  if (err) throw err
                })
              }
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

// loop through apis to make req for each
// if the req returns an obj
// see if it already exists in the log_data file
// if it does skip it
// if not then add it
