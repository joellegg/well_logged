'use strict';

const { knex } = require('../database');
const { readFileSync, readdir } = require('fs')
const path = require('path')

function getFiles() {
  return new Promise(function(res, rej) {
    console.log('getting file count')
    const dir = (path.join(__dirname, '../log-data'))
    readdir(dir, (err, files) => {
      let logFileCount = files.length
      console.log('# o files', logFileCount)
      res(logFileCount)
    })
  })
}

// read in API data
function readApis(logFileCount) {
  return new Promise(function(res, rej) {
    console.log('reading in data')
    let apiData = []
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
    console.log('apiData length', apiData.length)
    res(apiData)
  })
}

exports.seed = function(knex, Promise) {
  getFiles()
    .then((logFileCount) => {
      return readApis(logFileCount)
    })
    .then((apiData) => {
      console.log('promising it all')
      let apiPromise = apiData.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
    })
    .then((apiPromise) => {
      console.log('seeding file')
      return knex('api_docs')
        .then(function() {
          console.log('api promise', apiPromise)
          return Promise.all(apiPromise)
        })
    })
}

// exports.seed = function(knex, Promise) {
//   return knex('api_docs').insert(apiData)
// }
