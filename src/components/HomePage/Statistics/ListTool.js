import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Stack } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import { formatListTool } from '~/utils/formatStatistics';
import InfoDetail from './InfoDetail';

function ListTool() {
  const [dataListTool, setDataListTool] = useState({ rows: [], columns: [] });
  const [dataDetail, setDataDetail] = useState([]);
  const [openDetail, setOpenInfoDetail] = useState(false);
  const toolName = useRef('');
  const { isLoading, listTool } = useSelector((state) => state.statistics);

  const getDataDetail = (data, toolNameNew) => {
    setOpenInfoDetail(true);
    toolName.current = toolNameNew;
    setDataDetail(data);
  };

  useEffect(() => {
    setOpenInfoDetail(false);
    const dataFormat = formatListTool(listTool, getDataDetail);
    setDataListTool(dataFormat);
  }, [listTool]);

  return (
    <Stack sx={{ height: '100%', p: 1 }}>
      <Box sx={{ mt: 2, height: '100%', display: 'flex' }}>
        <DataGridPremium
          disableColumnMenu
          disableSelectionOnClick
          autoPageSize
          pagination
          rows={isLoading ? [] : dataListTool.rows}
          columns={dataListTool.columns}
          loading={isLoading}
        />
        {openDetail && <InfoDetail data={dataDetail} toolName={toolName.current} />}
      </Box>
    </Stack>
  );
}

export default ListTool;
