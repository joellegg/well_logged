// Transform the data from txt file into a json file

var http = require("http")
const { readFile, readFileSync, writeFileSync, appendFileSync, statSync } = require('fs')
var path = require('path')


// ************** READ FILE ************** //
let raw_apis = ''
let API_array = []

// read in the apis from the CO_apis.txt file (data came from Shapefile)
readFile(path.join(__dirname, 'raw_data/CO_apis.txt'), 'utf8', (err, data) => {
  if (err) throw err
  raw_apis = data;
  const regex = /\d{2}-\d{3}-\d{5}/g
  API_array = raw_apis.match(regex)
  writeFunction()
})

// ************** WRITE FILE ************** //
function writeFunction() {
  writeFileSync(`get_data/raw_data/CO_apis.json`, JSON.stringify(API_array))
}
