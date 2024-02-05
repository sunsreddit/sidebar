import moment from 'moment-timezone';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

/**
 * Returns game day information for the home and away teams.
 * @param {object} game - Game data object
 * @param {number} game.gameStatus - Game status ([1] Pending, [2] Started [3] Finished)
 * @param {String} game.gameDateTimeUTC - ISO format of DateTime of game
 * @param {number} game.awayTeam.teamId - (Away) NBA team identification number
 * @param {number} game.awayTeam.score - (Away) Team final score
 * @param {number} game.homeTeam.teamId - (Home) NBA team identification number
 * @param {number} game.homeTeam.score - (Home) Team final score
 * @param {object} [params] - (Optional) Override parameters for NBA TeamID & timeZone locale
 * @returns {object}
 * @public
 */
export function GameDayInfo(game, params) {
  const { nba: { TeamID }, timeZone} = params || parameters;
  const isTeamHome = () => game.homeTeam.teamId === TeamID;
  const didTeamWin = () => (isTeamHome() && game.homeTeam.score > game.awayTeam.score) || (!isTeamHome() && game.awayTeam.score > game.homeTeam.score);
  const isGameActive = game.gameStatus === 1 || game.gameStatus === 2;
  const result = isGameActive ? '-' : game.gameStatus === 3 ? (didTeamWin() ? '**W**' : 'L') : '-';
  const score = game.gameStatus === 3 ? `${game.homeTeam.score}-${game.awayTeam.score}` : '-';
  const date = new Date(game.gameDateTimeUTC);
  const locale = timeZone || 'America/New_York';

  return {
    day_number: `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`,
    month_number: `${(date.getMonth() + 1).toString().padStart(2, '0')}`,
    month_short: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
    month_long: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date),
    year_number: date.getFullYear().toString(),
    game_time_local: _localGameTime(date, locale),
    game_score: score,
    game_result: result,
    isTeamHome: isTeamHome(),
    didTeamWin: didTeamWin()
  };
}

/**
 * Returns a filtered list of the specified team's current monthly schedule.
 * @param {number} TeamID - NBA team identification number
 * @returns {object}
 * @public
 */
export async function MonthlyGames(TeamID) {
  const {
    nba: { Endpoints },
  } = parameters;
  const monthNum = new Date().getMonth() + 1;
  const data = await fetch(Endpoints.league_schedule);
  const schedule = await data.json();
  return schedule.leagueSchedule.gameDates
    .filter((gameDate) => {
      // Check if the current monthNum matches
      return gameDate.games.some(
        (game) =>
          game.monthNum === monthNum &&
          (game.homeTeam.teamId === TeamID || game.awayTeam.teamId === TeamID)
      );
    })
    .map((gameDate) => {
      // Filter only the games for the current monthNum and specific team
      gameDate.games = gameDate.games.filter(
        (game) =>
          game.monthNum === monthNum &&
          (game.homeTeam.teamId === TeamID || game.awayTeam.teamId === TeamID)
      );
      return gameDate;
    });
}

export function formatTable(tableInput) {
  // Check if tableInput is a string
  if (typeof tableInput !== 'string') return '';

  // Format the table
  return `\n***\n>${tableInput.split('\n').join('\n>')}\n`;
}

/**
 * Returns the current NBA year in range format (e.g. '1990-91').
 * @returns {String}
 * @private
 */
function _seasonYearRange(year) {
  // If no year is provided, use the current year
  if (!year) {
    const today = new Date();
    year = today.getFullYear();
  }

  // NBA season starts in October, so if current month is before October, subtract 1 from year
  if (new Date().getMonth() < 9) {
    year -= 1;
  }

  // Calculate NBA season range based on the given year
  const startYear = year;
  const endYear = (year + 1).toString().substring(2);

  return `${startYear}-${endYear}`;
}

/**
 * Returns a gamethread friendly time format.
 * @param {*} gameTime - ISO Format
 * @param {*} timeZone - TZ Format
 * @returns {string}
 * @private
 */
function _localGameTime(gameTime, timeZone) {
  return moment
    .tz(gameTime, 'America/New_York')
    .tz(timeZone, false)
    .format('hh:mmz');
}

export const seasonYearRange = _seasonYearRange();
