import Util from './util'
const util = new Util()

export default class World {
  constructor() {
   this.objects = []
   this.leftPlayers = []
   this.rightPlayers = []
  }

  register(object) {
    if (util.getType(object) === '[object Object]') {
      this.objects.push(object)
    }
  }

  update() {
console.log('registered objects are:')
console.log(this.objects)
  }

  switchSides() {
    const oldRightPlayers = this.rightPlayers
    const oldLeftPlayers = this.leftPlayers
    this.rightPlayers = oldLeftPlayers
    this.leftPlayers = oldRightPlayers
  }

}