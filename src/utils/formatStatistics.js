import { Box } from '@mui/material';
import { getGridSingleSelectOperators, getGridStringOperators } from '@mui/x-data-grid-premium';

import { DataCell, DataCellStep } from '~/components/HomePage/Statistics/DataCell';

export const formatListTool = (data, getDataDetail) => {
  const rows = [];
  const columns = [];
  if (data.length) {
    data.forEach((item, index) => {
      const rowInfo = {
        id: index,
        STT: index + 1,
        Catalog: `Tool ${item.tool}`,
        Total: item.total,
        Pass: item.serial_number_arr.filter((element) => element.status === 'PASS'),
        Fail: item.serial_number_arr.filter((element) => element.status === 'FAIL'),
        Unknown: item.serial_number_arr.filter(
          (element) => element.status !== 'PASS' && element.status !== 'FAIL',
        ),
        serial_number_arr: item.serial_number_arr,
      };
      rows.push(rowInfo);
    });

    Object.keys(rows[0]).forEach((key) => {
      if (key !== 'id' && key !== 'serial_number_arr') {
        const columnInfo = {
          field: key,
          headerName: key,
          flex: 1,
          sortable: false,
          filterable: key !== 'STT',
          headerAlign: key !== 'Catalog' ? 'center' : 'left',
          align: key !== 'Catalog' ? 'center' : 'left',
        };
        if (key === 'Catalog' || key === 'Pass' || key === 'Fail' || key === 'Unknown') {
          columnInfo.renderCell = (cellValues) => (
            <DataCell
              cellValues={cellValues}
              getDataDetail={(data) => getDataDetail(data, cellValues.row.Catalog)}
            />
          );
        }
        columns.push(columnInfo);
      }
    });
  }

  return { rows, columns };
};

export const formatDataDetail = (data, handleShowSteps) => {
  const rows = [];
  const columns = [];

  if (data.length) {
    data.forEach((item, index) => {
      const rowInfo = {
        id: index,
        STT: index + 1,
        SN: item.serial_number,
        Time: item.time,
        Status: item.status,
      };
      rows.push(rowInfo);
    });

    Object.keys(rows[0]).forEach((key) => {
      if (key !== 'id') {
        const columnInfo = {
          field: key,
          headerName: key,
          align: 'center',
          headerAlign: 'center',
          flex: 1,
          sortable: false,
          filterable: key === 'Status' || key === 'SN',
          valueOptions: [...new Set(rows.map((item) => item[key]))],
          filterOperators: [
            ...getGridSingleSelectOperators(),
            ...getGridStringOperators().filter((operator) => operator.value === 'contains'),
          ],
        };

        if (key === 'Status') {
          columnInfo.renderCell = (cellValues) =>
            cellValues.value && (
              <Box sx={{ color: cellValues.value === 'PASS' ? 'green' : 'red' }}>
                {cellValues.value}
              </Box>
            );
        }

        if (key === 'SN') {
          columnInfo.renderCell = (cellValues) =>
            cellValues.value && (
              // eslint-disable-next-line react/button-has-type
              <button
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
                onClick={() => handleShowSteps(cellValues.value, cellValues.row.Catalog)}
              >
                <p style={{ color: '#1976D2' }}> {cellValues.value}</p>
              </button>
            );
        }

        columns.push(columnInfo);
      }
    });
  }

  return { rows, columns };
};

export const formatTestSteps = (data = []) => {
  const rows = [];
  const columns = [];

  if (data.length) {
    data.forEach((item, index) => {
      const rowInfo = {
        id: index,
        Author: item.username,
        Tool: item.content.tool,
        Time: item.content.time,
        Step: item.content.step,
        Result: item.content.status,
        'Ip Country': item.ip,
      };

      rows.push(rowInfo);
    });

    rows.sort((a, b) => `${a.Author}-${a.Tool}`.localeCompare(`${b.Author}-${b.Tool}`));

    Object.keys(rows[0]).forEach((key) => {
      if (key !== 'id') {
        const columnInfo = {
          field: key,
          headerName: key,
          flex: 1,
          align: key === 'Step' ? 'left' : 'center',
          headerAlign: 'center',
          sortable: false,
          filterable: key !== 'Time' && key !== 'Step',
          valueOptions: [...new Set(rows.map((item) => item[key]))],
          filterOperators: [
            ...getGridSingleSelectOperators(),
            ...getGridStringOperators().filter((operator) => operator.value === 'contains'),
          ],
        };

        if (key === 'Result') {
          columnInfo.renderCell = (cellValues) =>
            cellValues.value && (
              <Box
                sx={{
                  color:
                    // eslint-disable-next-line no-nested-ternary
                    cellValues.value === 'PASS'
                      ? 'green'
                      : cellValues.value === 'FAIL'
                      ? 'red'
                      : '#4498f1',
                }}
              >
                {cellValues.value}
              </Box>
            );
        }

        if (key === 'Step') {
          columnInfo.renderCell = (cellValues) => <DataCellStep cellValues={cellValues} />;
        }

        columns.push(columnInfo);
      }
    });
  }

  return { rows, columns };
};
