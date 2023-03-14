import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, FormControl, IconButton, Input, InputLabel, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { clearDataTestSteps, getTestStepsRedux } from '~/redux/slices/testSteps';
import TestSteps from './TestSteps';

function Infomation() {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.testSteps);

  const handleSearch = () => {
    const formatValue = value.trim();
    dispatch(getTestStepsRedux(formatValue));
  };

  useEffect(() => {
    dispatch(clearDataTestSteps());
  }, [dispatch]);

  return (
    <Box sx={{ height: '100%', p: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex' }}>
        <FormControl sx={{ width: '25ch' }} variant="standard">
          <InputLabel>Serial number</InputLabel>
          <Input
            onChange={(e) => setValue(e.target.value)}
            value={value}
            type="text"
            endAdornment={
              <IconButton sx={{ p: 0 }} onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            }
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleSearch();
              }
            }}
          />
        </FormControl>
        <SnInfo sx={{ ml: 8 }} SN={value} />
      </Box>
      <Box sx={{ flex: 1, mt: 2 }}>
        <TestSteps serialNumber={value} isLoading={isLoading} />
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
