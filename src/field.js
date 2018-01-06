import Util from './util'
const util = new Util()

export default class Field {
  constructor(fieldWidth, fieldHeight) {
    if (util.getType(fieldWidth) === '[object Number]' && util.getType(fieldHeight) === '[object Number]') {
      this.fieldWidth = fieldWidth;
      this.fieldHeight = fieldHeight;
      this.canvasExists = false
      this.canvas = null
      this.ctx = null
    } else {
      throw new Error('Cannot create Field: incorrect param data types');
    }
  }

  init() {
    console.log('in init')
    // Create the canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.fieldWidth;
    this.canvas.height = this.fieldHeight;
    document.body.appendChild(this.canvas);
    this.canvasExists = true;
  }

  update() {
  }

  render() {
    if (this.canvasExists) {
        console.log('in field render')
      this.ctx.fillStyle = "#ffffff"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

}