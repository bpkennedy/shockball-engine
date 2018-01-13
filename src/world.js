import Util from './util'

export default class World {
  constructor() {
   this.objects = []
   this.leftPlayers = []
   this.rightPlayers = []
  }

  register(object) {
    if (Util.getType(amount) === '[object Number]') {
      this.objects.push(object)
    }
  }

  unregister(object) {
    if (Util.getType(amount) === '[object Number]') {
      this.objects.push(object)
    }
  }
  
  moveUp(amount) {
    if (Util.getType(amount) === '[object Number]') {
      this.y += amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  moveDown(amount) {
    if (Util.getType(amount) === '[object Number]') {
      this.y -= amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  moveLeft(amount) {
    if (Util.getType(amount) === '[object Number]') {
      this.x -= amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  moveRight(amount) {
    if (Util.getType(amount) === '[object Number]') {
      this.x += amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  setPosition(x, y) {
    if (Util.getType(x) === '[object Number]' && Util.getType(y) === '[object Number]') {
      this.x = x;
      this.y = y;
    } else {
      throw new Error('Cannot set Player: incorrect param data types');
    }
  }

}