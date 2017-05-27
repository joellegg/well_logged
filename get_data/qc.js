// qc to make sure all the wells are accounted for *** long run time
// to run: 'node get_data/qc'

'use strict'

var http = require("http")
const { readFileSync, writeFileSync, appendFile, readdir } = require('fs')
var path = require('path')

let logFileCount = 0
let apis = []
let existingApiData = []
let uniqueArray = []

// PROMISE CHAIN
getFileCount()
  .then(() => {
    readApiFiles()
  })
  .then(() => {
    console.log('total no. of files:', logFileCount)
    console.log('total no. of wells:', apis.length)
    readExistingData()
  })
  .then(() => {
    console.log('total no. of well logs:', existingApiData.length)
    uniqueArray = removeDuplicates(existingApiData, "api")
  })
  .then(() => {
    runQC()
  })

// FUNCTIONS
function getFileCount() {
  return new Promise(function(res, rej) {
    const dir = (path.join(__dirname, '../db/log-data'))
    readdir(dir, (err, files) => {
      logFileCount = files.length
      res(logFileCount)
    })
  })
}

function readApiFiles() {
  return new Promise(function(res, rej) {
    let data = readFileSync(path.join(__dirname, `raw_data/CO_apis.json`))
    apis = JSON.parse(data)
    res(apis)
  })
}

// read in the log_data that already exists locally
function readExistingData() {
  return new Promise(function(res, rej) {
    for (let i = 0; i < logFileCount; i++) {
      try {
        let data = readFileSync(path.join(__dirname, `../db/log-data/log_data_${i}.json`))
        existingApiData.push.apply(existingApiData, JSON.parse(data))
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    }
    res(existingApiData)
  })
}

function removeDuplicates(arr, prop) {
  var new_arr = [];
  var lookup = {};

  for (var i in arr) {
    lookup[arr[i][prop]] = arr[i];
  }

  for (i in lookup) {
    new_arr.push(lookup[i].api);
  }

  return new_arr
}

function runQC() {
  // push apis that have already been scraped to apisAlreadyScraped
  // push apis to scrape to apisToScrape file
  let apiPos = -1
  let apisToScrape = []
  let apisAlreadyScraped = []

  for (let i = 0; i < apis.length; i++) {
    apiPos = uniqueArray.indexOf(apis[i])

    if (i % 100 === 0) {
      console.log(i)
    }

    if (apiPos === -1) {
      console.log('missing', apis[i])
      apisToScrape.push(apis[i])
    } else {
      apisAlreadyScraped.push(apis[i])
    }
  }

  writeFileSync(`get_data/temp_files/apisToScrape.json`, JSON.stringify(apisToScrape))
  writeFileSync(`get_data/temp_files/apisAlreadyScraped.json`, JSON.stringify(apisAlreadyScraped))

  console.log(`# of wells to scrape ${apisToScrape.length}`)
  console.log(`# of wells already scraped ${apisAlreadyScraped.length}`)
}
