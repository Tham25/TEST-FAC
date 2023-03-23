import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Stack } from '@mui/material';

import { getListToolRedux } from '~/redux/slices/statistics';
import { InfoSearch } from './InfoSearch';
import ListTool from './ListTool';
import { getCircuitAssyRedux } from '~/redux/slices/circuitAssy';

function Statistics() {
  const dispatch = useDispatch();

  useEffect(() => {
    // first load
    dispatch(getCircuitAssyRedux());
  }, [dispatch]);

  const handleChangeInfoSearch = useCallback(
    (newInfo) => dispatch(getListToolRedux(newInfo)),
    [dispatch],
  );

  return (
    <Stack sx={{ height: '100%', p: 1 }}>
      <InfoSearch handleChangeInfoSearch={handleChangeInfoSearch} />
      <ListTool />
    </Stack>
  );
}

export default Statistics;
