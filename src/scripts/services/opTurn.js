let type = 'toCamel'

function opTurnHyper(item) {
  type = 'toHypercase'
  return opTurn(item)
}

function opTurnCamel(item) {
  type = 'toCamel'
  return opTurn(item)
}

function isNull(item) {
  return item === null
}

function opTurn(item) {
  if(isNull(item)) {
    return item
  } else if(Array.isArray(item)) {
    return turnArr(item)
  } else if (typeof item === 'object') {
    return turnObj(item)
  } else {
    throw new Error('type error')
  }
}

function turnArr(arr) {

  return arr.map(item => {
    if(isNull(item)) {
      return item
    } else if(Array.isArray(item)) {
      return turnArr(item)
    } else if (typeof item === 'object') {
      return turnObj(item)
    } else {
      return type === 'toCamel' ? toCamelcase(item) : toHypercase(item)
    }
  })
}

function turnObj(obj) {
  let newObj = {}
  Object.keys(obj).map(key => {
    let value = obj[key]
    let newKey = type === 'toCamel' ? toCamelcase(key) : toHypercase(key)
    let newValue
    if(isNull(value)) {
      newValue = value
    } else if(Array.isArray(value)) {
      newValue = turnArr(value)
    } else if (typeof value === 'object'){
      newValue = turnObj(value)
    } else {
      newValue = value
    }
    newObj[newKey] = newValue
  })
  return newObj
}

function toCamelcase(string = '') {
  // skip string with all caps
  if(string.match(/^[^a-z]*$/) !== null) return string
  string = string.substring(0, 1).toLowerCase() + string.substring(1, string.length)
  return string.split('_').reduce((reducer, item) => {
    return reducer + item.replace(/[^]/, item.charAt(0).toUpperCase())
  })
}

function toHypercase(string) {
  return string.replace(/[A-Z]/g, function(match, ...p){
    return '_' + match.toLowerCase()
  })
}


export {
  opTurnCamel,
  opTurnHyper,
  toHypercase,
  toCamelcase
}