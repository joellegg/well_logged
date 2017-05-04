var http = require("http")
const { readFile, writeFile, appendFile } = require('fs')
var path = require('path')

let apis = ''
readFile(path.join(__dirname, 'temp_files/TEST.txt'), 'utf8', (err, data) => {
  if (err) throw err
  apis = data;
  readNext();
})

let apiArray = []

function readNext() {
  readFile(path.join(__dirname, 'temp_files/apis.json'), 'utf8', (err, data) => {
    if (err) throw err
    apiArray = JSON.parse(data);
    writeFunction();
  })
}

function writeFunction() {
  const regex = /\d{2}-\d{3}-\d{5}/g
  let chunk_APIs = apis.match(regex)

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
