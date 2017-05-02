'use strict'

const Api = require('../models/apisMdl')

module.exports.getAllApi = ({ params: { api } }, res, next) => {
  Api.getAllApi({ api })
    .then(res => res.status(200).json(res))
    .catch(err => next(err))
}

module.exports.getSingleApi = (req, res, next) => {
  Animal.getAllAnimals()
    .then(animals => res.status(200).json(animals))
    .catch(err => next(err))
}
