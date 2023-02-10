import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Dialog, IconButton } from '@mui/material';
import { DataGrid, GridToolbarFilterButton } from '@mui/x-data-grid';
import CancelIcon from '@mui/icons-material/Cancel';

import { formatDataDetail } from '~/utils/formatStatistics';
import { getTestStepsRedux } from '~/redux/slices/testSteps';
import TestSteps from '../TestSteps';

function InfoDetail({ data, toolName }) {
  const [dataTable, setDataTable] = useState({ rows: [], columns: [] });
  const [openTestSteps, setOpenTestSteps] = useState(false);
  const serialNumber = useRef();

  const dispatch = useDispatch();

  const handleShowSteps = useCallback(
    (SN) => {
      serialNumber.current = SN;
      dispatch(getTestStepsRedux(SN));
      setOpenTestSteps(true);
    },
    [dispatch],
  );

  useEffect(() => {
    const dataFormat = formatDataDetail(data, handleShowSteps);
    setDataTable(dataFormat);
  }, [data, handleShowSteps]);

  return (
    <Box sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 52, p: 2 }}>{toolName} info details:</Box>
      {data.length ? (
        <DataGrid
          disableColumnMenu
          disableSelectionOnClick
          autoPageSize
          pagination
          rows={dataTable.rows}
          columns={dataTable.columns}
          components={{
            // eslint-disable-next-line react/no-unstable-nested-components
            Toolbar: () => (
              <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                <GridToolbarFilterButton sx={{ mt: 1, mr: 1 }} />
              </Box>
            ),
          }}
        />
      ) : (
        <Box sx={{ m: 'auto' }}>Oh no! Data Empty!</Box>
      )}
      <Dialog
        transitionDuration={1000}
        onClose={() => setOpenTestSteps(false)}
        open={openTestSteps}
        maxWidth="80%"
      >
        <Box
          sx={{
            p: 2,
            height: 48,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>Test steps of {serialNumber.current}:</Box>
          <IconButton sx={{ height: 36, width: 36 }} onClick={() => setOpenTestSteps(false)}>
            <CancelIcon sx={{ color: '#f76331' }} />
          </IconButton>
        </Box>
        <Box sx={{ width: '80vw', height: '70vh', p: 1 }}>
          <TestSteps toolName={toolName} serialNumber={serialNumber.current} />
        </Box>
      </Dialog>
    </Box>
  );
}

export default memo(InfoDetail);
