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
    .then(() => {
      return readApis(10, 15)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(15, 20)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(20, 25)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(25, 30)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(30, 35)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(35, 40)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(40, 45)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(45, 50)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(50, 55)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(55, 60)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return readApis(60, 65)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
    .then(() => {
      return getFiles()
    })
    .then((logFileCount) => {
      return readApis(65, logFileCount)
    })
    .then((response) => {
      let apiPromises = response.map(({ api, api_abv, doc_type, doc_link }) => {
        return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
      })
      // console.log('apiPromises', apiPromises)
      return Promise.all(apiPromises)
    })
}
