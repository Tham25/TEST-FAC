import { useState } from 'react';
import { Box, Button, Menu } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export function DataCell({ cellValues, getDataDetail }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const value = cellValues.field === 'Catalog' ? cellValues.value : cellValues.value.length;

  const onClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (cellValues.field === 'Catalog') {
      getDataDetail(cellValues.row.serial_number_arr);
    }
  };

  return (
    cellValues.value && (
      <>
        <Button
          onClick={onClick}
          sx={{
            color:
              // eslint-disable-next-line no-nested-ternary
              cellValues.field === 'Fail'
                ? 'red'
                : cellValues.field === 'Pass'
                ? 'green'
                : '#1976d2',
          }}
        >
          {value}
        </Button>
        {cellValues.field !== 'Catalog' && (
          <ListSN
            anchorEl={anchorEl}
            open={open}
            handleClose={() => setAnchorEl(null)}
            data={cellValues.value}
          />
        )}
      </>
    )
  );
}

function ListSN({ anchorEl, open, handleClose, data }) {
  return data.length ? (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ maxHeight: 200 }}>
      {data.map((item, index) => (
        <Box key={index} sx={{ fontSize: 14, m: 2 }}>
          {`${index + 1}. ${item.serial_number}`}
        </Box>
      ))}
    </Menu>
  ) : null;
}

export function DataCellStep({ cellValues }) {
  const steps = cellValues.row.Tool === 'audio_jig' ? cellValues.value.split('\r\n') : [];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return steps.length ? (
    <Box>
      <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Steps details</Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 500, height: 300 }}>
          <DataGrid
            disableColumnMenu
            hideFooter
            columns={[
              { field: 'File', headerName: 'File', sortable: false, width: 40 },
              { field: 'Name', headerName: 'Name', sortable: false, flex: 1, minWidth: 200 },
              {
                field: 'Result',
                headerName: 'Result',
                sortable: false,
                flex: 1,
                renderCell: (cellValues) =>
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
                  ),
              },
              { field: 'Score', headerName: 'Score', sortable: false, flex: 1 },
            ]}
            rows={steps.map((step, index) => {
              if (step !== '') {
                const params = step.split(' ');
                return {
                  id: index,
                  File: index + 1,
                  Name: params[0],
                  Result: params[1],
                  Score: params[2].split(':')[1],
                };
              }
              return { id: -1 };
            })}
          />
        </Box>
      </Menu>
    </Box>
  ) : (
    <Box>{cellValues.value}</Box>
  );
}
