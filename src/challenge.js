import Chance from 'chance'
const chance = new Chance()

export default class Challenge {
  constructor(record) {
    this.world = null
    this.pitch = null
    this.board = null
    this.ball = null
    this.leftPlayers = null
    this.rightPlayers = null
    this.tackleBall = []
    this.playerTryRun = []
    this.playerTryScore = []
    this.playerTryPass = []
    this.record = record
  }

  update(world) {
    console.log('challenge update was called')
    this.world = world
    this.pitch = this.world.objects[0]
    this.board = this.world.objects[1]
    this.ball = this.world.objects[2]
    this.leftPlayers = this.world.leftPlayers
    this.rightPlayers = this.world.rightPlayers
    if (this.tackleBall.length > 0) {
      this.resolveTackleBall()
    }
    if (this.playerTryRun.length > 0) {
      this.resolvePlayerRun()
    }
    if (this.playerTryScore.length > 0) {
      this.resolvePlayerTryScore()
    }
    if (this.playerTryPass.length > 0) {
      this.resolvePlayerTryPass()
    }
  }

  reset() {
    this.tackleBall = []
    this.playerTryRun =[]
    this.playerTryScore = []
    this.playerTryPass = []
  }

  addTackleBall(player) {
    this.tackleBall.push(player)
  }

  addTryRun(player) {
    this.playerTryRun.push(player)
  }

  addTryScore(player) {
    this.playerTryScore.push(player)
  }

  addTryPass(player) {
    this.playerTryPass.push(player)
  }

  resolveTackleBall() {
    // here would be a struggle between whoever else on the field for control of the ball, or shot block, or pass interception/block, after winning the encounter, .possess is called
    // for now the Toughness attribute determines who wins the Tackle
    // for now we look at each player vying to tackle the ball, and add their Toughness and a random dice roll - highest wins
    this.tackleBall.map(function(player){
      player.tackleScore = player.toughness + chance.rpg('2d6', {sum:true})
    })
    const highestTackleScore = Math.max.apply(Math, this.tackleBall.map(function(player) {
      return player.tackleScore;
    }))
    const winningPlayer = this.tackleBall.find(function(player) {
      return player.tackleScore === highestTackleScore
    })
    this.record.add(winningPlayer, 'tackles ball', this.board.gameTime)
    this.ball.possess(winningPlayer.uid)
    this.ball.lastSideTouched = winningPlayer.homeGoalSide
    this.ball.lastPlayerTouched = winningPlayer.uid
  }

  resolvePlayerRun() {
    // here the player THINKS he can ran, but in reality he'd have challengers.
    // for now, he is unhindered
    const theBall = this.ball
    const runningPlayer = this.playerTryRun.find(function(player) {
      return player.uid === theBall.possessedBy
    })

    if (Math.abs(this.ball.goalProximity) < Math.abs(this.pitch.goalPit[runningPlayer.homeGoalSide])) {
      if (runningPlayer.homeGoalSide === 'right') {
        console.log('running left')
        this.record.add(runningPlayer, 'runs ball', this.board.gameTime)
        this.ball.goalProximity--
      } else if (runningPlayer.homeGoalSide === 'left') {
        console.log('running right')
        this.record.add(runningPlayer, 'runs ball', this.board.gameTime)
        this.ball.goalProximity++
      }
    } else {
      console.log('in this player run else')
    }
  }

