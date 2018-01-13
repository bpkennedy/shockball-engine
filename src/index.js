import Main from './main'
import World from './world'
import Player from './player'
import Util from './util'

const util = new Util()
let main = new Main(util, World, Player)

main.beginGame(1000)