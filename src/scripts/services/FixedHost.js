const RUTEN = `ruten.com.tw`
const user = 'kanghu1016'
const env = 'PROD'
const envDevMapping = {
  'rtapi': 'dev2',
  'rapi': 'dev5',
}
const hostList = ['www','member','rapi','rtapi','mybid','goods']

// const PROD_HOST = `https://member.ruten.com.tw`
// const STAGE_HOST = `https://member.stage.ruten.com.tw`
// const DEV_HOST = `https://kanghu1016.member.dev2.ruten.com.tw`

function _composeHost(host, server) {
  let _user = env === 'DEV' && user ? `${user}.` : ''
  let _host = `${host}.`
  let _server
  let resultHost

  switch (env) {
    case 'PROD':
      _server = ''
      break
    case 'STAGE':
      _server = 'stage.'
      break
    case 'DEV':
      _server = envDevMapping[host] ? `${envDevMapping[host]}.` : 'dev2.'
      break
  } 
  
  resultHost = `https://${_user}${_host}${_server}${RUTEN}` 

  return resultHost
}

function getAllFixedHost() {
  let allHost = {}
  
  hostList.forEach(item => {
    allHost[item] = _composeHost(item)
  })

  return allHost
}

export {
  getAllFixedHost
}