'use strict'

var http = require("http")
var path = require('path')
const { readFile, writeFile, appendFile } = require('fs')
const cheerio = require('cheerio');


// read in the APIs from local file
// TODO change to database
// let api_array = [];
// readFile(path.join(__dirname, 'temp_files/apis.txt'), 'utf8', (err, data) => {
//   if (err) throw err
//   // split data on ,
//   let api_array = data.split(', ')
//   for (let i = 0; i < api_array.length; i++) {
//     console.log('data', i, api_array[i])
//   }
// })

// TODO loop through APIs to make a POST to http://cogcc.state.co.us/weblink/results.aspx?id=12305800
// and pull out the well logs and directional data if present
http.get('http://cogcc.state.co.us/weblink/results.aspx?id=12305801', (res) => {
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
    rawData.replace(/(?:\n|\t|\r)/g, "")
      // $ parse html with cheerio
    var $ = cheerio.load(rawData)
    // this gets an array of <span>...</span>
    $('td span').each(function(i, el) {
      if ($(el).text().toLowerCase() === 'well logs') {
        console.log('first', $(el).text())
        // returns the name of the logs
        console.log('second', $(el).parent().parent().next().next().text())
        console.log('third', $(el).parent().parent().next().next().next().next().next().children().children().attr('href'))
        // console.log('third', i, $(el).next().text())
        console.log('it\'s a match!')
      }
    })

    // try {
    //   console.log(rawData);
    // } catch (e) {
    //   console.error(e.message);
    // }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
