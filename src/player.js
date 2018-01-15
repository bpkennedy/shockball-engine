import Util from './util'
const util = new Util()

export default class Player {
  constructor(uid, firstName, lastName, world, challenge, goalSide) {
    if (util.getType(uid) === '[object Number]' && util.getType(firstName) === '[object String]' && util.getType(lastName) === '[object String]') {
      this.uid = uid
      this.firstName = firstName
      this.lastName = lastName
      this.passing = 15
      this.toughness = 36 
      this.throwing = 20
      this.goalSide = goalSide
      this.challenge = challenge
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
      console.log('Player ' + this.uid + ' thinks: we are before kickoff...')
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
        console.log('Player ' + this.uid + ' thinks he can score.  He shoots!')
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
    } else if (pitch.state === 'normal_play' && ball.possessedBy !== null && ball.lastSideTouched === this.goalSide) {
      // Ball is being carried by a player of my team
    } else if (pitch.state === 'normal_play' && ball.possessedBy !== null && ball.lastSideTouched !== this.goalSide) {
      // Ball is being carried by a player of other team
      console.log('Player ' + this.uid + ' sees that ' + ball.possessedBy + ', on the other team, has the ball.')
    } else if (pitch.state === 'normal_play' && ball.possessedBy === null) {
      // Ball is has been fumbled during play and is free
    }
  }

  analyzeCanScore(ball, pitch) {
    const targetGoalResistence = Math.abs(pitch.goalResistence[this.goalSide])
    const absoluteGoalPit = Math.abs(pitch.goalPit[this.goalSide])
    if (absoluteGoalPit - Math.abs(ball.goalProximity) < targetGoalResistence) {
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
    this.challenge.addTryScore(this)
  }

  tryPass() {

  }

  tryRun(pitch, ball) {
    this.challenge.addTryRun(this)
  }

  tackleBall(ball) {
    this.challenge.addTackleBall(this)
  }

}