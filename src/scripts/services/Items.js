import {getAllFixedHost} from 'Scripts/services/FixedHost.js'

function getItemDetails(gnoList) {
  const API = `/api/items/v2/list`
  const API_URL = `${getAllFixedHost().rapi}/${API}`
  const URL = `https://rapi.ruten.com.tw${API}`

  return new Promise((resolve, reject) => {
    if(!gnoList.length) return resolve([])
    let data = {
      gno: gnoList.join(','),
      level: 'simple'
    }

    $.ajax({
      url: URL,
      data,
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
    }).done(res => {
      resolve(res)
    }).fail(err => {
      reject()
    })
  })
}

export {
  getItemDetails
}

// https://rapi.stage.ruten.com.tw/api/items/v2/list?
// const rAPIHost = resolveHost('rapi') === 'https://prestage.rapi.dev5.ruten.com.tw' ? 'https://kanghu1016.rapi.dev5.ruten.com.tw' : resolveHost('rapi')
// const APIURL = rAPIHost+API
// const PROD = `https://rapi.ruten.com.tw/${API}`
// const STAGE = `https://rapi.stage.ruten.com.tw/${API}`
// const DEV = `https://kanghu1016.dev2.ruten.com.tw/${API}`
