import { default as parameters } from '../config/parameters.json' assert { type: 'json' };
import { GameDayInfo } from './helpers/index.mjs';

async function MonthlyGames(TeamID) {
  const {
    nba: { Endpoints },
  } = parameters;
  const monthNum = new Date().getMonth() + 1;
  const data = await fetch(Endpoints.league_schedule);
  const schedule = await data.json();
  const monthlyGames = schedule.leagueSchedule.gameDates
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
  return monthlyGames;
}

export async function MonthlyScheduleTable() {
  const {
    reddit: { roster },
    nba: { TeamID },
  } = parameters;
  const games =  await MonthlyGames(TeamID);
  const label = `\n###${roster.team_name} MONTHLY SCHEDULE\n`;
  let table = `\nDATE | TIME | LOCATION | OPPONENT | SCORE | RESULT\n:-: | :- | :-: | -:\n`;

  Object.values(games).forEach((obj) => {
    const game = obj.games[0];
    const gamedayInfo = GameDayInfo(game);
    const opponent =
      TeamID === game.awayTeam.teamId
        ? {
            name: game.homeTeam.teamName,
            location: 'Away',
          }
        : {
            name: game.awayTeam.teamName,
            location: 'Home',
          };
    const location =
      (table += `${gamedayInfo.month_number}/${gamedayInfo.day_number} | ${gamedayInfo.game_time_local} | ${opponent.location} | ${opponent.name} | ${gamedayInfo.game_score} | ${gamedayInfo.game_result}\n`);
  });
  return label + table;
}
