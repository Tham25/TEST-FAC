import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Stack } from '@mui/material';

import {
  checkAssyIdsRedux,
  getAssyHistoryRedux,
  getAssyTemplateRedux,
  mappingAssyIdRedux,
} from '~/redux/slices/circuitAssy';
import InputSearch from '~/components/InputSearchSN';
import InputAssyId from './InputAssyId';
import { checkAssyId, validateFormMap } from '~/utils/mapping';
import { fieldAssyHistory } from '~/config/assyHistory';

function Mapping() {
  const dispatch = useDispatch();
  const { assyTemplate, assyIdsCheck, mappingHistory } = useSelector((state) => state.circuitAssy);
  const [formMapping, setFormMapping] = useState([]);
  const [errorForm, setErrorForm] = useState({});
  const [statusMapping, setStatusMapping] = useState('Verify');
  const serialNumber = useRef('');
  const errorSN = useRef('');
  const [viewBoxState, setViewBoxState] = useState(false);

  useEffect(() => {
    dispatch(getAssyTemplateRedux());
  }, [dispatch]);

  const formDefault = useMemo(
    () =>
      assyTemplate.map((item) => ({
        assy_name: item.name,
        assy_id: '',
      })),
    [assyTemplate],
  );

  useEffect(() => {
    if (mappingHistory.length) {
      const newForm = [];
      formDefault.forEach((item) => {
        const assyHis = mappingHistory.find((element) => element.name === item.assy_name);
        if (assyHis) {
          const { assy } = assyHis;
          newForm.push({
            assy_name: item.assy_name,
            assy_id: assy[assy.length - 1].id_assy,
          });
        }
      });
      setFormMapping(newForm);
    } else {
      setFormMapping(formDefault);
    }
  }, [formDefault, mappingHistory]);

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
    dispatch(getAssyHistoryRedux(fieldAssyHistory.serialNumber, value));
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
            <Box sx={{ mt: 1 }}>
              Imei: {mappingHistory.length ? mappingHistory[0]?.assy[0]?.device.imei : ''}
            </Box>
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
