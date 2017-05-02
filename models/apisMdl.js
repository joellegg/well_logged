'use strict'

const { bookshelf } = require('../db/database')

const Api = bookshelf.Model.extend({
  tableName: 'api_data'
}, {
  getAllApi: function() {
    console.log("Get all called from Api model")
    return this.forge()
    .fetchAll()
    .then(res => res)
    .catch(error => error)
  },
  getSingleApi: function(api) {
    console.log("Get single api called from Api model")
    return this.forge({well_id: api})
    .fetchAll()
    .then(res => res)
    .catch(err => err)
  }
})

module.exports = Api
