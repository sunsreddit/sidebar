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
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '05:00pm MST',
      game_score: '110-100',
      game_result: 'L',
    });
  });

  it('returns correct game information (Win)', () => {
    const game = {
      homeTeam: { teamId: 123, score: 100 },
      awayTeam: { teamId: 456, score: 110 },
      gameStatus: 3,
      gameDateTimeUTC: '2023-05-01T00:00:00Z',
    };

    const result = GameDayInfo(game);

    expect(result).toEqual({
      day_number: '30',
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '05:00pm MST',
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
      month_number: '04',
      month_short: 'Apr',
      month_long: 'April',
      year_number: '2023',
      game_time_local: '05:00pm MST',
      game_score: '-',
      game_result: '-',
    });
  });
});

describe('MonthlyGames', () => {
  it('fetches monthly games and filters by TeamID', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            leagueSchedule: {
              gameDates: [
                {
                  monthNum: 4,
                  games: [
                    {
                      gameStatus: 3,
                      gameDateTimeUTC: '2023-05-01T00:00:00Z',
                      awayTeam: { teamId: 456, score: 100 },
                      homeTeam: { teamId: 123, score: 99 },
                    },
                  ],
                },
                {
                  monthNum: 5,
                  games: [
                    {
                      gameStatus: 3,
                      gameDateTimeUTC: '2023-05-01T00:00:00Z',
                      homeTeam: { teamId: 456, score: 100 },
                      awayTeam: { teamId: 123, score: 99 },
                    },
                  ],
                },
              ],
            },
          }),
      })
    );
    const result = await MonthlyGames(123);
    expect(result).toHaveLength(1);
  });

  it('fetches monthly games and handles fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Fetch error'));
    await expect(MonthlyGames(1610612756)).rejects.toThrow('Fetch error');
  });
});