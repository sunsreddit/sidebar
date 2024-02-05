import { describe, expect, jest, test, } from '@jest/globals';
import { formatTable, GameDayInfo, MonthlyGames } from './helpers.mjs';

describe('GameDayInfo', () => {
  test('returns correct game information (Active)', () => {
    const game = {
      homeTeam: { teamId: '1', score: 90 },
      awayTeam: { score: 100 },
      gameStatus: 0,
      gameDateTimeUTC: '2024-01-30T18:00:00Z',
    };
    const params = {
      nba: { TeamID: '1' },
      timeZone: 'America/New_York',
    };
    const result = GameDayInfo(game, params);
    expect(result.game_result).toBe('-');
  });

  test('returns correct game information (Loss)', () => {
    const game = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '30',
      didTeamWin: false,
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '01:00MST',
      isTeamHome: false,
      game_score: '110-100',
      game_result: 'L',
    });
  });

  test('returns correct game information (Win)', () => {
    const game = {
      homeTeam: { teamId: 123, score: 100 },
      awayTeam: { teamId: 456, score: 110 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-02T20:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '02',
      didTeamWin: true,
      month_number: '05',
      month_short: 'May',
      month_long: 'May',
      year_number: '2023',
      game_time_local: '01:00MST',

      isTeamHome: false,
      game_score: '100-110',
      game_result: '**W**',
    });
  });

  test('handles inactive game', () => {
    const game = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 1,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '30',
      didTeamWin: false,
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '01:00MST',
      isTeamHome: false,
      game_score: '-',
      game_result: '-',
    });
  });

  test('correctly determines if the team is home', () => {
    const parameters = {
      nba: { TeamID: 123 },
      reddit: { schedule: { timezone: 'America/Phoenix' } },
    };

    const homeGame = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    const awayGame = {
      homeTeam: { teamId: 456, score: 100 },
      awayTeam: { teamId: 123, score: 110 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    expect(GameDayInfo(homeGame, parameters).isTeamHome).toBe(true);
    expect(GameDayInfo(awayGame, parameters).isTeamHome).toBe(false);
  });

  test('correctly determines if the team won', () => {
    const parameters = {
      nba: { TeamID: 123 },
      reddit: { schedule: { timezone: 'America/Phoenix' } },
    };
    const winGame = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    const lossGame = {
      homeTeam: { teamId: 456, score: 110 },
      awayTeam: { teamId: 123, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    const tieGame = {
      homeTeam: { teamId: 123, score: 100 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-04-30T20:00:00Z',
    };

    expect(GameDayInfo(winGame, parameters).didTeamWin).toBe(true);
    expect(GameDayInfo(lossGame, parameters).didTeamWin).toBe(false);
    expect(GameDayInfo(tieGame, parameters).didTeamWin).toBe(false);
  });
});

describe('MonthlyGames', () => {
  test('fetches monthly games and filters by TeamID', async () => {
    const sampleGamesData = {
      leagueSchedule: {
        gameDates: [
          {
            date: '2024-03-18',
            games: [
              {
                monthNum: 3,
                homeTeam: { teamId: 1, teamName: 'Team1', score: 99 },
                awayTeam: { teamId: 4, teamName: 'Team4', score: 100 },
                gameDateTimeUTC: '2024-03-19T00:00:00Z',
                gameStatus: 3,
              },
              {
                monthNum: 3,
                homeTeam: { teamId: 10, teamName: 'Team10', score: 100 },
                awayTeam: { teamId: 1, teamName: 'Team1', score: 99 },
                gameDateTimeUTC: '2024-03-19T00:00:00Z',
                gameStatus: 3,
              },
            ],
          },
        ],
      },
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(sampleGamesData),
      })
    );
    const realDate = Date;
    global.Date = jest.fn(() => new realDate('2024-03-02T00:00:00Z'));
    const result = await MonthlyGames(1);
    global.Date = realDate;
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].games.length).toBe(2);
  });

  test('fetches monthly games and handles fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));
    await expect(MonthlyGames(1610612756)).rejects.toThrow('Fetch error');
  });
});

describe('formatTable', () => {
  test('should return a formatted table string with > prefix', () => {
    const tableInput = 'Header1 | Header2\n--------|--------\nValue1  | Value2';
    const expected = '\n***\n>' + tableInput.split('\n').join('\n>') + '\n';
    expect(formatTable(tableInput)).toEqual(expected);
  });

  test('should handle empty input and return an empty string', () => {
    const tableInput = '';
    expect(formatTable(tableInput)).toEqual('\n***\n>\n');
  });

  test('should handle non-string input and return an empty string', () => {
    const expected = formatTable(1);
    expect(expected).toEqual('');
  });
});
