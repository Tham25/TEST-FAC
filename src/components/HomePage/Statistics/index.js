import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import { getInfoCircuitAssyRedux, getListToolRedux } from '~/redux/slices/statistics';
import { InfoSearch } from './InfoSearch';
import ListTool from './ListTool';
import { getCircuitAssyRedux } from '~/redux/slices/circuitAssy';

function formatData(infoCircuitAssy, circuitAssy, handleNavigate) {
  const columns = [];
  const rows = [];

  if (infoCircuitAssy.length && circuitAssy.length) {
    infoCircuitAssy.forEach((item, index) => {
      const rowInfo = {
        id: item.block,
        STT: index,
        Catalog: circuitAssy.find((element) => element.id === item.block)?.name,
        Total: item.total,
        Passed: item.pass_count,
        Failed: item.fail_count,
        Unknown: item.unknow_status,
      };
      rows.push(rowInfo);
    });

    Object.keys(rows[0]).forEach((key) => {
      if (key !== 'id') {
        const columInfo = {
          field: key,
          flex: 1,
          sortable: false,
          headerAlign: 'center',
          align: key !== 'Catalog' && 'center',
          resizable: true,
        };

        if (key === 'Catalog') {
          columInfo.renderCell = (cellValues) => (
            <Button onClick={() => handleNavigate(cellValues.value)} sx={{ textTransform: 'none' }}>
              {cellValues.value}
            </Button>
          );
        }

        columns.push(columInfo);
      }
    });
  }

  return { rows, columns };
}

function Statistics() {
  const { infoCircuitAssy } = useSelector((state) => state.statistics);
  const [dataTable, setDataTable] = useState({ rows: [], columns: [] });
  const { circuitAssy } = useSelector((state) => state.circuitAssy);
  const [circuitBlockValue, setCircuitBlockValue] = useState('All');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const circuitAssyOptions = useMemo(() => {
    const circuitBlockName = circuitAssy.map((item) => {
      return item.name;
    });

    return ['All', ...circuitBlockName];
  }, [circuitAssy]);

  useEffect(() => {
    // first load
    dispatch(getCircuitAssyRedux());
  }, [dispatch]);

  const handleNavigate = useCallback(
    (blockName) => {
      setCircuitBlockValue(blockName);
      navigate(blockName, { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    const temp = formatData(infoCircuitAssy, circuitAssy, handleNavigate);
    setDataTable(temp);
  }, [circuitAssy, handleNavigate, infoCircuitAssy]);

  const handleChangeInfoSearch = useCallback(
    (newInfo) => {
      if (circuitBlockValue === 'All') {
        dispatch(getInfoCircuitAssyRedux(newInfo));
      } else {
        dispatch(getListToolRedux(newInfo));
      }
    },
    [circuitBlockValue, dispatch],
  );

  return (
    <Stack sx={{ height: '100%', p: 1 }}>
      <Stack sx={{ flexDirection: 'row' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Circuit Blocks</InputLabel>
          <Select
            sx={{ width: [100, 110, 140], fontSize: [12, 12, 14], minHeight: 32 }}
            value={circuitBlockValue}
            onChange={(e) => handleNavigate(e.target.value)}
          >
            {circuitAssyOptions.map((item, index) => (
              <MenuItem key={index} value={item} sx={{ fontSize: [12, 14, 14] }}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InfoSearch handleChangeInfoSearch={handleChangeInfoSearch} />
      </Stack>
      {circuitAssy.length && (
        <Routes>
          <Route path="/" element={<Navigate to="All" />} />
          <Route
            path="All"
            element={
              <DataGridPremium
                resizable
                disableColumnMenu
                autoPageSize
                rows={dataTable.rows}
                columns={dataTable.columns}
              />
            }
          />
          {circuitAssy.map((item, index) => (
            <Route key={index} path={item.name} element={<ListTool />} />
          ))}
        </Routes>
      )}
    </Stack>
  );
}

export default Statistics;
