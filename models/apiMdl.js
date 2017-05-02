'use strict'

const { bookshelf } = require('../db/database')

const Api = bookshelf.Model.extend({
  tableName: 'logs'
}, {
  getAllAPI: function() {
    console.log("Get all called from Api model")
    return this.forge()
    .fetchAll()
    .then(rows => rows)
    .catch(error => error)
  }
})

module.exports = Api
