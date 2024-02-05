import { describe, expect, jest, test } from '@jest/globals';
import { divisionStandingsTable } from './standing.mjs';
import NBA from '@sunsreddit/nba-stats';
import parameters from '../config/parameters.json';

// Mocking NBA module
jest.mock('@sunsreddit/nba-stats');

describe('divisionStandingsTable', () => {
  test('should return division standings table', async () => {
    // Mock NBA.leagueStandings method
    NBA.leagueStandings = jest.fn().mockResolvedValue({
      Standings: {
        team1: { TeamID: 1, Division: parameters.nba.Division, TeamName: 'Team1', TeamSlug: 'team1', WINS: 10, LOSSES: 5, WinPCT: '0.667', ConferenceGamesBack: '1.5' }
      }
    });

    // Expected result
    const expectedTable = `
##[Division Standings](https://www.nba.com/standings)

TEAM | W | L | PCT | GB
:--|:--:|:--:|:--:|:--:|
[](#team1)**Team1** | 10 | 5 | 0.667 | 1.5

####[View full standings](http://www.nba.com/standings)
`;

    // Call the function
    const result = await divisionStandingsTable(1);

    // Assertions
    expect(result).toEqual(expectedTable);
    expect(NBA.leagueStandings).toHaveBeenCalled();
  });
});
