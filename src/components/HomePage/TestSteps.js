import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridToolbarFilterButton } from '@mui/x-data-grid';

import { formatTestSteps } from '~/utils/formatStatistics';

function TestSteps({ toolName = '', serialNumber, isLoading = false }) {
  const { testSteps } = useSelector((state) => state.testSteps);
  const [dataTable, setDataTable] = useState({ rows: [], columns: [] });

  useEffect(() => {
    // filter
    if (testSteps.history && serialNumber === testSteps.serial_number) {
      const { history } = testSteps;
      const dataFilter =
        toolName !== ''
          ? history.filter((item) => item.content.tool === toolName.slice(5))
          : history;
      const dataTable = formatTestSteps(dataFilter);
      setDataTable(dataTable);
    }
  }, [serialNumber, testSteps, toolName]);

  return (
    <DataGrid
      disableColumnMenu
      rows={isLoading ? [] : dataTable.rows}
      columns={dataTable.columns}
      autoPageSize
      pagination
      components={{
        // eslint-disable-next-line react/no-unstable-nested-components
        Toolbar: () => <GridToolbarFilterButton />,
      }}
      loading={isLoading}
    />
  );
}

export default TestSteps;
