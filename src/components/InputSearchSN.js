import { useState } from 'react';
import { FormControl, IconButton, Input, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function InputSearch({ label, handleSearch }) {
  const [value, setValue] = useState('');

  return (
    <FormControl sx={{ width: '25ch' }} variant="standard">
      <InputLabel>{label}</InputLabel>
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        type="text"
        endAdornment={
          <IconButton sx={{ p: 0 }} onClick={() => handleSearch(value.trim())}>
            <SearchIcon />
          </IconButton>
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.target.blur();
            handleSearch(value.trim());
          }
        }}
        onBlur={() => handleSearch(value.trim())}
      />
    </FormControl>
  );
}

export default InputSearch;
