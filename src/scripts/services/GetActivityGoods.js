import {opTurnCamel} from 'Scripts/services/opTurn.js'
import {getAllFixedHost} from 'Scripts/services/FixedHost.js'

/**
 * 取得Activity ID
 */

const _getActivity = (eid, itemNum = 1) => {
  const API = `https://rtapi.ruten.com.tw/api/campaigns/v1/activity/searchtag`
  // const DEV_API = `https://rtapi.dev.ruten.com.tw/api/campaigns/v1/activity/searchtag`

  // const API_URL = `${getAllFixedHost().rtapi}/api/campaigns/v1/activity/searchtag`

  return new Promise((resolve, reject) => {
    /* foo */
    // let foo = [{
    //   ActivityId: "ACT2019090001",
    //   ActivityItemList: [
    //     {
    //       ActivityItemId: "IT201909000215",
    //       ItemName: "彩票折抵 35% 商品金額 (6.5折)",
    //       ItemPosition: 5
    //     }
    //   ],
    //   TagColor: "yellow",
    //   TagText: "0902",
    // }]

    // resolve(opTurnCamel(foo))

    /* ajax */
    $.ajax({
      url: API,
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
    })
    .done( res => {
      resolve(opTurnCamel(res))
    })
    .fail( err => {
      reject(err)
    })
  })
}

 /**
 * 取得Coupon適用賣家
 * @function getActivityGoods
 * @param (uid)
 * @return {Promise} 回傳Promise物件
 * {
 *   Id: [21920000054610, 21931000057277]
 * }
 */

// https://rtapi.ruten.com.tw//api/campaigns/v1/main/recommender/uid/{uid}/activity/{activity_id}/prod
// 'ACT2019090001'

const getActivityGoods = (uid) => {  
  function apiUrl(uid, act) {
    const HOST = `https://rtapi.ruten.com.tw`
    return `${HOST}/api/campaigns/v1/main/recommender/uid/${uid}/activity/${act}/prod`
    // return `${getAllFixedHost().rtapi}/api/campaigns/v1/main/recommender/uid/${uid}/activity/${act}/prod`
  }

  return new Promise((resolve, reject) => {
    _getActivity().then((res)=>{
      if(res.length) {
        let act = res[0].activityId
        
        $.ajax({ 
          url: apiUrl(uid, act),
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
        })
        .done( res => {
          if (res.Id.length > 0) {
            resolve(res.Id.splice(0, 10))
          } else {
            resolve([])
          }
          resolve(res)
        })
        .fail( err => {
          reject(err)
        })

      } else {
        reject(false)
      } 

    }).catch(err=>{
      reject(err)
    })
  })
}

export {
  getActivityGoods
}