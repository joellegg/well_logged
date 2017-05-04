var http = require("http")
const { readFile, readFileSync, writeFileSync, appendFileSync, statSync } = require('fs')
var path = require('path')


// ************** READ IN FILES ************** //
let apis = ''
let chunk_APIs = []
  // read in the apis from the SHAPEFILE dbf file
readFile(path.join(__dirname, 'temp_files/dbf.txt'), 'utf8', (err, data) => {
  if (err) throw err
  apis = data;
  const regex = /\d{2}-\d{3}-\d{5}/g
  chunk_APIs = apis.match(regex)
  readApiFiles()
})

let apiArray = []

function readApiFiles() {
  let apiCount = 0
  for (let j = 0; j < chunk_APIs.length; j++) {
    if (j % 9000 === 0) {
      try {
        let data = readFileSync(path.join(__dirname, `temp_files/apis_${apiCount}.json`))
          // concat the different file arrays
        apiArray.push.apply(apiArray, JSON.parse(data))
      } catch (err) {
        if (err.code === 'ENOENT') {
          // return console.log('File not found, but moving on!');
        } else {
          throw err;
        }
      }
      apiCount++
    }
  }
  writeFunction()
}

let j = 0;
let api9000 = []

function writeFunction() {
  for (let k = 0; k < chunk_APIs.length; k++) {
    console.log(k)

    let pos = apiArray.map(function(res) {
      return res.api
    }).indexOf(chunk_APIs[k])

    if (pos === -1) {
      let abv_api = chunk_APIs[k].replace(/(^.{2})*(-)/g, '')
      let dataObj = { api: `${chunk_APIs[k]}`, api_abv: `${abv_api}` }
      api9000.push(dataObj)
    }

    if (k % 9000 === 0 && k !== 0 && api9000.length !== 0 || k === (chunk_APIs.length - 1) && api9000.length !== 0) {
      writeFileSync(`get_data/temp_files/apis_${j}.json`, JSON.stringify(api9000), (err) => {
        if (err) throw err
      })
      api9000 = []
      console.log(j, k, chunk_APIs[k])
      j++
    }
  }
}
