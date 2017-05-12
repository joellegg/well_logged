'use strict'

const { bookshelf } = require('../db/database')

const Api = bookshelf.Model.extend({
  tableName: 'api_docs'
}, {
  getAllApi: function() {
    console.log("Get all called from Api model")
    return this.forge()
      .fetchAll()
      .then(rows => rows)
      .catch(error => error)
  },
  getSingleApi: function(api) {
    console.log("Get single api called from Api model")
    return this.forge({ api })
      .fetchAll()
      .then(rows => rows)
      .catch(err => err)
  }
})

module.exports = Api
