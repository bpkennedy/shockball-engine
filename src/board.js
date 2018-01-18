export default class Board {
  constructor(pitch) {
    this.leftTeamName = "???"
    this.rightTeamName = "???"
    this.leftScore = 0
    this.rightScore = 0
    this.gameTime = 0
    this.pitch = pitch
  }

  update() {
    if (this.pitch.state === 'play_on') {
      this.gameTime++
    }
  }

  reset() {
    this.gameTime = 0
  }

  addScore(side) {
    if (side === 'right') {
      this.rightScore++
    } else {
      this.leftScore++
    }
  }

}