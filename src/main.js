import Challenge from "./challenge"
const challenge = new Challenge()

export default class Main {
  constructor(util, World, Player, Pitch, Board, Ball) {
    this.stopSim = false
    this.now = Date.now()
    this.then = Date.now()
    this.fps = 1000
    this.elapsed = null
    this.util = util
    this.World = World
    this.Player = Player
    this.Pitch = Pitch
    this.Board = Board
    this.Ball = Ball
    this.counter = 0
  }

  beginGame(framesPerSecond) {
    if (this.util.getType(framesPerSecond) === '[object Number]') {
      this.fps = framesPerSecond
      //register world
      this.world = new this.World()
      
      //register pitch
      const pitch = new this.Pitch()
      this.world.register(pitch)
      
      //register scoreboard
      const board = new this.Board(pitch)
      this.world.register(board)
      
      //register ball
      const ball = new this.Ball(pitch)
      this.world.register(ball)

      //register players
      const test = new this.Player(1, 'Brian', 'Kennedy', this.world, challenge, 'right')
      this.world.register(test)
      this.world.leftPlayers.push(test)
      const test2 = new this.Player(2, 'Yan', 'Yansen', this.world, challenge, 'left')
      this.world.register(test2)
      this.world.rightPlayers.push(test2)

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
    }
    // console.log('counter is: ' + this.counter )
  }

}