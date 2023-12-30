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
    this.TeamName = teamObject.reddit.subreddit.short_name;
  }

  _label(TeamName) {
    return `\n###${TeamName} MONTHLY SCHEDULE\n`;
  }

  _header() {
    return `\n🗓️ | 🕘  | 🏀 |  📊 | 🏆\n` + `:-: | :-: | :-: | :-: | :-:\n`;
  }

  _footer() {
    return `\n####[View full schedule](http://www.suns.com/schedule)`;
  }

  _formatGameRow(game) {
    const gamedayInfo = GameDayInfo(game);
    const opponent =
      this.TeamID === game.awayTeam.teamId
        ? { logo: `[](#${game.homeTeam.teamSlug})`, location: ' ✈️' }
        : { logo: `[](#${game.awayTeam.teamSlug})`, location: ' 🏠' };

    return `${opponent.location} ${gamedayInfo.month_number}/${gamedayInfo.day_number} | ${gamedayInfo.game_time_local} | ${opponent.logo} | ${gamedayInfo.game_score} | ${gamedayInfo.game_result}\n`;
  }

  _generateTableRows(games) {
    let table = '';
    Object.values(games).forEach((obj) => {
      table += this._formatGameRow(obj.games[0]);
    });
    return table;
  }

  async generateMonthlySchedule() {
    const games = await MonthlyGames(this.TeamID);
    return (
      this._label(this.TeamName) +
      this._header() +
      this._generateTableRows(games) +
      this._footer()
    );
  }
}
