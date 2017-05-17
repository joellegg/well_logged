'use strict'

const { bookshelf } = require('../db/database')
bookshelf.plugin('pagination')

const Api = bookshelf.Model.extend({
  tableName: 'api_docs'
}, {
  getAllApi: function() {
    console.log("Get all called from Api model")
    return this
      .forge()
      .fetchAll()
      .then(rows => rows)
      .catch(error => error)
  },
  getSingleApi: function(api) {
    console.log("Get single api called from Api model")
    return this
      .where({ api })
      .fetchAll()
      .then(rows => rows)
      .catch(err => err)
  },
  getDistinctApis: function(api) {
    console.log("Get distinct api called from Api model")
    return this
      .where('api', 'like', `${api}%`)
      .orderBy('api', 'desc')
      .fetchPage({pageSize: 50})
      // .fetchAll()
      .then(rows => rows)
      .catch(err => err)
  }
})

module.exports = Api
