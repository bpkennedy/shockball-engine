export default class Pitch {
  constructor() {
    this.state = 'before_kickoff'
    this.lastGoalSide = null
    this.secondHalf = false
    this.halfTime = 10000
    this.goalPillars = {
      left: -5,
      right: 5
    }
    this.world = undefined
  }

  checkRules(world) {
    this.world = world
  }

  update() {
  }

  reset() {
    this.changeState('before_kickoff')
  }

  isGoal() {
    //for now always score
    return true
  }

  changeState(state) {
    this.state = state
  }

}