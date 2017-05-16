'use strict';

const { knex } = require('../database');
const { readFileSync, readdir } = require('fs')
const path = require('path')

function getFiles() {
  return new Promise(function(resolve, reject) {
    console.log('getting files...')
    const dir = (path.join(__dirname, '../log-data'))
    readdir(dir, (err, files) => {
      let logFileCount = files.length
      console.log('you have', logFileCount, 'files...')
      resolve(logFileCount)
    })
  })
}


// read in API data
function readApis(logFileCount) {
  return new Promise(function(resolve, reject) {
    console.log('creating data array...')
    let apiData = []
    for (let i = 30; i < 40; i++) {
      try {
        let data = readFileSync(path.join(__dirname, `../log-data/log_data_${i}.json`))
        apiData.push.apply(apiData, JSON.parse(data))
      } catch (err) {
        throw err;
      }
    }
    resolve(apiData)
  })
}

// comment out to prevent accidents
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('api_docs')
    .then(() => {
      return getFiles()
    })
    .then((logCount) => {
      return readApis(logCount)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
}
