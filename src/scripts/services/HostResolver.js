/**
 * 用目前瀏覽器上的網址列上的url來組出露天其他domain url
 * @namespace HostResolverService
 * @memberof external:Utility
 */
const hostNames = ['www','rtapi', 'rapi', 'point', 'member', 'm', 'mobile', 'mybid', 'mybidu', 'mass', 'ahd', 'search', 'bidadm', 'class', 'goods', 'pub', 'alert']
const envMapping = {
  'rtapi': {
    'dev2.ruten.com.tw': 'dev.ruten.com.tw'
  },
  'rapi': {
    'dev.ruten.com.tw': 'dev5.ruten.com.tw',
    'dev2.ruten.com.tw': 'dev5.ruten.com.tw'
  },
  'im2': {
    'dev2.ruten.com.tw': 'dev.ruten.com.tw'
  }
}

function _genDomainHost(host) {
  let regexp = /([^/]+)+\.ruten\.com\.tw/g,
  matches = regexp.exec(window.location.hostname),
  nodes = matches[1].split('.'),
  env = (Array.isArray(nodes) && nodes.length !== 1) ? `${nodes[nodes.length-1]}.ruten.com.tw` : 'ruten.com.tw',
  user = (nodes.length === 3) ? nodes[0] : undefined

  user = (typeof user === 'undefined' && (env === 'dev.ruten.com.tw' || env === 'dev2.ruten.com.tw') && nodes.length === 2 && nodes[0] === 'test') ? 'prestage' : user

  if(envMapping[host] && envMapping[host][env]) {
    env = envMapping[host][env]
  }

  // quick fix
  if(host === 'mobile' && env === 'ruten.com.tw') host = 'm'
  if((host === 'rtapi' || host === 'im2') && env === 'dev.ruten.com.tw') user = null
  if(host === 'im2' && env === 'ruten.com.tw') host = 'im'  //線上使用 im host
  if((host === 'rtapi' || host === 'im2') && env === 'stage.ruten.com.tw') {
    env = 'ruten.com.tw'
    host = 'rtapi'
  }

  let urlNodes = [host, env]
  user && urlNodes.unshift(user)

  return `https://${urlNodes.join('.')}`
}

/**
 * 取得對應的domain url
 * @function getHost
 * @param  {String} key domain名稱
 * @return {String}    url
 * @memberOf external:Utility.HostResolverService
 */
function resolveHost(key) {
  if(key && hostNames.indexOf[key] !== -1) {
    return _genDomainHost(key)
  }
}

/**
 * 取得所有domain url
 * @function getAllHosts
 * @return {Array} url list
 * @memberOf external:Utility.HostResolverService
 */
function resolveAllHosts() {
  let allHosts = {}
  hostNames.forEach(domain => {
    allHosts[domain] = _genDomainHost(domain)
  })
  return allHosts
}


export {
  resolveHost,
  resolveAllHosts
}
