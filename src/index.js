import angular from 'angular'
import angularJson from 'json-tree2'
import scrollGlue from 'angularjs-scroll-glue'

import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Record from './record'
import MatchData from './matchData'

const matchData = new MatchData()
const record = new Record()

let main = new Main(matchData, World, Player, Pitch, Board, Ball, record)

main.beginGame(3000)

// create the front-end ui with angular
var mainComponent = {
  controller: function ($scope){
    var ctrl = this;
    ctrl.isRunning = false;
    ctrl.game = main;
    ctrl.world = ctrl.game.world.objects;
    ctrl.leftPlayers = ctrl.game.world.leftPlayers;
    ctrl.rightPlayers = ctrl.game.world.rightPlayers;
    ctrl.gameEvents = record.records;
    ctrl.matchViewerRelativeTime = 'ON LIVE';
    ctrl.setViewerRelativeTime = function() {
      if (ctrl.game.stopSim) {
        ctrl.matchViewerRelativeTime = ctrl.world[1]['startTime']
        ctrl.isRunning = false;
      }
    },
    ctrl.someMethod = function (event) {
      ctrl.api = event.message;
    };
    ctrl.$onInit = function() {
      if (!ctrl.isRunning) {
        ctrl.isRunning = true;
        setInterval(function() {
          $scope.$apply(main)
          ctrl.setViewerRelativeTime()
          console.log(ctrl.gameEvents)
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
        <div class="live-indicator" ng-if="$ctrl.isRunning">
          ON LIVE
          <div class="fa fa-clock-o"></div>
        </div>
        <div class="scoreboard">
          <div class="leftTeamLogo" back-img="{{$ctrl.leftPlayers[0]['teamPicUrl']}}"></div>
          <div class="rightTeamLogo" back-img="{{$ctrl.rightPlayers[0]['teamPicUrl']}}"></div>
          <div class="venue">
            <div class="viewerRelativeTime">{{$ctrl.matchViewerRelativeTime}}</div>
            <div class="matchLocation">{{::$ctrl.world[0]['pitchOwnedBy']}}</div>
          </div>
          <div class="teamNames">
            <div class="leftTeamName">{{$ctrl.leftPlayers[0]['teamName']}}</div>
            <div class="nameSpacer"> - </div>
            <div class="rightTeamName">{{$ctrl.rightPlayers[0]['teamName']}}</div>
          </div>
          <div class="scoreCount">
            <div class="leftTeamScore">
              {{$ctrl.world[1]['leftScore']}}
              <div class="leftTeamColor"></div>
            </div>
            <div class="gameTime">
              <div class="colorBand">
                <div class="timeSpinner">
                  {{$ctrl.world[1]['gameTime']}}'
                </div>
              </div>
            </div>
            <div class="rightTeamScore">
              {{$ctrl.world[1]['rightScore']}}
              <div class="rightTeamColor"></div>
            </div>
          </div>
        </div>
        <div class="timeline">
          <ul scroll-glue>
            <li ng-repeat="event in $ctrl.gameEvents" ng-class="::event.recordPitchSide">
              <div class="eventTime">{{::event.recordGameTime}}'</div>
              <div class="event-info">
                <div class="name">{{::event.actorFirstName}}</div>
                <div class="middleDot">&middot;</div>
                <div class="action">{{::event.recordType}}</div>
              </div>
              <div class="eventText">{{::event.recordCommentator}}</div>
            </li>
           <!-- <li class="left">
              <div class="eventTime">24'</div>
              <div class="event-info">
                <div class="name">Yan</div>
                <div class="middleDot">&middot;</div>
                <div class="action">shoots</div>
              </div>
              <div class="eventText">tries for a quick shot!</div>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
  `
};

//background-image directive function
function backgroundImage(){
  return function(scope, element, attrs){
      var url = attrs.backImg;
      element.css({
          'background-image': 'url(' + url +')',
          'background-size' : 'cover',
          'background-position' : 'center center',
          'border-radius' : '50%',
          'opacity' : '0.09'
      });
  };
}

angular.module('shockballGame', ['json-tree', 'luegg.directives'])
.component('main', mainComponent)
.directive('backImg', backgroundImage)
