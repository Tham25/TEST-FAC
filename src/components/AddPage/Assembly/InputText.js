import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAssyHistoryRedux } from '~/redux/slices/circuitAssy';

function InputText() {
  const { assyId } = useSelector((state) => state.circuitAssy);
  const [idValue, setIdValue] = useState(assyId);
  const dispatch = useDispatch();

  const handleSearchAssyHis = (e) => {
    if (e.keyCode === 13) {
      dispatch(getAssyHistoryRedux('id_assy', idValue.trim()));
      e.target.blur();
    }
  };

  useEffect(() => {
    setIdValue(assyId);
  }, [assyId]);

  return (
    <TextField
      sx={{ m: 1, fontSize: 16, '& input': { minHeight: 32 } }}
      label="AssyId (*)"
      variant="standard"
      value={idValue}
      onChange={(e) => setIdValue(e.target.value)}
      onKeyDown={handleSearchAssyHis}
    />
  );
}

export default InputText;
