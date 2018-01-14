import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Util from './util'

const util = new Util()
let main = new Main(util, World, Player, Pitch, Board, Ball)

main.beginGame(3000)