import { MonthlyGames, GameDayInfo } from './helpers.mjs';

/** Represents generated template for an NBA monthly team schedule
 * @class
 * @public
 */
export class MonthlyScheduleGenerator {
  /**
   * 
   * @param {object} teamObject 
   * @param {number} teamObject.TeamID -  NBA team identification number
   * @param {string} teamObject.team_name - NBA team name
   */
  constructor(teamObject) {
    this.TeamID = teamObject.nba.TeamID;
    this.TeamName = teamObject.reddit.roster.team_name;
  }

  _label(TeamName) {
    return `\n###${TeamName} MONTHLY SCHEDULE\n`;
  }

  _header() {
    return `\nDATE | TIME | LOCATION | OPPONENT | SCORE | RESULT\n:-: | :- | :-: | -:\n`;
  }

  _formatGameRow(game) {
    const gamedayInfo = GameDayInfo(game);
    const opponent =
      this.TeamID === game.awayTeam.teamId
        ? { name: game.homeTeam.teamName, location: 'Away' }
        : { name: game.awayTeam.teamName, location: 'Home' };

    return `${gamedayInfo.month_number}/${gamedayInfo.day_number} | ${gamedayInfo.game_time_local} | ${opponent.location} | ${opponent.name} | ${gamedayInfo.game_score} | ${gamedayInfo.game_result}\n`;
  }

  async generateMonthlySchedule() {
    const games = await MonthlyGames(this.TeamID);
    return (
      this._label(this.TeamName) +
      this._header() +
      this._generateTableRows(games)
    );
  }

  _generateTableRows(games) {
    let table = '';
    Object.values(games).forEach((obj) => {
      table += this._formatGameRow(obj.games[0]);
    });
    return table;
  }
}
