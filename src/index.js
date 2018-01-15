import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Util from './util'
import Challenge from './challenge'

const util = new Util()
let main = new Main(util, World, Player, Pitch, Board, Ball, Challenge)

main.beginGame(5000)