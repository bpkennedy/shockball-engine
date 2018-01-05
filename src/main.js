export default class Main {
  constructor(util) {
    this.stopSim = false
    this.now = Date.now()
    this.then = Date.now()
    this.fps = 1000
    this.elapsed = null
    this.util = util
  }

  beginGame(framesPerSecond) {
    if (this.util.getType(framesPerSecond) === '[object Number]') {
      this.fps = framesPerSecond
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
    console.log('updating')
  }
  
  render() {
  }

}