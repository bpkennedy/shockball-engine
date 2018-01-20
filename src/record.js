export default class Record {
  constructor() {
    this.records = []
  }

  update() {

  }

  endGame() {
    //send the records to the database!
  }

  add(player, gameEvent, gameTime) {
    this.records.push({
      actorUid: player.uid,
      actorFirstName: player.firstName,
      actorLastName: player.lastName,
      actorPicUrl: player.picUrl,
      teamUid: player.teamUid,
      teamName: player.teamName,
      teamPicUrl: player.teamPicUrl,
      recordRealTime: new Date(),
      recordGameTime: gameTime,
      recordPitchSide: player.goalSide,
      recordType: gameEvent,
      recordCommentator: this.getCommentatorText(gameEvent)
    })
  }

  getCommentatorText(gameEvent) {
    switch(gameEvent) {
      case 'tackles ball':
        return this.pickRandomTackleBall()
        break;
      case 'runs ball':
        return this.pickRandomPlayerRun()
        break;
      case 'shoots':
        return this.pickRandomPlayerTryScore()
        break;
      case 'passes ball':
        return this.pickRandomPlayerTryPass()
        break;
      default:
        ''
        break;
    }
  }

  pickRandomTackleBall() {
    const phrases = [
      'crashes in and emerges with the ball',
      'struggles to free himself, but he has the ball now!',
      'wins the tackle for the ball',
      'roughs up the opponent for the ball',
      'deftly snipes the ball from the opposition!'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerRun() {
    const phrases = [
      'barrels down the court with the ball',
      'tucks and runs it in!',
      'is on a break away!',
      'is moving the ball nicely along',
      'carries the ball and ploughs through the opposition!'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerTryScore() {
    const phrases = [
      'tries for a shot!',
      'puts up a heater!',
      'fires one toward goal',
      'blasts one towards the opposition goal!',
      'goes for the point, will it happen?'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerTryPass() {
    const phrases = [
      'hands off the ball',
      'crosses the ball',
      'sends a firm throw to a teammate',
      'tosses the ball'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  reset() {
    this.records = []
  }

}