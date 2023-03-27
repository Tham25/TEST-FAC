import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';

import { clearDataTestSteps } from '~/redux/slices/testSteps';
import TestSteps from '../TestSteps';
import InputSearch from '~/components/InputSearchSN';
import AssyHistory from './AssyHistory';

function Infomation() {
  const dispatch = useDispatch();
  const [serialNumber, setSerialNumber] = useState('');
  const [valueTab, setValueTab] = useState('assy');
  const navigate = useNavigate();

  const handleSearch = (value) => {
    setSerialNumber(value);
  };

  useEffect(() => {
    dispatch(clearDataTestSteps());
  }, [dispatch]);

  const handleChangeTab = (newValue) => {
    setValueTab(newValue);
    navigate(newValue, { replace: true });
  };

  return (
    <Box sx={{ height: '100%', p: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex' }}>
        <InputSearch label="Serial number" handleSearch={handleSearch} />
        <Tabs sx={{ ml: 4 }} value={valueTab} onChange={(e, newValue) => handleChangeTab(newValue)}>
          <Tab label="Assy History" value="assy" />
          <Tab label="Tool History" value="tool" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, mt: 2 }}>
        <Routes path="/">
          <Route path="/" element={<Navigate to="assy" />} />
          <Route path="assy" element={<AssyHistory serialNumber={serialNumber} />} />
          <Route path="tool" element={<TestSteps serialNumber={serialNumber} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Infomation;
