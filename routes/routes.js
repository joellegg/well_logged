'use strict'

const { Router } = require('express')
const router = Router()

const { getAllApi, getSingleApi } = require('../controllers/apiCtrl')

router.get('/apis/:api', getSingleApi)
router.get('/apis', getAllApi)

module.exports = router
