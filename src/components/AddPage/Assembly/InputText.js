import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

function InputText({ assyId, handleSearchAssyHis }) {
  const [idValue, setIdValue] = useState(assyId);

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
      onBlur={() => {
        handleSearchAssyHis(idValue.trim());
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      }}
    />
  );
}

export default InputText;
