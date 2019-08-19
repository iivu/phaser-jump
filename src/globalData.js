const globalData = {

  chance: 0,

}


export function set(key, value) {

  globalData[key] = value
  return value

}

export function get(key) {

  return globalData[key]

}
