export default class Ball {
  constructor(pitch) {
    this.lastPlayerTouched = null
    this.lastSideTouched = null
    this.possessedBy = null
    this.lane = 'center' //or "right" or "left"
    this.goalProximity = 0
    this.pitch = pitch
  }

  update() {
    console.log('Goal proximity is: ' + this.goalProximity)
    if (this.possessedBy === null) {
      console.log('No-one has the ball')
    } else {
      console.log("Player " + this.possessedBy + " has the ball")
    }
  }

  reset() {
    this.goalProximity = 0
    this.possessedBy = null
    this.lastPlayerTouched = null
    this.lane = 'center'
  }

  possess(playerId) {
    this.possessedBy = playerId
    this.pitch.state = 'normal_play'
  }

}