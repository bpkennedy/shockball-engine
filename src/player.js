import Util from './util'
const util = new Util()

export default class Player {
  constructor(uid, firstName, lastName, world, goalSide) {
    if (util.getType(uid) === '[object Number]' && util.getType(firstName) === '[object String]' && util.getType(lastName) === '[object String]') {
      this.uid = uid
      this.firstName = firstName
      this.lastName = lastName
      this.x = 0
      this.y = 0
      this.passing = 15
      this.toughness = 36 
      this.throwing = 20
      this.goalSide = goalSide
      this.realWorldModel = world
      this.playerWorldModel = {
        objects: []
      }
    } else {
      throw new Error('Cannot create Player: incorrect param data types');
    }
  }

  update() {
    this.think() //should set player's perception of world model via player's skills
    this.takeAction() 
  }

  think() {
    //we start with the real world model
    const gameObjects = this.realWorldModel.objects
    // we will do calulcations here to modify based on Perception skill of this unique player's Perception attribute
    // for now, let's assume this player is godlike and his perception is exactly the reality of the world

    // player's perception of the pitch - what is the state of the game
    const pitch = gameObjects[0]
    this.playerWorldModel.objects.push(pitch)
    // board probably isn't relevant to perception/reality, but we need it for the array order
    const board = gameObjects[1]
    this.playerWorldModel.objects.push(board)
    // player's perception of the ball - where it's at, who has it, how close to goal
    const ball = gameObjects[2]
    this.playerWorldModel.objects.push(ball)
    // player's perception of other players
    const players = gameObjects[3]
    this.playerWorldModel.objects.push(players)

    // now we have rebuilt the playerWorldModel the way this unique player interprets it, hopefuly granting more agency for his/her actions
  }

  takeAction() {
    const gameObjects = this.playerWorldModel.objects
    const pitch = gameObjects[0]
    const board = gameObjects[1]
    const ball = gameObjects[2]
    const players = gameObjects[3]
    if (pitch.state === 'before_kickoff') {
      console.log('Player thinks: we are before kickoff...')
      // we are before kickoff so player wants to get the ball
      console.log('Player ' + this.uid + ' tries to tackle ball')
      this.tackleBall(ball)
      return
    }
    if (pitch.state === 'normal_play' && ball.possessedBy === this.uid) {
      // this player has the ball - better trying priority 1 action first!
      // player looks to score first, if he's in range.
      // for now the goal is empty and it has a default resistence of 2
      // for now the goalPosition (default 5) minus the goalProximity must be less than the goal resistence (default 2)
      const thinksHasScoreChance = this.analyzeCanScore(ball, pitch)
      if (thinksHasScoreChance) {
        console.log('Player ' + this.uid + ' thinks he has a score chance!')
        console.log('He shoots...')
        this.tryScore(pitch, ball, board)
        return
      } else {
        console.log('Player ' + this.uid + ' doesn\'t think he has a chance to score..')
        // so he doesn't think he can score, so now move to priority 2 action - getting ball closer to scoring via pass or run
        // for now this player thinks "if my throwing + passing is lower than my toughness then I'll run.  otherwise I'll pass"
        const thinksCanPass = this.analyzeCanPass()
        if (thinksCanPass) {
          this.tryPass()
          return
        } else { 
          this.tryRun(pitch, ball)
          return
        }
      }
    }
  }

  analyzeCanScore(ball, pitch) {
    const targetGoalResistence = pitch.goalResistence[this.goalSide]
    const absoluteGoalPit = Math.abs(pitch.goalPit[this.goalSide])
    if (absoluteGoalPit - ball.goalProximity < targetGoalResistence) {
      return true
    } else {
      return false
    }
  }

  analyzeCanPass() {
    if (this.throwing + this.passing > this.toughness) {
      return true
    } else {
      return false
    }
  }

  tryScore(pitch, ball, board) {
    // here is where the player THINKS he can score so he TRIES, and it's where reality kicks in and other players are attempting to block/stop/intercept him.
    // for now, there are no other players so he's free to proceed unhindered, will write logic for challenging later
    ball.reset()
    board.addScore(this.goalSide)
    pitch.lastGoalSide = this.goalSide
    pitch.state = 'before_kickoff'
  }

  tryPass() {

  }

  tryRun(pitch, ball) {
    // here the player THINKS he can ran, but in reality he'd have challengers.
    // for now, he is unhindered
    if (ball.goalProximity < pitch.goalPit[this.goalSide]) {
      console.log('Player ' + this.uid + ' tries to run with the ball!')
      ball.goalProximity++
    } else {
      console.log('Player ' + this.uid + ' is right in front of goal!')
    }
  }

  tackleBall(ball) {
    // here would be a struggle between whoever else on the field for control of the ball, or shot block, or pass interception/block, after winning the encounter, .possess is called
    ball.possess(this.uid)
  }

}