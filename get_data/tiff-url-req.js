'use strict'
// to run: 'node req_forms/tiff-url-req'

var http = require("http")
http.globalAgent.maxSockets = 5;
var path = require('path')
const { readFileSync, writeFileSync, appendFile } = require('fs')
const cheerio = require('cheerio');

let apis = []
let existingApiData = []
let dataArray = []
let fileCount = 0;

// to do: remove apis that have already been scraped
// read in the APIs from local files and merge into one Array
function readApiFiles() {
  for (let j = 0; j < 13; j++) {
    try {
      let data = readFileSync(path.join(__dirname, `temp_files/apis_${j}.json`))
        // concat the different api files
      apis.push.apply(apis, JSON.parse(data))
    } catch (err) {
      if (err.code === 'ENOENT') {
        // return console.log('File not found, but moving on!');
      } else {
        throw err;
      }
    }
  }

  // console.log('total # of wells', apis.length)
  readExistingData()
}
readApiFiles()

// read in the log_data that already exists locally
function readExistingData() {
  for (let i = 0; i < apis.length; i++) {
    if (i % 5000 === 0) {
      // console.log('file #s', fileCount)
      try {
        let data = readFileSync(path.join(__dirname, `../db/seeds/log_data_${fileCount}.json`))
          // concat the different data files
        let dataLength = (JSON.parse(data).length)
        if (dataLength < 5000) {
          console.log(`file length is only ${dataLength} in file # ${fileCount}`)
            // push to array to add data to
          dataArray = JSON.parse(data)
        }
        existingApiData.push.apply(existingApiData, JSON.parse(data))
      } catch (err) {
        if (err.code === 'ENOENT') {
          fileCount--
          // return console.log('File not found, but moving on!');
        } else {
          throw err;
        }
      }
      fileCount++
    }
  }
  // see if the api is already in the database
  // if present - remove so you don't scrape for the same data
  // loop through backwards b/c array get's reindexed when you remove an item,
  // thus consecutive items will be skipped going forward
  for (let i = apis.length - 1; i >= 0; i--) {
    // apiPos returns the position of the api in the api data files
    let apiPos = existingApiData.map(function(res) {
        return res.api
      }).indexOf(apis[i].api)
      // -1 means it's not there, any other number means the api# has already been scraped so remove from array
    if (apiPos !== -1) {
      // console.log('api already scraped', apiPos, apis[i].api)

      // splice to move existing well id from array
      apis.splice(i, 1)
    }
  }
  console.log('# of data files', fileCount)
  console.log(`# of wells to scrape for ${apis.length}`)
  console.log('total # of data entries', existingApiData.length)
  setRequests()
}

// to do: swap 10 for api.length
function setRequests() {
  for (let i = 0; i < 100; i++) {
    makeUrlReq(i)
  }
}

let fileNumber = (fileCount - 1);
console.log('file number', fileNumber)

