import { describe, jest, it, expect } from '@jest/globals';
import { GameDayInfo, MonthlyGames } from '../src/helpers.mjs';

describe('GameDayInfo', () => {
  it('returns correct game information (Loss)', () => {
    const game = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '30',
      didTeamWin: false,
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '05:00pm MST',
      isTeamHome: false,
      game_score: '110-100',
      game_result: 'L',
    });
  });

  it('returns correct game information (Win)', () => {
    const game = {
      homeTeam: { teamId: 123, score: 100 },
      awayTeam: { teamId: 456, score: 110 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-02T00:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '01',
      didTeamWin: true,
      month_number: '05',
      month_short: 'May',
      month_long: 'May',
      year_number: '2023',
      game_time_local: '05:00pm MST',
      isTeamHome: false,
      game_score: '100-110',
      game_result: 'W',
    });
  });

  it('handles inactive game', () => {
    const game = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 1,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '30',
      didTeamWin: false,
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '05:00pm MST',
      isTeamHome: false,
      game_score: '-',
      game_result: '-',
    });
  });

  it('correctly determines if the team is home', () => {
    const parameters = {
      nba: { TeamID: 123 },
      reddit: { schedule: { timezone: 'America/Phoenix' } },
    };

    const homeGame = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    const awayGame = {
      homeTeam: { teamId: 456, score: 100 },
      awayTeam: { teamId: 123, score: 110 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    expect(GameDayInfo(homeGame, parameters).isTeamHome).toBe(true);
    expect(GameDayInfo(awayGame, parameters).isTeamHome).toBe(false);
  });

  it('correctly determines if the team won', () => {
    const parameters = {
      nba: { TeamID: 123 },
      reddit: { schedule: { timezone: 'America/Phoenix' } },
    };
    const winGame = {
      homeTeam: { teamId: 123, score: 110 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    const lossGame = {
      homeTeam: { teamId: 456, score: 110 },
      awayTeam: { teamId: 123, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    const tieGame = {
      homeTeam: { teamId: 123, score: 100 },
      awayTeam: { teamId: 456, score: 100 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    expect(GameDayInfo(winGame, parameters).didTeamWin).toBe(true);
    expect(GameDayInfo(lossGame, parameters).didTeamWin).toBe(false);
    expect(GameDayInfo(tieGame, parameters).didTeamWin).toBe(false);
  });
});

describe('MonthlyGames', () => {
  it('fetches monthly games and filters by TeamID', async () => {
    const sampleGamesData = {
      leagueSchedule: {
        gameDates: [
          {
            games: [
              {
                monthNum: 3,
                homeTeam: { teamId: 1, teamName: 'Team1', score: 99 },
                awayTeam: { teamId: 2, teamName: 'Team2', score: 100 },
                gameDateTimeUTC: '2024-03-19T00:00:00Z',
                gameStatus: 3,
              },
              {
                monthNum: 3,
                homeTeam: { teamId: 3, teamName: 'Team3', score: 100 },
                awayTeam: { teamId: 4, teamName: 'Team4', score: 99 },
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
    expect(result).toHaveLength(1);
  });

  it('fetches monthly games and handles fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));
    await expect(MonthlyGames(1610612756)).rejects.toThrow('Fetch error');
  });
});
