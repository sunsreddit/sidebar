import { describe, test, expect } from '@jest/globals';
import { teamRecordTable } from './record.mjs';

describe('teamRecordTable', () => {
  test('generates the correct record header', () => {
    const team = 'Team4';
    const wins = 10;
    const losses = 1;
    const yearRange = '1990-1991';
    const url = `https://nba.com/${team}/schedule`;
    const expected = `##${yearRange} Record\n\nWINS | LOSSES\n:--:|:--:\n${wins} | ${losses}\n[View Games](${url})\n`;
    const result = teamRecordTable(team,wins,losses, yearRange);
    expect(result).toEqual(expected);
  });
});