  resolvePlayerTryScore() {
    // here is where the player THINKS he can score so he TRIES, and it's where reality kicks in and other players are attempting to block/stop/intercept him.
    // for now, there are no other players so he's free to proceed unhindered, will write logic for challenging later
    const theBall = this.ball
    const shootingPlayer = this.playerTryScore.find(function(player) {
      return player.uid === theBall.possessedBy
    })

    if (!shootingPlayer) {
      // if there is no shooting player then it could be because the ballhandler didn't actually try to shoot (thus isn't in the array) but a player THOUGHT
      // that he might based on their playerWorldModel understanding!  Basically he got it wrong.  :).  So we return out of this function altogether.
      return
    }
    const attackingSide = shootingPlayer.homeGoalSide === 'left' ? 'right' : 'left'
    
    //this is the shot attempt, make a record
    this.record.add(shootingPlayer, 'shoots', this.board.gameTime)
    
    //we now need to calculate if he scored or missed/was blocked
    // we do a blanket probability of 60/30/10 for blocking by Guard then Wing and then Center.
    var probability = Math.random()
    let opposingPlayer = undefined
    if (probability < 0.4) {
      // Guard tries block action and if he fails, shooter is able to shoot
      opposingPlayer = this.playerTryScore.find(function(player) {
        return player.homeGoalSide === attackingSide && player.role === 'Guard'
      })
    } else if (probability < 0.6) {
      // Wing tries block action and if he fails, shooter is able to shoot 
      opposingPlayer = this.playerTryScore.find(function(player) {
        return player.homeGoalSide === attackingSide && player.role === 'Wing'
      })
    } else {
      // Center tries block action and if he fails, shooter is able to shoot 
      opposingPlayer = this.playerTryScore.find(function(player) {
        return player.homeGoalSide === attackingSide && player.role === 'Center'
      })
    }

    //we handle here if generated bots by chance didn't have the right positions (I am not enforcing alwaysa  Guard, Wing, Center)
    if (!opposingPlayer) {
      //kinda hacky!
      opposingPlayer = shootingPlayer
    }

    const shootingScore = shootingPlayer.throwing + shootingPlayer.vision + chance.rpg('2d6', {sum:true})
    const blockingScore = opposingPlayer.blocking + opposingPlayer.vision + chance.rpg('2d6', {sum:true}) 

    if (shootingScore > blockingScore || shootingPlayer === opposingPlayer) {
      // shooter scores
      shootingPlayer.opposingActorUid = opposingPlayer.uid
      shootingPlayer.opposingActorFirstName = opposingPlayer.firstName
      this.record.add(shootingPlayer, 'goal', this.board.gameTime)
      theBall.reset()
      this.board.addScore(shootingPlayer.homeGoalSide)
      this.pitch.lastGoalSide = shootingPlayer.homeGoalSide
      this.pitch.state = 'before_kickoff'
      theBall.lastSideTouched = null
    } else {
      // shooter is blocked
      opposingPlayer.opposingActorUid = shootingPlayer.uid
      opposingPlayer.opposingActorFirstName = shootingPlayer.firstName
      this.record.add(opposingPlayer, 'goal blocked', this.board.gameTime)
      theBall.possessedBy = opposingPlayer.uid
      theBall.lastSideTouched = opposingPlayer.homeGoalSide
    }

  }

  resolvePlayerTryPass() {
    // player THINKS he can pass so he tries.  We will need to transfer the ball possession to another player on success.
    const theBall = this.ball
    const leftPlayers = this.leftPlayers.slice()
    const rightPlayers = this.rightPlayers.slice()
    let playerToWinPossession = null;

    const passingPlayer = this.playerTryPass.find(function(player) {
      return player.uid === theBall.possessedBy
    })

    if (!passingPlayer) {
      //we need to return because ball has been fumbled and noone possesses it
      return
    }

    //TODO make much better determination here!
    const attackingSide = passingPlayer.homeGoalSide === 'left' ? 'right' : 'left'
    var probability = Math.random()
    let opposingPlayer = undefined
    if (probability < 0.4) {
      // Guard tries block action and if he fails, shooter is able to shoot
      opposingPlayer = this.playerTryPass.find(function(player) {
        return player.homeGoalSide === attackingSide && player.role === 'Guard'
      })
    } else if (probability < 0.6) {
      // Wing tries block action and if he fails, shooter is able to shoot 
      opposingPlayer = this.playerTryPass.find(function(player) {
        return player.homeGoalSide === attackingSide && player.role === 'Wing'
      })
    } else {
      // Center tries block action and if he fails, shooter is able to shoot 
      opposingPlayer = this.playerTryPass.find(function(player) {
        return player.homeGoalSide === attackingSide && player.role === 'Center'
      })
    }

    //we handle here if generated bots by chance didn't have the right positions (I am not enforcing always a Guard, Wing, Center)
    if (!opposingPlayer) {
      //kinda hacky!
      opposingPlayer = passingPlayer
    }

    const passingScore = passingPlayer.passing + passingPlayer.vision + chance.rpg('2d6', {sum:true})
    const blockingScore = opposingPlayer.blocking + opposingPlayer.vision + chance.rpg('2d6', {sum:true})
    console.log('passingScore is ' + passingScore)
    console.log('blocking score is ' + blockingScore)


    if (passingScore > blockingScore || passingPlayer === opposingPlayer) {
      //pass will be successful, now choose what teammate to pass to
      if (passingPlayer.homeGoalSide === 'right') {
        const availableTeammates = rightPlayers.filter(function(player) {
          return player.uid !== passingPlayer.uid
        })
        playerToWinPossession = chance.pickone(availableTeammates, 1)
        this.record.add(passingPlayer, 'passes ball', this.board.gameTime)
        theBall.goalProximity++
      } else {
        const availableTeammates = leftPlayers.filter(function(player) {
          return player.uid !== passingPlayer.uid
        })
        playerToWinPossession = chance.pickone(availableTeammates, 1)
        this.record.add(passingPlayer, 'passes ball', this.board.gameTime)
        theBall.goalProximity--
      }
    } else {
      //passer is blocked
      this.record.add(opposingPlayer, 'pass blocked', this.board.gameTime)
      playerToWinPossession = opposingPlayer
      theBall.lastSideTouched = opposingPlayer.homeGoalSide

    }

    theBall.possessedBy = playerToWinPossession.uid
  }

}