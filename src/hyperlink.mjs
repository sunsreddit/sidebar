import { formatTable } from './helpers.mjs';

export const hyperlinkTables = (sections) => {
  const tables = [];
  Object.values(sections).forEach((section) => {
    const table = [`\n##${section.title}`];
    section.links.forEach((link) => table.push(`* [${link.text}](${link.url})`));
    const formattedTable = formatTable(table.join('\n'));
    tables.push(formattedTable);
  });
  return tables.join('\n') + '\n';
};
