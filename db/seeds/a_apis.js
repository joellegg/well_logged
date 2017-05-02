'use strict';

const { knex } = require('../../../db/database');
const apiData = require('./logs')

let apiPromise = apiData.map((data) => {
  return knex('logs').insert({name:data.api})
})

exports.seed = function(knex, Promise) {
  return knex('logs').del()
  .then(function() {
    return Promise.all(apiPromise)
  })
}
