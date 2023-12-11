import moment from 'moment-timezone';
import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

export function GameDayInfo(game) {
  const {
    nba: { TeamID },
    reddit: { schedule },
  } = parameters;
  const isTeamHome = game.homeTeam.teamId === TeamID ? true : false;
  const didTeamWin = isTeamHome
    ? game.homeTeam.score > game.awayTeam.score
    : game.awayTeam.score > game.homeTeam.score;
  const isGameActive = game.gameStatus === 2 || game.gameStatus === 3;
  const result = isGameActive ? (didTeamWin ? 'W' : 'L') : '-';
  const score =
    game.gameStatus == 3
      ? `${game.homeTeam.score}-${game.awayTeam.score}`
      : '-';
  const date = new Date(game.gameDateTimeUTC);
  const locale = schedule.timezone;
  return {
    day_number:
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString(),
    month_number:
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : (date.getMonth() + 1).toString(),
    month_short: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      date
    ),
    month_long: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      date
    ),
    year_number: date.getFullYear().toString(),
    game_time_local: _localGameTime(date, locale),
    game_score: score,
    game_result: result,
  };
}

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

function _seasonYearRange() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;

  // Get the last two digits of the next year
  const nextYearLastTwoDigits = String(nextYear).slice(-2);

  // Combine the current year and the last two digits of the next year
  const result = `${currentYear}-${nextYearLastTwoDigits}`;

  return result;
}

function _localGameTime(gameTime, timeZone) {
  return moment
    .tz(gameTime, 'America/New_York')
    .tz(timeZone, false)
    .format('hh:mma z');
}

export const seasonYearRange = _seasonYearRange();
