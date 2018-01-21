import Util from './util'
const util = new Util()

export default class Player {
  constructor(playerStats, world, challenge, homeGoalSide) {
    if (util.getType(playerStats) === '[object Object]') {
      this.uid = playerStats.uid
      this.firstName = playerStats.firstName
      this.lastName = playerStats.lastName
      this.picUrl = playerStats.picUrl
      this.teamUid = playerStats.teamUid
      this.teamName = playerStats.teamName
      this.teamPicUrl = playerStats.teamPicUrl
      this.role = playerStats.role
      this.passing = playerStats.passing
      this.toughness = playerStats.toughness
      this.throwing = playerStats.throwing
      this.fatigue = playerStats.fatigue
      this.endurance = playerStats.endurance
      this.vision = playerStats.vision
      this.blocking = playerStats.blocking
      this.homeGoalSide = homeGoalSide
      this.challenge = challenge
      this.realWorldModel = world
      this.playerWorldModel = {
        objects: [],
        leftPlayers: [],
        rightPlayers: []
      }
    } else {
      throw new Error('Cannot create Player: incorrect param data types');
    }
  }

  update() {
    this.applyEffects()
    this.think() //should set player's perception of world model via player's skills
    this.takeAction() 
  }

  applyEffects() {
    // let's increase fatigue according to endurance stat
    this.fatigue += (this.endurance / 100)
    // high morale should equal a small netBuff
    // high aggro should equal a small netBuff but also increase chance of injury
  }

  think() {
    //we start with the real world model
    const gameObjects = this.realWorldModel.objects
    //we wipe away the player's old percieved world model
    this.playerWorldModel.objects = []
    this.playerWorldModel.leftPlayers = []
    this.playerWorldModel.rightPlayers = []

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
    const leftPlayers = this.realWorldModel.leftPlayers
    const rightPlayers = this.realWorldModel.rightPlayers
    this.playerWorldModel.leftPlayers = leftPlayers
    this.playerWorldModel.rightPlayers = rightPlayers

    // now we have rebuilt the playerWorldModel the way this unique player interprets it, hopefuly granting more agency for his/her actions
  }

  takeAction() {
    const gameObjects = this.playerWorldModel.objects
    const pitch = gameObjects[0]
    const board = gameObjects[1]
    const ball = gameObjects[2]

    console.log('states are ')
    console.log(pitch.state)
    console.log(ball.possessedBy)
    console.log(ball.lastSideTouched)
    console.log('this player side is ' + this.homeGoalSide)
    if (pitch.state === 'before_kickoff') {
      // we are before kickoff so player wants to get the ball
      this.tryTackleBall()
      return
    }
    if (pitch.state === 'play_on' && ball.possessedBy === this.uid) {
      // this player has the ball - better trying priority 1 action first!
      // player looks to score first, if he's in range.
      // for now the goal is empty and it has a default resistence of 2
      // for now the goalPosition (default 5) minus the goalProximity must be less than the goal resistence (default 2)
      const thinksHasScoreChance = this.analyzeCanScore(ball, pitch)
      if (thinksHasScoreChance) {
        this.tryScore(pitch, ball, board)
        return
      } else {
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
    } else if (pitch.state === 'play_on' && ball.possessedBy !== null && ball.lastSideTouched === this.homeGoalSide) {
      // Ball is being carried by a player of my team
      console.log('ball is being carried by my team?')
    } else if (pitch.state === 'play_on' && ball.possessedBy !== null && ball.lastSideTouched !== this.homeGoalSide) {
      // Ball is being carried by a player of other team
      console.log('ball is being carried by team other than me?')
      console.log(this)
      // for now the Player chooses to either block a shot or block a pass
      console.log(this.playerWorldModel)
      let thinksMoreLikelyToShoot = null;
      if (this.homeGoalSide === 'right') {
        console.log('I am ' + this.uid)
        console.log('goal is on the right')
        thinksMoreLikelyToShoot = this.analyzeMoreLikelyToShoot(this.playerWorldModel.leftPlayers, ball)
      } else {
        console.log('I am ' + this.uid)
        console.log('goalside is on the left')
        thinksMoreLikelyToShoot = this.analyzeMoreLikelyToShoot(this.playerWorldModel.rightPlayers, ball)
      }
      
      if (thinksMoreLikelyToShoot) {
        console.log('i made a choice about blocking shot')
        this.tryBlockShot()
      } else {
        console.log('i made a choice about blocking pass')
        this.tryBlockPass()
      }
    } else if (pitch.state === 'play_on' && ball.possessedBy === null) {
      // Ball is has been fumbled during play and is free
    }
  }

  analyzeMoreLikelyToShoot(players, ball) {
    //this is correctly working
    const ballCarrier = players.find(function(player) {
      return player.uid === ball.possessedBy
    })
    //simple determinatin right now - if throwing higher than passing, then this player assumes they'll shoot
    if (ballCarrier && ballCarrier.throwing > ballCarrier.passing) {
      return true
    } else {
      return false
    }
  }

  analyzeCanScore(ball, pitch) {
    const targetGoalResistence = Math.abs(pitch.goalResistence[this.homeGoalSide])
    const absoluteGoalPit = Math.abs(pitch.goalPit[this.homeGoalSide])
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
    this.challenge.addTryPass(this)
  }

  tryRun(pitch, ball) {
    this.challenge.addTryRun(this)
  }

  tryTackleBall() {
    this.challenge.addTackleBall(this)
  }

  tryBlockPass() {
    this.challenge.addTryPass(this)
  }

  tryBlockShot() {
    this.challenge.addTryScore(this)
  }

}