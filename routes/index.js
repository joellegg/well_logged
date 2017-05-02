'use strict'

const { Router } = require('express')
const router = Router()

router.use(require('./routes'))

router.get('/', function(req, res) {
  res.json({
    "title": "API data",
    // "animal-tricks": "<name>.herokuapp.com/api/v1/animals/:id/tricks",
  })
})

module.exports = router;
