'use strict';

const { knex } = require('../../database');
const { readFileSync, readdir } = require('fs')
const path = require('path')

function getFiles() {
  return new Promise(function(resolve, reject) {
    console.log('getting files...')
    const dir = (path.join(__dirname, '../../log-data'))
    readdir(dir, (err, files) => {
      let logFileCount = files.length
      console.log('you have', logFileCount, 'files...')
      resolve(logFileCount)
    })
  })
}


// read in API data
function readApis(start, stop) {
  return new Promise(function(resolve, reject) {
    console.log('creating data array...')
    let apiData = []
    for (let i = start; i < stop; i++) {
      try {
        let data = readFileSync(path.join(__dirname, `../../log-data/log_data_${i}.json`))
        apiData.push.apply(apiData, JSON.parse(data))
      } catch (err) {
        throw err;
      }
    }
    resolve(apiData)
  })
}

    // .then(() => {
    //   return getFiles()
    // })

// comment out to prevent accidents
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('api_docs').del()
    .then(() => {
      return readApis(0, 5)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(5, 10)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
}
