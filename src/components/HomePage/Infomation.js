import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Stack } from '@mui/material';

import { clearDataTestSteps, getTestStepsRedux } from '~/redux/slices/testSteps';
import TestSteps from './TestSteps';
import InputSearch from '../InputSearchSN';

function Infomation() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.testSteps);
  const [serialNumber, setSerialNumber] = useState('');

  const handleSearch = (value) => {
    setSerialNumber(value);
    dispatch(getTestStepsRedux(value));
  };

  useEffect(() => {
    dispatch(clearDataTestSteps());
  }, [dispatch]);

  return (
    <Box sx={{ height: '100%', p: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex' }}>
        <InputSearch label="Serial number" handleSearch={handleSearch} />
        <SnInfo sx={{ ml: 8 }} SN={serialNumber} />
      </Box>
      <Box sx={{ flex: 1, mt: 2 }}>
        <TestSteps serialNumber={serialNumber} isLoading={isLoading} />
      </Box>
    </Box>
  );
}

export default Infomation;

function SnInfo({ SN, sx = '' }) {
  return (
    <Stack sx={{ width: 300, ...sx }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>SN:</Box>
        <Box>{SN}</Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Box>ID JIG LCD:</Box>
        <Box>0</Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Box>ID JIG Main KeyBroad:</Box>
        <Box>0</Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Box>ID JIG Main KeyBroad:</Box>
        <Box>0</Box>
      </Box>
    </Stack>
  );
}
