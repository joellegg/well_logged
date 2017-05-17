'use strict'

const Api = require('../models/apisMdl')
const { knex } = require('../db/database')

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

// select distinct on (api) * from api_docs where api like '05-123-234%' limit 10;
module.exports.getDistinctApis = ({ params: { distinct } }, res, next) => {
  console.log('api starts with', distinct)
  Api.getDistinctApis(distinct)
    .then(apiRes => res.status(200).json(apiRes))
    .catch(err => next(err))
}

// select doc_type, count(doc_type) from api_docs group by doc_type having count(doc_type) > 1500 order by count(doc_type) desc;
module.exports.countLogs = (req, res, next) => {
  console.log('count the logs by type')
  knex.raw('select doc_type, count(doc_type) from api_docs group by doc_type having count(doc_type) > 5000 order by count(doc_type) desc;')
    .then(rows => rows)
    .then(countRes => res.status(200).json(countRes))
    .catch(err => next(err))
}

// select substr(api, 1, 6) as startsWith, count(api) from api_docs group by substr(api, 1, 6) having count(api) > 5000 order by count(api) desc;
module.exports.countCounties = (req, res, next) => {
  console.log('count the logs by county')
  knex.raw('select substr(api, 1, 6) as startsWith, count(api) from api_docs group by substr(api, 1, 6) having count(api) > 5000 order by count(api) desc;')
    .then(rows => rows)
    .then(countRes => res.status(200).json(countRes))
    .catch(err => next(err))
}
