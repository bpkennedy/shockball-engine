import Util from './util'
const util = new Util()

export default class Player {
  constructor(uid, firstName, lastName) {
    if (util.getType(uid) === '[object Number]' && util.getType(firstName) === '[object String]' && util.getType(lastName) === '[object String]') {
      this.uid = uid
      this.firstName = firstName
      this.lastName = lastName
      this.x = 0
      this.y = 0
      this.count = 0
    } else {
      throw new Error('Cannot create Player: incorrect param data types');
    }
  }

  moveUp(amount) {
    if (util.getType(amount) === '[object Number]') {
      this.y += amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  moveDown(amount) {
    if (util.getType(amount) === '[object Number]') {
      this.y -= amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  moveLeft(amount) {
    if (util.getType(amount) === '[object Number]') {
      this.x -= amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  moveRight(amount) {
    if (util.getType(amount) === '[object Number]') {
      this.x += amount;
    } else {
      throw new Error('Cannot move Player: incorrect param data type');
    }
  }
  
  // setPosition(x, y) {
  //   if (util.getType(x) === '[object Number]' && util.getType(y) === '[object Number]') {
  //     this.x = x;
  //     this.y = y;
  //   } else {
  //     throw new Error('Cannot set Player: incorrect param data types');
  //   }
  // }

  update() {

  }

  render(canvas, ctx) {
    if (canvas) {
      console.log('in player render')
      this.count++
      this.x = canvas.width / 2 + this.count
      this.y = canvas.height / 2 + this.count
      ctx.fillStyle = "#000000"
      ctx.fillRect(this.x, this.y, 10, 10); // fill in the pixel at (10,10)
    }
  }

}