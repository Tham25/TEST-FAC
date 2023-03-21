import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGridPremium, GridToolbarFilterButton } from '@mui/x-data-grid-premium';

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
    <DataGridPremium
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
