export default class Board {
  constructor(pitch) {
    this.leftTeamName = "???"
    this.rightTeamName = "???"
    this.leftScore = 0
    this.rightScore = 0
    this.timer = 0
    this.pitch = pitch
  }

  update() {
    if (this.pitch.state === 'play_on') {
      this.timer++
    }
  }

  reset() {
    this.timer = 0
  }

}