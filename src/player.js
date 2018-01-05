import Util from './util'

export default class Player {
  constructor(uid, firstName, lastName) {
    if (Util.getType(uid) === '[object Number]' && Util.getType(firstName) === '[object String]' && Util.getType(lastName) === '[object String]') {
      this.uid = uid;
      this.firstName = firstName;
      this.lastName = lastName;
      this.x = 0;
      this.y = 0;
    } else {
      throw new Error('Cannot create Player: incorrect param data types');
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