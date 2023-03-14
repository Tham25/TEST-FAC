import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import { getInfoCircuitBlocksRedux, getListToolRedux } from '~/redux/slices/statistics';
import { InfoSearch } from './InfoSearch';
import ListTool from './ListTool';
import { getCircuitBlocksRedux } from '~/redux/slices/circuitBlocks';

function formatData(infoCircuitBlocks, circuitBlocks, handleNavigate) {
  const columns = [];
  const rows = [];

  if (infoCircuitBlocks.length && circuitBlocks.length) {
    infoCircuitBlocks.forEach((item, index) => {
      // view - khong click
      const rowInfo = {
        id: item.block,
        STT: index,
        Catalog: circuitBlocks.find((element) => element.id === item.block).name,
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
  const { infoCircuitBlocks } = useSelector((state) => state.statistics);
  const [dataTable, setDataTable] = useState({ rows: [], columns: [] });
  const { circuitBlocks } = useSelector((state) => state.circuitBlocks);
  const [circuitBlockValue, setCircuitBlockValue] = useState('All');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const circuitBlocksOptions = useMemo(() => {
    const circuitBlockName = circuitBlocks.map((item) => {
      return item.name;
    });

    return ['All', ...circuitBlockName];
  }, [circuitBlocks]);

  useEffect(() => {
    // first load
    dispatch(getCircuitBlocksRedux());
  }, [dispatch]);

  const handleNavigate = useCallback(
    (blockName) => {
      setCircuitBlockValue(blockName);
      navigate(blockName, { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    const temp = formatData(infoCircuitBlocks, circuitBlocks, handleNavigate);
    setDataTable(temp);
  }, [circuitBlocks, handleNavigate, infoCircuitBlocks]);

  const handleChangeInfoSearch = useCallback(
    (newInfo) => {
      if (circuitBlockValue === 'All') {
        dispatch(getInfoCircuitBlocksRedux(newInfo));
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
            {circuitBlocksOptions.map((item, index) => (
              <MenuItem key={index} value={item} sx={{ fontSize: [12, 14, 14] }}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InfoSearch handleChangeInfoSearch={handleChangeInfoSearch} />
      </Stack>
      {circuitBlocks.length && (
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
          {circuitBlocks.map((item) => (
            <Route key={item.id} path={item.name} element={<ListTool />} />
          ))}
        </Routes>
      )}
    </Stack>
  );
}

export default Statistics;
