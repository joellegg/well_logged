'use strict'

const Api = require('../models/apisMdl')

module.exports.getAllApi = (req, res, next) => {
  Api.getAllApi()
    .then(apis => res.status(200).json(apis))
    .catch(err => next(err))
}

module.exports.getSingleApi = ({ params: { id } }, res, next) => {
  Api.getSingleApi({ id })
    .then(api => res.status(200).json(api))
    .catch(err => next(err))
}
