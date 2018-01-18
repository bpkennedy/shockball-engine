import Challenge from "./challenge"
let challenge = null // will set once this.record is available

export default class Main {
  constructor(util, World, Player, Pitch, Board, Ball, record) {
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
    this.record = record
    this.counter = 0
  }

  beginGame(framesPerSecond) {
    if (this.util.getType(framesPerSecond) === '[object Number]') {
      challenge = new Challenge(this.record)
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
      const playerObjectFromDb = {
        uid: 1,
        firstName: 'Tholme',
        lastName: 'So',
        picUrl: '//i736.photobucket.com/albums/xx4/bpkennedy/norringtonfreelance.jpg',
        teamUid: '-KnCepjY8BLF_0bcANzF',
        teamName: 'Abregado Gentlemen',
        teamPicUrl: 'http://www.brandcrowd.com/gallery/brands/thumbs/thumb14751184306802.jpg',
        passing: 15,
        toughness: 36,
        throwing: 20
      }
      const brian = new this.Player(playerObjectFromDb, this.world, challenge, 'right')
      this.world.register(brian)
      this.world.leftPlayers.push(brian)
      
      const playerObjectFromDb2 = {
        uid: 2,
        firstName: 'Yan',
        lastName: 'Yansen',
        picUrl: '//tresario.com/forum/index.php?action=dlattach;attach=271;type=avatar',
        teamUid: '-KnGp3lbMpZVvl1bGGvy',
        teamName: 'Kashyyk Rangers',
        teamPicUrl: 'https://vignette1.wikia.nocookie.net/limmierpg/images/4/42/Rangers.jpg/revision/latest?cb=20140503184850',
        passing: 15,
        toughness: 36,
        throwing: 20
      }
      const yan = new this.Player(playerObjectFromDb2, this.world, challenge, 'left')
      this.world.register(yan)
      this.world.rightPlayers.push(yan)

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