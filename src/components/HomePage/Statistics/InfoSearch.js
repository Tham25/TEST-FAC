import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { getLotOptionsRedux } from '~/redux/slices/lotOptions';
import { getStatisticsInfoRedux } from '~/redux/slices/statistics';
import { getFormatTime, timeList } from '~/utils/formatTime';

export function InfoSearch({ handChangeData }) {
  const dispatch = useDispatch();
  const [lotValue, setLotValue] = useState('All');
  const { lotList } = useSelector((state) => state.lotOptions);
  const { statisticsInfo } = useSelector((state) => state.statistics);
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
    setDateSearch((prev) => ({ ...prev, fromDate: e.target.value }));
  };

  const handleChangeToDate = (e) => {
    setDateSearch((prev) => ({ ...prev, toDate: e.target.value }));
  };

  useEffect(() => {
    handChangeData(statisticsInfo);
  }, [handChangeData, statisticsInfo]);

  const handleSearch = () => {
    const lotInfo = lotValue === 'All' ? ['', ''] : lotValue.split('xxxx');
    const infoSearch = `startdate=${dateSearch.fromDate}&enddate=${dateSearch.toDate}&sn_start=${lotInfo[0]}&sn_end=${lotInfo[1]}`;
    dispatch(getStatisticsInfoRedux(infoSearch));
  };

  const handleChangeTimeOption = (timeOption) => {
    setTimeOptions(timeOption);
    const date = getFormatTime(timeOption);
    setDateSearch(date);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Lot Options</InputLabel>
        <Select
          sx={{ width: [100, 110, 140], fontSize: [12, 12, 16], minHeight: 32 }}
          value={lotValue}
          onChange={(e) => setLotValue(e.target.value)}
        >
          {lotOptions.map((item, index) => (
            <MenuItem key={index} value={item} sx={{ fontSize: [12, 14, 16] }}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard" sx={{ m: '8px 24px' }}>
        <InputLabel>Time options</InputLabel>
        <Select
          sx={{ width: [100, 110, 140], fontSize: [12, 12, 16], minHeight: 32 }}
          value={timeOptions}
          onChange={(e) => handleChangeTimeOption(e.target.value)}
        >
          {timeList.map((item, index) => (
            <MenuItem sx={{ fontSize: [12, 14, 16] }} key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        sx={{ m: 1, '& input': { fontSize: [12, 14, 16], minHeight: 22 } }}
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
        sx={{ m: 1, '& input': { fontSize: [12, 14, 16], minHeight: 22 } }}
        label="To"
        variant="standard"
        type="datetime-local"
        value={dateSearch.toDate}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChangeToDate}
      />
      <IconButton sx={{ ml: 2, alignSelf: 'center' }} onClick={handleSearch}>
        <SearchIcon sx={{ fontSize: 36, fontWeight: 600 }} />
      </IconButton>
    </Box>
  );
}
