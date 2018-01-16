import angular from 'angular'
import angularJson from 'json-tree2'

import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Util from './util'
import Challenge from './challenge'
import { setTimeout } from 'timers';

const util = new Util()
let main = new Main(util, World, Player, Pitch, Board, Ball, Challenge)

main.beginGame(3000)


var mainComponent = {
  controller: function ($scope){
    var ctrl = this;
    ctrl.isRunning = false;
    ctrl.game = main;
    ctrl.someMethod = function (event) {
      ctrl.api = event.message;
    };
    ctrl.$onInit = function() {
      if (!ctrl.isRunning) {
        ctrl.isRunning = true;
        setInterval(function() {
          $scope.$apply(main)
        }, 3000);
      }
    }
  },
  template: `
    <div>
      <div class="gameObject">
        <pre>
          <json-tree json="$ctrl.game" collapsed-level="4" edit-level="low" timeout="0" timeoutInit="0"></json-tree>
        </pre>
      </div>
      <h1>Shockball Match v0.1</h1>
      <div class="playByPlay">
        <div class="live-indicator" ng-if="$ctrl.isRunning">ON LIVE</div>
        <div class="scoreboard">
          <div class=""></div>
        </div>
        <div class="timeline">
          <ul>
            <li class="right">
              <div class="eventTime">20'</div>
              <div class="event-info">
                <div class="name">Brian</div>
                <div class="middleDot">&middot;</div>
                <div class="action">shoots</div>
              </div>
              <div class="eventText">smashes one off of the post!</div>
            </li>
            <li class="left">
              <div class="eventTime">24'</div>
              <div class="event-info">
                <div class="name">Yan</div>
                <div class="middleDot">&middot;</div>
                <div class="action">shoots</div>
              </div>
              <div class="eventText">tries for a quick shot!</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
};

angular.module('shockballGame', ['json-tree'])
.component('main', mainComponent)
