import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { formatStatistics } from '~/utils/formatStatistics';
import { InfoSearch } from './InfoSearch';
import InfoDetail from './InfoDetail';

function Statistics() {
  const [dataStatistics, setDataStatistics] = useState({ rows: [], columns: [] });
  const [dataDetail, setDataDetail] = useState([]);
  const [openDetail, setOpenInfoDetail] = useState(false);
  const toolName = useRef('');
  const { isLoading } = useSelector((state) => state.statistics);

  const getDataDetail = (data, toolNameNew) => {
    setOpenInfoDetail(true);
    toolName.current = toolNameNew;
    setDataDetail(data);
  };
  const handChangeData = useCallback((data) => {
    setOpenInfoDetail(false);
    const dataFormat = formatStatistics(data, getDataDetail);
    setDataStatistics(dataFormat);
  }, []);

  return (
    <Stack sx={{ height: '100%', p: 1 }}>
      <InfoSearch handChangeData={handChangeData} />
      <Box sx={{ mt: 2, height: '100%', display: 'flex' }}>
        <DataGrid
          disableColumnMenu
          disableSelectionOnClick
          autoPageSize
          pagination
          rows={isLoading ? [] : dataStatistics.rows}
          columns={dataStatistics.columns}
          loading={isLoading}
        />
        {openDetail && <InfoDetail data={dataDetail} toolName={toolName.current} />}
      </Box>
    </Stack>
  );
}

export default Statistics;
