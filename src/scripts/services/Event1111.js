import {getAllFixedHost} from 'Scripts/services/FixedHost.js'


const EVENT_ID = 'RM20191111'
// https://redshoe.mybid.dev2.ruten.com.tw/api/event/lottery/info.php?event=RM20191111
 /**
 * {
 *   data: {
 *    coin: 5660,
 *    ticket: 1, 
 *    isRunnable: true
 *   },
 *   status: "Success"
 * }
 */
function getEventInfo() {
  const API = `api/event/lottery/info.php?event=`
  const API_URL = `${getAllFixedHost().mybid}/${API}${EVENT_ID}`

  return new Promise((resolve, reject) => {
    $.ajax({
      url: API_URL,
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
    }).done(res => {
      resolve(res.data)
    }).fail(err => {
      reject('伺服器發生問題請重整再試')
    })
  })
}

function lotteryExecute(g='') {
  const API = `api/event/lottery/execute.php`

  const API_URL = `${getAllFixedHost().mybid}/${API}`
  
  return new Promise((resolve, reject) => {
    let _data = {
      event: EVENT_ID,
    }

    $.ajax({
      url: API_URL,
      data: _data,
      dataType: 'json',
      type: 'POST',
      xhrFields: {
        withCredentials: true
      },
    }).done(res => {

      if( res && res.status === 'Success' ) {
        resolve(res.data)
      } else {
        reject(res.message)
      }

    }).fail(err => {
      reject('伺服器發生問題請重新整理再試')
    })
  })
}
// https://redshoe.mybid.dev2.ruten.com.tw/api/event/lottery/execute.php

export {
  getEventInfo,
  lotteryExecute
}

  // const PROD = `https://mybid.ruten.com.tw/${API}`
  // const STAGE = `https://mybid.stage.ruten.com.tw/${API}`
  // const DEV = `https://kanghu1016.mybid.dev2.ruten.com.tw/${API}`

  // const PROD = `https://mybid.ruten.com.tw/${API}`
  // const STAGE = `https://mybid.stage.ruten.com.tw/${API}`
  // const DEV = `https://redshoe.mybid.dev2.ruten.com.tw/${API}`