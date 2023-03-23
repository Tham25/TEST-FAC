import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { getLotOptionsRedux } from '~/redux/slices/lotOptions';
import { getFormatTime, timeList } from '~/utils/formatTime';

export function InfoSearch({ handleChangeInfoSearch }) {
  const dispatch = useDispatch();
  const [lotValue, setLotValue] = useState('All');
  const { lotList } = useSelector((state) => state.lotOptions);
  const [timeOptions, setTimeOptions] = useState(timeList[2]);
  const [dateSearch, setDateSearch] = useState(getFormatTime(timeList[2]));

  const lotOptions = useMemo(() => {
    const lotListName = lotList.map((item) => {
      return `${item.fields.sn_start}xxxx${item.fields.sn_end}`;
    });

    return ['All', ...lotListName];
  }, [lotList]);

  // first load
  useEffect(() => {
    dispatch(getLotOptionsRedux());
  }, [dispatch]);

  const handleChangeFromDate = (e) => {
    if (timeOptions !== 'Time Custom') setTimeOptions('Time Custom');
    setDateSearch((prev) => ({ ...prev, fromDate: e.target.value }));
  };

  const handleChangeToDate = (e) => {
    if (timeOptions !== 'Time Custom') setTimeOptions('Time Custom');
    setDateSearch((prev) => ({ ...prev, toDate: e.target.value }));
  };

  useEffect(() => {
    const lotInfo = lotValue === 'All' ? ['', ''] : lotValue.split('xxxx');
    console.log('dateSearch', dateSearch);
    const infoSearch = {
      startdate: '2023-03-16',
      enddate: '2023-03-23',
      sn_start: lotInfo[0],
      sn_end: lotInfo[1],
    };

    handleChangeInfoSearch(infoSearch);
  }, [dateSearch.fromDate, dateSearch.toDate, handleChangeInfoSearch, lotValue]);

  const handleChangeTimeOption = (timeOption) => {
    setTimeOptions(timeOption);
    const date = getFormatTime(timeOption);
    setDateSearch(date);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Lot options</InputLabel>
        <Select
          sx={{ width: [100, 110, 140], fontSize: [12, 12, 14], minHeight: 32 }}
          value={lotValue}
          onChange={(e) => setLotValue(e.target.value)}
        >
          {lotOptions.map((item, index) => (
            <MenuItem key={index} value={item} sx={{ fontSize: [12, 12, 14] }}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: '8px 24px' }}>
        <InputLabel>Time options</InputLabel>
        <Select
          sx={{ width: [100, 110, 140], fontSize: [12, 12, 14], minHeight: 32 }}
          value={timeOptions}
          onChange={(e) => handleChangeTimeOption(e.target.value)}
        >
          {timeList.map((item, index) => (
            <MenuItem sx={{ fontSize: [12, 14, 14] }} key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        sx={{ m: 1, '& input': { fontSize: [12, 12, 14], minHeight: 22 } }}
        label="From"
        variant="standard"
        type="datetime-local"
        value={dateSearch.fromDate}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChangeFromDate}
      />
      <TextField
        sx={{ m: 1, '& input': { fontSize: [12, 12, 14], minHeight: 22 } }}
        label="To"
        variant="standard"
        type="datetime-local"
        value={dateSearch.toDate}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChangeToDate}
      />
    </Box>
  );
}
