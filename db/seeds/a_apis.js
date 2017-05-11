'use strict';

const { knex } = require('../database');
const { readFileSync, readdir } = require('fs')
const path = require('path')

let logFileCount = 71
let apiData = []
let apiPromise;

function getLogCount() {

  console.log('getting file count')
  const dir = (path.join(__dirname, '../log-data'))
  readdir(dir, (err, files) => {
    logFileCount = files.length
    console.log('# o files', logFileCount)
  })

  readLogData()
}
getLogCount()


// read in API data
function readLogData() {
  console.log('reading in data')
  for (let i = 0; i < logFileCount; i++) {
    try {
      let data = readFileSync(path.join(__dirname, `../db/log-data/log_data_${i}.json`))
      apiData.push.apply(apiData, JSON.parse(data))
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }
  promiseItAll()
}


function promiseItAll() {
  console.log('promising it all')
  apiPromise = apiData.map(({ api, api_abv, doc_type, doc_link }) => {
    return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
  })
  runDaSeeds()
}

function runDaSeeds() {
  exports.seed = function(knex, Promise) {
    console.log('seeding file')
    return knex('api_docs')
      .then(function() {
        console.log('api promise', apiPromise)
        return Promise.all(apiPromise)
      })
  }
}

// exports.seed = function(knex, Promise) {
//   return knex('api_docs').insert(apiData)
// }
