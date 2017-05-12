'use strict'

const { Router } = require('express')
const router = Router()

const { getAllApi, getSingleApi } = require('../controllers/apiCtrl')

router.get('/apis', getAllApi)
router.get('/apis/:api', getSingleApi)

module.exports = router
