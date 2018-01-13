export default class Main {
  constructor(util, World, Player) {
    this.stopSim = false
    this.now = Date.now()
    this.then = Date.now()
    this.fps = 1000
    this.elapsed = null
    this.util = util
    this.World = World
    this.Player = Player
    this.counter = 0
  }

  beginGame(framesPerSecond) {
    if (this.util.getType(framesPerSecond) === '[object Number]') {
      this.fps = framesPerSecond
      //register world
      this.world = new this.World()
      //register pitch

      //register scoreboard

      //register players
      const test = new this.Player(1, 'Brian', 'Kennedy')
      this.world.register(test)
      this.world.rightPlayers.push(test)
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
      this.render()
      this.then = this.now - (this.elapsed % this.fps)
    }
    
    window.requestAnimationFrame(this.mainLoop.bind(this))
  }
  
  update() {
    this.world.update()
    this.counter++
    if (this.counter.toString() === '5') {
    }
    console.log('counter is: ' + this.counter )
  }
  
  render() {
  }

}