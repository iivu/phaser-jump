const globalData = {

  chance: 3,
  totalScore: 0,
  isBindMobile: 0,
  firstBoxStatus: 0,
  secondBoxStatus: 0,
}

export function set(key, value) {

  globalData[key] = value
  return value

}

export function get(key) {

  return globalData[key]

}
