'use strict'

const { Router } = require('express')
const router = Router()

const { getAllAPI, getSingleAPI, addOneAPI } = require('../controllers/apiCtrl')

router.get('/api', getAllAPI)
router.get('/api/:api', getSingleAPI)
router.post('/api/new', addOneAPI)

module.exports = router
