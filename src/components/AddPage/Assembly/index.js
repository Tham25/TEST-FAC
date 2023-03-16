import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';

import {
  clearDataAssy,
  createAssyHistoryRedux,
  getCircuitAssyRedux,
} from '~/redux/slices/circuitAssy';
import { defaultSelect, formatDataTable, validateForm } from './BoxEdit';
import InputText from './InputText';
import { setNotification } from '~/redux/slices/notification';

const assyDefault = { id: -1, name: defaultSelect.name, steps: [] };

function Assembly() {
  const dispatch = useDispatch();
  const { circuitAssy, assyHistory, assyId } = useSelector((state) => state.circuitAssy);
  const [assyValue, setAssyValue] = useState(assyDefault.name);
  const { user } = useSelector((state) => state.user);

  const assyArray = useMemo(() => [assyDefault, ...circuitAssy], [circuitAssy]);
  const stepArray = useMemo(
    () => assyArray.find((item) => item.name === assyValue).steps,
    [assyValue, assyArray],
  );
  const [formCreate, setFormCreate] = useState([]);

  useEffect(() => {
    dispatch(getCircuitAssyRedux());
  }, [dispatch]);

  useEffect(() => {
    if (circuitAssy.length) setAssyValue(circuitAssy[0].name);
  }, [circuitAssy]);

  console.log('username', user);
  const formDefault = useMemo(
    () =>
      stepArray.map((item) => {
        return {
          name: item.name,
          status: defaultSelect.value,
          rework_count: null,
          NG_reason: null,
          NG_solution: null,
          test_user: '',
          account: user.user_name || user.user_email,
        };
      }),
    [stepArray, user.user_email, user.user_name],
  );

  useEffect(() => {
    const lenHis = assyHistory.length;
    let newForm = [];

    if (lenHis) {
      if (assyHistory[lenHis - 1].name === assyValue) {
        newForm = assyHistory[lenHis - 1].steps.map((item) => ({
          ...item,
          account: assyHistory[lenHis - 1].created_user.username,
        }));
      } else {
        dispatch(
          setNotification({
            open: true,
            severity: 'error',
            message: `This id already exists and its type is ${assyHistory[lenHis - 1].name}`,
          }),
        );
      }
    } else {
      newForm = formDefault;
    }

    setFormCreate(newForm);
  }, [assyHistory, assyValue, dispatch, formDefault]);

  const handleChangeForm = (step, field, value) => {
    setFormCreate((prev) => {
      const newForm = prev.map((item) => {
        if (item.name === step) {
          item[field] = value;
        }

        return item;
      });
      return newForm;
    });
  };

  const dataTable = useMemo(() => {
    return formatDataTable(formCreate, handleChangeForm);
  }, [formCreate]);

  const handleSubmitForm = () => {
    let result = '';
    if (assyId === '' || assyValue === assyDefault.name) {
      result = 'Please fill assyID, assyName!';
    } else {
      result = validateForm(formCreate);
    }

    if (result !== '') {
      dispatch(setNotification({ open: true, severity: 'error', message: result }));
    } else {
      const formAssy = {
        id_assy: assyId,
        name: assyValue,
        steps: formCreate,
      };

      dispatch(createAssyHistoryRedux(formAssy));
      setFormCreate(formDefault);
    }
  };

  return (
    <Stack sx={{ p: 1, height: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Select assy (*):</InputLabel>
          <Select
            sx={{ width: [100, 110, 140], fontSize: [12, 14, 16], minHeight: 40, mr: 2 }}
            value={assyValue}
            onChange={(e) => {
              setAssyValue(e.target.value);
              dispatch(clearDataAssy({ field: 'assyId', data: '' }));
              dispatch(clearDataAssy({ field: 'assyHistory', data: [] }));
            }}
          >
            {assyArray.map((item, index) => (
              <MenuItem key={index} value={item.name} sx={{ fontSize: [12, 14, 16] }}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InputText />
      </Box>
      {assyValue !== assyDefault.name && formCreate.length ? (
        <DataGridPremium
          hideFooter
          disableColumnMenu
          rows={dataTable.rows}
          columns={dataTable.columns}
          components={{
            // eslint-disable-next-line react/no-unstable-nested-components
            Toolbar: () => (
              <Box sx={{ height: 32, display: 'flex', justifyContent: 'right' }}>
                <Button sx={{ mr: 1 }} onClick={handleSubmitForm}>
                  Submit
                </Button>
              </Box>
            ),
          }}
          getRowHeight={() => 'auto'}
        />
      ) : null}
    </Stack>
  );
}

export default Assembly;
