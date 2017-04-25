'use strict'

var http = require("http")
var path = require('path')
const { readFile, writeFile, appendFile } = require('fs')

// loop through APIs to make a POST to http://cogcc.state.co.us/weblink/results.aspx?id=12305800
let api_array = [];
readFile(path.join(__dirname, 'apis.txt'), 'utf8', (err, data) => {
  if (err) throw err
  // split data on ,
  let api_array = data.split(', ')
  for (let i = 0; i < api_array.length; i++) {
    console.log('data', i, api_array[i])
  }
})

// and pull out the well logs and directional data if present
