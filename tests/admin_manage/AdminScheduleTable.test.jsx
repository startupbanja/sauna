import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import AdminScheduleTable from '../../app/components/admin_manage/AdminScheduleTable';


// get new AdminShceduleTable component with props filled
function getNew(startupCount, coachCount, firstColumn) {
  const sIds = Array(startupCount).fill(null).map((n, i) => i.toString());
  const cIds = Array(coachCount).fill(null).map((n, i) => i.toString());
  const schedule = [];
  for (let i = 0; i < sIds.length; i += 1) {
    for (let j = 0; j < cIds.length; j += 1) {
      const time = `0${i % 10}:00:00`;
      schedule.push({
        coach: sIds[i],
        startup: cIds[j],
        time,
        duration: 20,
      });
    }
  }
  const allUsers = { startups: sIds, coaches: cIds };
  return ReactTestUtils
    .renderIntoDocument(<AdminScheduleTable
      schedule={schedule}
      allUsers={allUsers}
      firstColumn={firstColumn}
      editable={false}
      onEdit={jest.fn()}
    />);
}

['coach', 'startup'].forEach((userType) => {
  describe(`Testing AdminScheduleTable with firstColumn = ${userType}`, () => {
    const newASTable = getNew(20, 50, userType);
    const headerRow = ReactTestUtils.findRenderedDOMComponentWithClass(newASTable, 'header-row');
    const bodyRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(newASTable, 'body-row');

    test('expect body row size to equal header row size', () => {
      bodyRows.forEach((row) => {
        expect(row.children.length).toBe(headerRow.children.length);
      });
    });
    test('expect cells in body rows to be lined correctly to cells in header row', () => {
      bodyRows.forEach((row) => {
        const cells = row.children;
        Object.keys(cells).slice(1, -1).forEach((i) => {
          // cell is of type
          // {'some random string': {actual dom element},
          // 'some random string': {stuff we dont want} }
          //
          // so we need to do some ugly stuff to extract the actual element
          const cell = cells[i][Object.keys(cells[i])[0]];
          const k = Object.keys(headerRow.children[i])[0];
          const headerCell = headerRow.children[i][k];
          const headerTime = headerCell.key;
          const cellTime = cell.key.split('_')[1];
          expect(cellTime).toBe(headerTime);
        });
      });
    });
  });
});
