'use strict'
// to run: 'node req_forms/qc'

var http = require("http")
const { readFileSync, writeFileSync, appendFile } = require('fs')
var path = require('path')

let logFileCount = 0
let apis = []
let existingApiData = []

function readApiFiles() {
  const dir = (path.join(__dirname, '../db/log-data'))
  readdir(dir, (err, files) => {
    logFileCount = files.length
  })

  for (let j = 0; j < 13; j++) {
    try {
      let data = readFileSync(path.join(__dirname, `temp_files/apis_${j}.json`))
      apis.push.apply(apis, JSON.parse(data))
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
  }

  console.log('total no. of files:', logFileCount)
  console.log('total no. of wells', apis.length)
  readExistingData()
}
readApiFiles()

// read in the log_data that already exists locally
function readExistingData() {
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

  console.log('total # of well logs:', existingApiData.length)
  runQC()
}

function runQC() {
  // push apis that have already been scraped to apisAlreadyScraped
  // push apis to scrape to apisToScrape file
  let apiPos = -1
  let apisToScrape = []
  let apisAlreadyScraped = []

  for (let i = 0; i < apis.length; i++) {
    apiPos = existingApiData.map(function(res) {
      return res.api
    }).indexOf(apis[i].api)


    console.log(i)
    if (apiPos === -1) {
      console.log('missing', apis[i].api)
      apisToScrape.push(apis[i].api)
    } else {
      apisAlreadyScraped.push(apis[i].api)
    }
  }

  writeFileSync(`get_data/temp_files/apisToScrape.json`, JSON.stringify(apisToScrape))
  writeFileSync(`get_data/temp_files/apisAlreadyScraped.json`, JSON.stringify(apisAlreadyScraped))

  console.log(`# of wells to scrape ${apisToScrape.length}`)
  console.log(`# of wells already scraped ${apisAlreadyScraped.length}`)
}
