import { UpdateSideBarRosterTable } from '../src/roster.mjs';
(async () => {
  const table = await UpdateSideBarRosterTable();
  console.log(table);
  return table;
})();
