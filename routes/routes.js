'use strict'

const { Router } = require('express')
const router = Router()

const { getAllApi, getSingleApi, getDistinctApis, countLogs, countCounties } = require('../controllers/apiCtrl')

// Log routes
router.get('/apis/:api', getSingleApi)
router.get('/apis/query/:distinct', getDistinctApis)
router.get('/apis', getAllApi)

// Chart routes
router.get('/countLogs', countLogs)
router.get('/countCounties', countCounties)

module.exports = router
