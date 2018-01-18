import Challenge from "./challenge"
import Util from './util'

let challenge = null // will set once this.record is available
const util = new Util()

export default class Main {
  constructor(matchData, World, Player, Pitch, Board, Ball, record) {
    this.stopSim = false
    this.now = Date.now()
    this.then = Date.now()
    this.fps = 1000
    this.elapsed = null
    this.matchData = matchData
    this.World = World
    this.Player = Player
    this.Pitch = Pitch
    this.Board = Board
    this.Ball = Ball
    this.record = record
    this.counter = 0
  }

  beginGame(framesPerSecond) {
    if (util.getType(framesPerSecond) === '[object Number]') {
      challenge = new Challenge(this.record)
      this.fps = framesPerSecond
      //register world
      this.world = new this.World()
      
      //register pitch
      const pitch = new this.Pitch(this.matchData)
      this.world.register(pitch)
      
      //register scoreboard
      const board = new this.Board(pitch)
      this.world.register(board)
      
      //register ball
      const ball = new this.Ball(pitch)
      this.world.register(ball)


      //register home team players on left side
      for (let player of this.matchData.homeTeam.players) {
        const playerToAdd = new this.Player(player, this.world, challenge, 'left')
        this.world.register(playerToAdd)
        this.world.leftPlayers.push(playerToAdd)
      }
      
      //register away team players on right side
      for (let player of this.matchData.awayTeam.players) {
        const playerToAdd = new this.Player(player, this.world, challenge, 'right')
        this.world.register(playerToAdd)
        this.world.rightPlayers.push(playerToAdd)
      }

      //start main game loop
      this.mainLoop()
    } else {
      throw new Error('Cannot start game: incorrect param data types')
    }
  }
  
  mainLoop() {
    if (this.stopSim) {
      return
    }
  
    this.now = Date.now();
    this.elapsed = this.now - this.then
  
    if (this.elapsed > this.fps) {
      this.update()
      this.then = this.now - (this.elapsed % this.fps)
    }
    
    window.requestAnimationFrame(this.mainLoop.bind(this))
  }
  
  update() {
    this.world.update()
    challenge.update(this.world)
    challenge.reset()
    this.counter++
    if (this.counter.toString() === '5') {
      // this.stopSim = true
    }
    // console.log('counter is: ' + this.counter )
  }

}