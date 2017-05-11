'use strict';

const { knex } = require('../database');
const { readFileSync, readdir } = require('fs')

const dir = './log-data/'

readdir(dir, (err, files) => {
  console.log('file path', dir)
  console.log('# of files in log-data', files.length);
});


// // read in API data
// let apiData = []

// for (let i = 0; i < 71; i++) {
//   try {
//     let data = readFileSync(path.join(__dirname, `../db/log-data/log_data_${i}.json`))
//     apiData.push.apply(apiData, JSON.parse(data))
//   } catch (err) {
//     if (err.code !== 'ENOENT') {
//       throw err;
//     }
//   }
// }

// let apiPromise = apiData.map(({ api, api_abv, doc_type, doc_link }) => {
//   return knex('api_docs').insert({ api, api_abv, doc_type, doc_link })
// })

// exports.seed = function(knex, Promise) {
//   return knex('api_docs')
//     .then(function() {
//       return Promise.all(apiPromise)
//     })
// }
