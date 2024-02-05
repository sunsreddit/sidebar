import { describe, expect, test } from '@jest/globals';
import { hyperlinkTables } from './hyperlink.mjs';

describe('generateCompleteMarkdown', () => {
  test('generates complete markdown for all sections', () => {
    const mockSections = [
      {
        title: 'Section 1',
        links: [
          { text: 'Link 1', url: 'http://example.com/link1' },
          { text: 'Link 2', url: 'http://example.com/link2' },
        ],
      },
      {
        title: 'Section 2',
        links: [
          { text: 'Link 3', url: 'http://example.com/link3' },
        ],
      },
    ];

    const result = hyperlinkTables(mockSections);

    const expected = '\n***\n>\n>##Section 1\n>* [Link 1](http://example.com/link1)\n>* [Link 2](http://example.com/link2)\n\n\n***\n>\n>##Section 2\n>* [Link 3](http://example.com/link3)\n';
    expect(result).toMatch(expected);
  });

  // Add more test cases as needed
});