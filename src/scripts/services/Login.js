import {getAllFixedHost} from 'Scripts/services/FixedHost.js'

const LOGIN_COOKIE_NAME = '1111_Login'
const LOGIN_API = `${getAllFixedHost().member}/user/ajax_header_slice.php`
let userNick = ''
let ctrlRowId = ''

const $_setLoginCookie = cookieName => {
  let cookieData = {
    id: ctrlRowId,
    user: userNick
  }
  Cookies.set(cookieName, JSON.stringify(cookieData), { domain: '.ruten.com.tw'})
}
const $_getLoginCookie = cookieName => {
  let $_cookie = Cookies.get(cookieName)
  return $_cookie !== undefined ? JSON.parse($_cookie) : null
}
const $_removeLoginCookie = cookieName => {
  Cookies.remove(cookieName)
}

const requestLoginInfomation = () => {
  return $.ajax({
    url: LOGIN_API,
    type: 'GET',
    xhrFields: { withCredentials: true }
  })
}

const checkLoginCookie = cookieName => {
  if (Cookies.get('bid_rid') === undefined) {
    $_removeLoginCookie(cookieName)
    return false
  }
  let $_cookie = $_getLoginCookie(cookieName)
  if ($_cookie !== null && $_cookie.hasOwnProperty('id') && $_cookie.hasOwnProperty('user')) {
    if ($_cookie.id !== Cookies.get('bid_rid')) return false
    userNick = $_cookie.user
    ctrlRowId = $_cookie.id
    return true
  } else {
    return false
  }
}

const getLoginStatus = () => {
  return new Promise((resolve, reject) => {
    if (checkLoginCookie(LOGIN_COOKIE_NAME)) {
      resolve({userNick, ctrlRowId})
    } else {
      if (Cookies.get('bid_rid') === 'undefined') reject('NoLogin')

      requestLoginInfomation()
        .done(response => {
          if (response !== 'null') {
            response = JSON.parse(response)
            userNick = response.user_nick
            ctrlRowId = Cookies.get('bid_rid')
            $_setLoginCookie(LOGIN_COOKIE_NAME)
            resolve({userNick, ctrlRowId})
          }
          reject('NoLogin')
        })
        .fail(()=>{reject('InternalError')})
    }
  })
}

export {
  getLoginStatus
}


// $.ajax({
//   url: `${ RT.config.mybid_host }/api/event/lottery/info.php?event=RM20191111`,
//   type: 'GET',
//   dataType: 'json',
//   xhrFields: {
//     withCredentials: true
//   },
//   data: {
//     event : event
//   }
// })
// .done( res => {
//   console.log(res)
// })
// .fail( res => {
//   console.log(res)
// })


// const memberHost = resolveHost('member') === 'https://prestage.member.dev2.ruten.com.tw' ? 'https://kanghu1016.rapi.dev5.ruten.com.tw' : resolveHost('member')
// const PROD = `https://member.ruten.com.tw`
// const STAGE = `https://member.stage.ruten.com.tw`
// const DEV = `https://kanghu1016.member.dev2.ruten.com.tw`