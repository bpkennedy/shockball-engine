import Player from './player'
import Field from './field'

export default class Main {
  constructor(util) {
    this.stopSim = false
    this.now = Date.now()
    this.then = Date.now()
    this.fps = 1000
    this.elapsed = null
    this.util = util
    this.testPlayer = null
    this.field = null
  }

  beginGame(framesPerSecond) {
    if (this.util.getType(framesPerSecond) === '[object Number]') {
      this.fps = framesPerSecond
      this.field = new Field(500, 500)
      this.field.init()
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
    if (!this.testPlayer) {
      this.testPlayer = new Player(5, 'Billy', 'Ballhog')
    }
    console.log('updating')
  }
  
  render() {
    this.field.render()
    this.testPlayer.render(this.field.canvas, this.field.ctx)
  }

}