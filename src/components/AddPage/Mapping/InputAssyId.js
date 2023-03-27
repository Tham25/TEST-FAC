import { useEffect, useState } from 'react';

import { Box, Stack, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function InputAssyId({ title, assyId, error, handleChangAssyId, viewBoxState }) {
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
