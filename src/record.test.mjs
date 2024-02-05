import { describe, test, expect, jest } from '@jest/globals';
import NBA from '@sunsreddit/nba-stats';
import { teamRecordTable } from './record.mjs';

describe('teamRecordTable', () => {
  test('should return a formatted team record table with NBA year range', async () => {
    const teamId = 1234;

    const standings = {
      Standings: {
        1234: { TeamID: 1234, WINS: 50, LOSSES: 32, TeamSlug: 'team1' },
        4321: { TeamID: 4321, WINS: 8, LOSSES: 7, TeamSlug: 'team2' },
      },
    };

    jest.mock('@sunsreddit/nba-stats');
    jest.spyOn(NBA, 'leagueStandings').mockResolvedValue(standings);

    const result = await teamRecordTable(teamId);
    const expected = '\n##2023-24 Record\n\nWINS | LOSSES\n:--:|:--:\n50 | 32\n\n[View Games](https://nba.com/team1/schedule)\n';
    expect(result).toBe(expected);
  });
});