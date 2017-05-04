var http = require("http")
const { readFile, writeFile, appendFileSync } = require('fs')
var path = require('path')

// ************** READ IN FILES **************//
let apis = ''
let chunk_APIs = []

readFile(path.join(__dirname, 'temp_files/TEST.txt'), 'utf8', (err, data) => {
  if (err) throw err
  apis = data;
  const regex = /\d{2}-\d{3}-\d{5}/g
  chunk_APIs = apis.match(regex)
  readNext();
})


let apiArray = []

function readNext() {
  readFile(path.join(__dirname, 'temp_files/apis.json'), 'utf8', (err, data) => {
    if (err) throw err
    apiArray = JSON.parse(data);
    writeFunction();
  })
}

let j = 0;

function writeFunction() {
  for (let k = 0; k < chunk_APIs.length; k++) {
    console.log(k)
    let abv_api = chunk_APIs[k].replace(/(^.{2})*(-)/g, '')
      // let pos = apiArray.map(function(res) {
      //   return res.api
      // }).indexOf(chunk_APIs[k])
      // if (pos === -1) {
    let dataObj = { api: `${chunk_APIs[k]}`, api_abv: `${abv_api}` }
      //   apiArray.push(dataObj)
      // }
      // if (k % 5000 === 0 && k !== 0) {
    appendFileSync(`get_data/temp_files/apis_${j}.json`, JSON.stringify(dataObj) + ",\r\n", (err) => {
        if (err) throw err
          // console.log('wrote data')
          // j++
          // apiArray = []
      })
      // }
    if (k % 9000 === 0 && k !== 0) {
      console.log(j, k, chunk_APIs[k])
      j++
    }
  }
}