// make the request for new data, passing in the 111k apis
function makeUrlReq(i) {
  setTimeout(function() {
    console.log(`api request #${i} with ${apis[i].api_abv}`)

    var options = {
      hostname: 'cogcc.state.co.us',
      port: 80,
      path: '/weblink/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }

    var req = http.request(options, (res) => {
      res.setEncoding('utf8');

      let rawData = '';
      // combine data chunks
      res.on('data', (chunk) => { rawData += chunk; });
      // when the chunks stop coming in parse the html and pull out the data
      res.on('end', () => {
        try {
          rawData.replace(/(?:\n|\t|\r)/g, "")

          // $ parse html with cheerio
          var $ = cheerio.load(rawData)

          // this gets an array of <span>...</span>
          let $trArray = $('tr')
          $trArray.each((j, el) => {
            let $wellLogs = $(el).find('span:contains("Well Logs")')

            // if no logs exist
            if ($trArray.length < 3 && $wellLogs.text().toLowerCase() !== 'well logs' && j === 1) {
              console.log('no logs exist for this well', apis[i].api_abv)
              let dataObj = {
                api: apis[i].api,
                api_abv: apis[i].api_abv,
                doc_type: "n/a",
                doc_link: "n/a"
              }

              dataArray.push(dataObj)
            }

            // if well log exists
            else if ($wellLogs.text().toLowerCase() === 'well logs') {
              let log_description = $wellLogs.parent().parent().next().next().text()
              let log_href = $wellLogs.parent().parent().next().next().next().next().next().children().children().attr('href')

              let dataObj = {
                api: apis[i].api,
                api_abv: apis[i].api_abv,
                doc_type: log_description,
                doc_link: log_href
              }

              // see if the doc_link is already in the database
              // extra check
              let linkPos = existingApiData.map(function(res) {
                return res.doc_link
              }).indexOf(log_href)

              if (linkPos === -1) {
                dataArray.push(dataObj)
              }
            }

            if (dataArray.length > 5000 || (i === 99 && j === ($trArray.length - 1))) {
              console.log('new # of files', dataArray.length)
              writeFileSync(`db/seeds/log_data_${fileNumber}.json`, JSON.stringify(dataArray))
              dataArray = []
              fileNumber++
            }
          })
        } catch (e) {
          console.error(e.message)
        }
      });
    })
    req.on('error', (e) => console.log('problem with request: ' + e.message))

    // post the form
    req.write(`__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKLTQ1MjE3NDcxNQ9kFgICAw9kFgICAw9kFgICAQ9kFgJmD2QWEgIBDw8WAh4EVGV4dAUENTAwMGRkAgMPEA8WAh4LXyFEYXRhQm91bmRnZBAVDgASQnVzaW5lc3MgRG9jdW1lbnRzCUN1c3RvbWVycwtFbmZvcmNlbWVudApGYWNpbGl0aWVzBUZpZWxkCEhlYXJpbmdzCExvY2F0aW9uCE9wZXJhdG9yClByb2R1Y3Rpb24IUHJvamVjdHMHU2FtcGxlcwlXZWxsIExvZ3MFV2VsbHMVDgASQnVzaW5lc3MgRG9jdW1lbnRzCUN1c3RvbWVycwtFbmZvcmNlbWVudApGYWNpbGl0aWVzBUZpZWxkCEhlYXJpbmdzCExvY2F0aW9uCE9wZXJhdG9yClByb2R1Y3Rpb24IUHJvamVjdHMHU2FtcGxlcwlXZWxsIExvZ3MFV2VsbHMUKwMOZ2dnZ2dnZ2dnZ2dnZ2dkZAIJDxYCHg1XYXRlcm1hcmtUZXh0BQ1TZWxlY3QgYSBUeXBlZAIPDw8WAh4JTWF4TGVuZ3RoZmRkAhUPFhAeGUN1bHR1cmVEZWNpbWFsUGxhY2Vob2xkZXIFAS4eB0N1bHR1cmUFBWVuLVVTHhtDdWx0dXJlVGhvdXNhbmRzUGxhY2Vob2xkZXIFASweDkN1bHR1cmVEYXRlRk1UBQNNRFkeFkN1bHR1cmVBTVBNUGxhY2Vob2xkZXIFBUFNO1BNHhZDdWx0dXJlRGF0ZVBsYWNlaG9sZGVyBQEvHiBDdWx0dXJlQ3VycmVuY3lTeW1ib2xQbGFjZWhvbGRlcgUBJB4WQ3VsdHVyZVRpbWVQbGFjZWhvbGRlcgUBOmQCFw8PZBYuHg5Ub29sdGlwTWVzc2FnZQUMSW5wdXQgYSBkYXRlHhNNYXhpbXVtVmFsdWVNZXNzYWdlZR4TTWluaW11bVZhbHVlTWVzc2FnZWUeClZhbGlkRW1wdHkFBHRydWUeB0NlbnR1cnkFBDE5MDAeEmV2YWx1YXRpb25mdW5jdGlvbgUXTWFza2VkRWRpdFZhbGlkYXRvckRhdGUeGENsaWVudFZhbGlkYXRpb25GdW5jdGlvbmUeEExhc3RNYXNrUG9zaXRpb24FAjExHhFGaXJzdE1hc2tQb3NpdGlvbgUBMB4MTWluaW11bVZhbHVlZR4MTWF4aW11bVZhbHVlZR4KRGF0ZUZvcm1hdAUDTURZHhRWYWxpZGF0aW9uRXhwcmVzc2lvbmUeDElzTWFza2VkRWRpdAUEdHJ1ZR4IQ3NzRm9jdXMFD01hc2tlZEVkaXRGb2N1cx4TSW52YWxpZFZhbHVlTWVzc2FnZQUPRGF0ZSBpcyBpbnZhbGlkHg9UYXJnZXRWYWxpZGF0b3IFD3R4dERvY3VtZW50RGF0ZR4USW52YWxpZFZhbHVlQ3NzQ2xhc3MFD01hc2tlZEVkaXRFcnJvch4PQ3NzQmx1ck5lZ2F0aXZlBRZNYXNrZWRFZGl0Qmx1ck5lZ2F0aXZlHhBDc3NGb2N1c05lZ2F0aXZlBRdNYXNrZWRFZGl0Rm9jdXNOZWdhdGl2ZR4RRW1wdHlWYWx1ZU1lc3NhZ2UFEERhdGUgaXMgcmVxdWlyZWQeDEluaXRpYWxWYWx1ZWUeDURhdGVTZXBhcmF0b3IFAS9kAhkPDxYCHwNmZGQCHw8WEB8EBQEuHwUFBWVuLVVTHwYFASwfBwUDTURZHwgFBUFNO1BNHwkFAS8fCgUBJB8LBQE6ZAIhDw9kFi4fDAUMSW5wdXQgYSBkYXRlHw1lHw5lHw8FBHRydWUfEAUEMTkwMB8RBRdNYXNrZWRFZGl0VmFsaWRhdG9yRGF0ZR8SZR8TBQIxMR8UBQEwHxVlHxZlHxcFA01EWR8YZR8ZBQR0cnVlHxoFD01hc2tlZEVkaXRGb2N1cx8bBQ9EYXRlIGlzIGludmFsaWQfHAUPdHh0UmVsZWFzZWREYXRlHx0FD01hc2tlZEVkaXRFcnJvch8eBRZNYXNrZWRFZGl0Qmx1ck5lZ2F0aXZlHx8FF01hc2tlZEVkaXRGb2N1c05lZ2F0aXZlHyAFEERhdGUgaXMgcmVxdWlyZWQfIWUfIgUBL2QYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgQFB2J0bkluZm8FBmltZ0NhbAUMSW1hZ2VCdXR0b24xBQhidG5DbG9zZYVZfaAewkxjn8eDhig4Hs1dcCFes7vtcxy8UBmSov6d&__VIEWSTATEGENERATOR=C5CF1CF2&__EVENTVALIDATION=%2FwEdAB6m4w4fWlM6SvTi71dWCDjV3aJvDuFb%2F2p1hCWCRrS5YmbW8kck8nFk6519prMR6G7QrWrUDIWgy3Xo0kv3kL9jHht1ozL5BgleKvQPH6Cca0vS5Ds4FXn4d2mC%2B9EhvwuVBxaSygm6TPjGx4qUK%2BuWUlALSyaW9NpgE%2FWD8r8vQ2lVPmObft7bV3hj5qcdu8muov%2FhDnujsAFVaDS24HyzCoymaCNSbOK2jvLAdkuKgildBFffKeKTe1tb4%2B3%2B%2FJBs0x%2FAEZyx6sGp7HsV2rROwpmqj1uU0q1WcNRxkj6HedmY3m6t1%2FivZZafeFoWIC%2BgcBMNMEGd%2BSyKXRpsOkFjXfv98LOj71m6K1xzmyvEeKIrFpqoF9tBM4han22foiXsIg36X%2Fmd8dxlAnjFxv61iRvBsX8frBHbtKHAbgDhJKAjtwEjncTzWk9gkZ9SGF%2BJAaNKMjzBfagbeWiQhTLy3gQY%2BcjWU2bBUw1o6B8c24rGWAT5q3ZsqXx9n4EMLZLpkAKvHlFmeWUpJ6tT4i4qWMpmwNMT4y0NEL6HdPS3%2Brqic3S0ZDjCzqE9M2ZhdeQ18sL2VwHNiO0op9kbIMt9NpGzZOwh9RDF3%2FtMV5ai887FdbrBv%2FLhuLf7Yi2%2Bt89IXeEzBtf7U7%2Fj%2BVLcVpCBChLGVsPNmfGLO2sjMMa4hA%3D%3D&ddlClass=Well+Logs&txtUniqueIdentifier=${apis[i].api_abv}&waterUniqueIdentifier_ClientState=&txtDocumentNumber=&txtDocumentName=&txtDocumentDate=&MaskedEditExtender5_ClientState=&txtReleasedDate=&MaskedEditExtender1_ClientState=&SearchButton=Search&ptype=1`)

    req.end()
  }, 2000)
}
