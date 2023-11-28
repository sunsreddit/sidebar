import { default as parameters } from '../config/parameters.json' assert { type: 'json' };

async function MonthlyGames(TeamID) {
  const {
    nba: { Endpoints },
  } = parameters;
  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' });
  const monthNum = now.getMonth() + 1;
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

export async function MonthlyScheduleTable(TeamID) {
  const label = `###${roster.team_name} ${monthName}\n`.toLocaleUpperCase();
  let header = `DATE | TEAM | LOCATION | RESULT\n:-: | :- | :-: | -:`;
}
