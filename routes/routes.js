'use strict'

const { Router } = require('express')
const router = Router()

const { getAllApi, getSingleApi } = require('../controllers/apiCtrl')

router.get('/api', getAllApi)
router.get('/api/:api', getSingleApi)

module.exports = router
