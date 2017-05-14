'use strict'

const { Router } = require('express')
const router = Router()

const { getAllApi, getSingleApi, getDistinctApis } = require('../controllers/apiCtrl')

router.get('/apis/:api', getSingleApi)
router.get('/apis/query/:distinct', getDistinctApis)
router.get('/apis', getAllApi)

module.exports = router
