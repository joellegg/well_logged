'use strict'

const Api = require('../models/apisMdl')

module.exports.getAllApi = (req, res, next) => {
  Api.getAllApi()
    .then(apis => res.status(200).json(apis))
    .catch(err => next(err))
}

module.exports.getSingleApi = ({ params: { api } }, res, next) => {
  console.log('api is...', api)
  Api.getSingleApi(api)
    .then(apiRes => res.status(200).json(apiRes))
    .catch(err => next(err))
}

module.exports.getDistinctApis = ({ params: { distinct } }, res, next) => {
  console.log('api starts with', distinct)
  Api.getDistinctApis(distinct)
    .then(apiRes => res.status(200).json(apiRes))
    .catch(err => next(err))
}
