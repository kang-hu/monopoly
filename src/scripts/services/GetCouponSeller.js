import {getAllFixedHost} from 'Scripts/services/FixedHost.js'

/**
 * 取得Coupon適用賣家
 * @function getCouponSeller
 * @param (eid,itemNum)
 * @return {Promise} 回傳Promise物件
 * "data":[
 *   {"user_nick":"ac02","user_img":"https:\/\/img.ruten.com.tw\/credit_photo\/a\/c\/ac02_418.jpg"},
 *   {"user_nick":"ac01","user_img":"https:\/\/img.ruten.com.tw\/credit_photo\/a\/c\/ac01_92.jpg"}
 * ]
 */

// const API = `https://rapi.dev5.ruten.com.tw/api/events/v1/coupon/`
// const PROD = `https://rapi.ruten.com.tw/api/events/v1/coupon/`
// const STAGE = `https://rapi.stage.ruten.com.tw/api/events/v1/coupon/`
// const DEV_API = `https://jillcheng.rapi.dev5.ruten.com.tw/api/events/v1/coupon/`

const API_URL = `${getAllFixedHost().rapi}/api/events/v1/coupon/`

function apiUrl(eid, itemNum) {
  let pages = itemNum > 1 ? `?per_page=${itemNum}` : ''
  return `${API_URL}${eid}/sellers${pages}`
}

const getCouponSeller = (eid, itemNum = 1) => {
  return new Promise((resolve, reject) => {

    if(!eid) reject('eventID 錯誤')

    $.ajax({
      url: apiUrl(eid, itemNum),
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
    })
    .done( res => {
      resolve(res)
    })
    .fail( err => {
      reject(err)
    })
  })
}

export {
  getCouponSeller
}