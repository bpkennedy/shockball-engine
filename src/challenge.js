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
    this.world = world
    this.pitch = this.world.objects[0]
    this.board = this.world.objects[1]
    this.ball = this.world.objects[2]
    this.leftPlayers = this.world.leftPlayers
    this.rightPlayers = this.world.rightPlayers
    if (this.tackleBall.length) {
      this.resolveTackleBall()
    }
    if (this.playerTryRun.length) {
      this.resolvePlayerRun()
    }
    if (this.playerTryScore.length) {
      this.resolvePlayerTryScore()
    }
    if (this.playerTryPass.length) {
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
    const highestToughness = Math.max.apply(Math, this.tackleBall.map(function(player) {
      return player.toughness;
    }))
    const winningPlayer = this.tackleBall.find(function(player) {
      return player.toughness === highestToughness
    })
    console.log('Player ' + winningPlayer.uid + ' wins the tackle on the ball!')
    this.record.add(winningPlayer, 'tackles ball', this.board.gameTime)
    this.ball.possess(winningPlayer.uid)
    this.ball.lastSideTouched = this.goalSide
    this.ball.lastPlayerTouched = this.uid
  }

  resolvePlayerRun() {
    // here the player THINKS he can ran, but in reality he'd have challengers.
    // for now, he is unhindered
    const theBall = this.ball
    const runningPlayer = this.playerTryRun.find(function(player) {
      return player.uid === theBall.possessedBy
    })

    if (Math.abs(this.ball.goalProximity) < Math.abs(this.pitch.goalPit[runningPlayer.goalSide])) {
      if (runningPlayer.goalSide === 'right') {
        console.log('Player ' + runningPlayer.uid + ' tries to run left with the ball!')
        this.record.add(runningPlayer, 'runs ball', this.board.gameTime)
        this.ball.goalProximity--
      } else if (runningPlayer.goalSide === 'left') {
        console.log('Player ' + runningPlayer.uid + ' tries to run right with the ball!')
        this.record.add(runningPlayer, 'runs ball', this.board.gameTime)
        this.ball.goalProximity++
      }
    } else {
      console.log('Player ' + runningPlayer.uid + ' is right in front of goal!')
    }
  }

  resolvePlayerTryScore() {
    // here is where the player THINKS he can score so he TRIES, and it's where reality kicks in and other players are attempting to block/stop/intercept him.
    // for now, there are no other players so he's free to proceed unhindered, will write logic for challenging later
    const theBall = this.ball

    const shootingPlayer = this.playerTryScore.find(function(player) {
      return player.uid === theBall.possessedBy
    })
    
    console.log('Player ' + shootingPlayer.uid + ' scores a goal!!')
    this.record.add(shootingPlayer, 'shoots', this.board.gameTime)
    this.ball.reset()
    this.board.addScore(shootingPlayer.goalSide)
    this.pitch.lastGoalSide = shootingPlayer.goalSide
    this.pitch.state = 'before_kickoff'
    this.ball.lastSideTouched = null
  }

  resolvePlayerTryPass() {
    // player THINKS he can score so he tries.  We will need to transfer the ball possession to another player on success.
    const theBall = this.ball
    const leftPlayers = this.leftPlayers.slice()
    console.log(leftPlayers)
    const rightPlayers = this.rightPlayers.slice()
    console.log(rightPlayers)
    let playerToPassTo = null;

    const passingPlayer = this.playerTryPass.find(function(player) {
      return player.uid === theBall.possessedBy
    })
    
    //TODO make much better determination here!
    console.log('Player ' + passingPlayer.uid + ' passes the ball.');
    if (passingPlayer.goalSide === 'right') {
      const availableTeammates = leftPlayers.filter(function(player) {
        return player.uid !== passingPlayer.uid
      })
      playerToPassTo = chance.pickone(availableTeammates, 1)
      this.record.add(passingPlayer, 'passes ball', this.board.gameTime)
      this.ball.goalProximity++
    } else {
      const availableTeammates = rightPlayers.filter(function(player) {
        return player.uid !== passingPlayer.uid
      })
      playerToPassTo = chance.pickone(rigavailableTeammateshtPlayers, 1)
      this.record.add(passingPlayer, 'passes ball', this.board.gameTime)
      this.ball.goalProximity++
    }
    this.ball.possessedBy = playerToPassTo.uid
  }

}