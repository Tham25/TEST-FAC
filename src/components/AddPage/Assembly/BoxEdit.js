import { useCallback, useEffect, useState } from 'react';
import { Box, MenuItem, Select, TextareaAutosize } from '@mui/material';

function BoxStatus({ cellValues, handleChange }) {
  const [statusValue, setStatusValue] = useState(cellValues.value[0].value);

  useEffect(() => {
    if (cellValues.row.status !== null) {
      setStatusValue(cellValues.row.status);
    }
  }, [cellValues]);

  return (
    <Select
      sx={{ width: '100%' }}
      value={statusValue}
      onChange={(e) => {
        setStatusValue(e.target.value);
        handleChange('status', e.target.value);
      }}
    >
      {cellValues.value.map((item, index) => (
        <MenuItem key={index} value={item.value}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
}

function BoxInput({ params, handleChangeForm }) {
  const { id, field, value, api } = params;
  const [textInput, setTextInput] = useState(value);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleChangeForm(textInput);
    }
  };

  const handleChangeEditValue = useCallback(
    (event) => {
      const newValue = event.target.value;
      setTextInput(newValue);
      api.setEditCellValue({ id, field, value: newValue }, event);
    },
    [api, field, id],
  );

  return (
    <TextareaAutosize
      value={textInput}
      minRows={3}
      onChange={handleChangeEditValue}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
}

export const defaultSelect = { value: -1, name: '--------' };

export function formatDataTable(formCreate, handleChangeForm) {
  const rows = [];
  const columns = [];

  if (formCreate?.length) {
    formCreate.forEach((item, index) => {
      rows.push({
        id: index,
        STT: index + 1,
        Steps: item.name,
        status: item.status,
        Status: [defaultSelect, { value: 1, name: 'OK' }, { value: 0, name: 'NG' }],
        'Num of reworks': item.rework_count,
        Reason: item.NG_reason,
        Stragtegy: item.NG_solution,
        Author: item.test_user,
        Account: item.account,
      });
    });

    Object.keys(rows[0]).forEach((key) => {
      if (key !== 'id' && key !== 'status') {
        const columInfo = {
          field: key,
          editable: key !== 'STT' && key !== 'Steps' && key !== 'Status' && key !== 'Account',
          sortable: false,
          flex: key !== 'STT' && key !== 'Status',
          headerAlign: 'center',
          align: key !== 'Steps' ? 'center' : 'left',
          width: key === 'STT' && 60,
        };

        if (key === 'Status' || key === 'Author') {
          columInfo.renderHeader = (params) => (
            <Box sx={{ fontWeight: 500 }}>{params.field}(*)</Box>
          );
        }

        if (key === 'Status') {
          columInfo.width = 120;
          columInfo.renderCell = (cellValues) => {
            return (
              <BoxStatus
                cellValues={cellValues}
                handleChange={(field, value) =>
                  handleChangeForm(cellValues.row.Steps, field, value)
                }
              />
            );
          };
        }

        if (key !== 'STT' && key !== 'Steps' && key !== 'Status' && key !== 'Account') {
          columInfo.renderEditCell = (params) => {
            let field = key === 'Num of reworks' && 'rework_count';
            if (key === 'Reason') field = 'NG_reason';
            if (key === 'Stragtegy') field = 'NG_solution';
            if (key === 'Author') field = 'test_user';

            return (
              <BoxInput
                params={params}
                handleChangeForm={(value) => handleChangeForm(params.row.Steps, field, value)}
              />
            );
          };
        }

        columns.push(columInfo);
      }
    });
  }

  return { rows, columns };
}

export function validateForm(formCreate) {
  let error = '';
  formCreate.forEach((item) => {
    if (item.status === defaultSelect.value || item.create_user === '') {
      error = 'Please fill out all required fields!';
    }
  });
  return error;
}
