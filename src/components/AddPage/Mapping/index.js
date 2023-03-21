import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Stack, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import {
  checkAssyIdsRedux,
  getAssyHistoryRedux,
  getCircuitAssyRedux,
  mappingAssyIdRedux,
} from '~/redux/slices/circuitAssy';
import InputSearch from '~/components/InputSearchSN';

function validateFormMap(form) {
  let error = false;
  const errorFormMap = {};

  form.forEach((item) => {
    const assyId = item.assy_id.trim();
    if (!assyId) {
      error = true;
      errorFormMap[item.assy_name] = { mess: 'This field is required!', severity: 'error' };
    } else {
      const array = form.filter((element) => element.assy_id === assyId);
      if (array.length > 1) {
        error = true;
        errorFormMap[item.assy_name] = { mess: 'This Assy ID is duplicated!', severity: 'error' };
      }
    }
  });

  return { error, errorFormMap };
}

function checkAssyId(assyIdsCheck, formMapping, serialNumber) {
  const errorFormMap = {};
  let error = false;
  assyIdsCheck.forEach((item) => {
    const assyId = Object.keys(item)[0];
    const info = item[assyId];

    const result = formMapping.find((element) => element.assy_id === assyId);

    if (result) {
      if (info.existed && info.name !== result.assy_name) {
        errorFormMap[result.assy_name] = {
          mess: `Assy Id is existed in ${info.name}!`,
          severity: 'error',
        };
        error = true;
      } else if (!info.existed) {
        error = true;
        errorFormMap[result.assy_name] = { mess: "Assy Id ins't existed!", severity: 'error' };
      }

      if (info.serial_number && info.serial_number !== serialNumber) {
        errorFormMap[result.assy_name] = {
          mess: `This assy is existed in device ${info.serial_number}!`,
          severity: 'warning',
        };
      }
    }
  });

  return { error, errorFormMap };
}

function Mapping() {
  const dispatch = useDispatch();
  const { circuitAssy, assyIdsCheck, assyHistory } = useSelector((state) => state.circuitAssy);
  const [formMapping, setFormMapping] = useState([]);
  const [errorForm, setErrorForm] = useState({});
  const [statusMapping, setStatusMapping] = useState('Verify');
  const serialNumber = useRef('');
  const errorSN = useRef('');
  const [viewBoxState, setViewBoxState] = useState(false);

  useEffect(() => {
    dispatch(getCircuitAssyRedux());
  }, [dispatch]);

  const formDefault = useMemo(
    () =>
      circuitAssy.map((item) => ({
        assy_name: item.name,
        assy_id: '',
      })),
    [circuitAssy],
  );

  useEffect(() => {
    if (assyHistory.length) {
      const newForm = [];
      formDefault.forEach((item) => {
        const index = assyHistory.findIndex((element) => element.name === item.assy_name);
        if (index !== -1) {
          newForm.push({
            assy_name: item.assy_name,
            assy_id: assyHistory[index].id_assy,
          });
        }
      });
      setFormMapping(newForm);
    } else {
      setFormMapping(formDefault);
    }
  }, [formDefault, assyHistory]);

  const handleChangAssyId = (field, value) => {
    setFormMapping((prev) =>
      prev.map((item) => {
        if (item.assy_name === field) {
          item.assy_id = value;
        }
        return item;
      }),
    );
  };

  useEffect(() => {
    if (assyIdsCheck.length) {
      const { error, errorFormMap } = checkAssyId(assyIdsCheck, formMapping, serialNumber.current);
      setErrorForm(errorFormMap);
      if (!error) {
        setStatusMapping('Submit');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assyIdsCheck]);

  const handleMapping = () => {
    if (statusMapping === 'Verify') {
      errorSN.current = '';

      if (!serialNumber.current) {
        errorSN.current = 'This field is required!';
      }
      const { error, errorFormMap } = validateFormMap(formMapping);

      if (!error && !!serialNumber.current) {
        const assyIdArray = formMapping.map((item) => item.assy_id);
        dispatch(checkAssyIdsRedux(assyIdArray));

        setErrorForm({});
        if (!viewBoxState) setViewBoxState(true);
      } else {
        setErrorForm(errorFormMap);
      }
    } else {
      dispatch(
        mappingAssyIdRedux({
          serial_number: serialNumber.current,
          assys_ids: formMapping.map((item) => item.assy_id),
        }),
      );
    }
  };

  const handleSearch = (value) => {
    serialNumber.current = value;
    setErrorForm({});
    setViewBoxState(false);
    setFormMapping(formDefault);
    dispatch(getAssyHistoryRedux('serial_number', value));
  };

  return (
    <>
      <Stack sx={{ alignItems: 'center' }}>
        <Stack
          direction="row"
          sx={{
            width: '60%',
            maxWidth: 500,
            mb: 2,
            mt: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack>
            <Box>
              <InputSearch label="Serial number" handleSearch={handleSearch} />
              <span style={{ color: 'red', fontSize: 14 }}>(*)</span>
            </Box>
            <Box sx={{ mt: 1, color: 'red', fontSize: 12 }}>{errorSN.current}</Box>
          </Stack>
          <Button
            sx={{ backgroundColor: '#e7e7e7', justifySelf: 'end', height: '48px' }}
            onClick={handleMapping}
          >
            {statusMapping}
          </Button>
        </Stack>
      </Stack>
      <Stack sx={{ alignItems: 'center' }}>
        {formMapping.map((item, index) => (
          <InputAssyId
            key={index}
            title={item.assy_name}
            assyId={item.assy_id}
            error={errorForm[item.assy_name]}
            handleChangAssyId={handleChangAssyId}
            viewBoxState={viewBoxState}
          />
        ))}
      </Stack>
    </>
  );
}

export default Mapping;

function InputAssyId({ title, assyId, error, handleChangAssyId, viewBoxState }) {
  const [inputText, setInputText] = useState(assyId);

  useEffect(() => {
    setInputText(assyId);
  }, [assyId]);

  const handleChangeText = (e) => setInputText(e.target.value);
  const handelKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleChangAssyId(title, e.target.value);
      e.target.blur();
    }
  };

  return (
    <Stack direction="row" sx={{ width: '60%', maxWidth: 500, mt: 2 }}>
      <Stack sx={{ flex: 1, justifyContent: 'center' }}>
        <Box>
          {title} <span style={{ color: 'red', fontSize: 12 }}>&nbsp;(*)</span> :
        </Box>
        <Box
          sx={{ mt: '4px', fontSize: 12, color: error?.severity === 'error' ? 'red' : '#d19408' }}
        >
          {error?.mess}
        </Box>
      </Stack>
      <TextField
        sx={{ width: '200px', ml: 4 }}
        value={inputText}
        onChange={handleChangeText}
        onKeyDown={handelKeyDown}
        inputProps={{
          sx: {
            p: 1,
          },
        }}
        onBlur={(e) => handleChangAssyId(title, e.target.value)}
      />
      {viewBoxState && <BoxState error={error} />}
    </Stack>
  );
}

function BoxState({ error }) {
  let icon;

  if (error) {
    icon =
      error.severity === 'error' ? (
        <HighlightOffIcon sx={{ color: 'red' }} />
      ) : (
        <ErrorOutlineIcon sx={{ color: '#d19408' }} />
      );
  } else {
    icon = <CheckCircleOutlineIcon sx={{ color: 'green' }} />;
  }

  return <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', width: '20px' }}>{icon}</Box>;
}
