import React, { useState } from 'react';
import { IconButton, MenuItem, Select, InputLabel, FormControl, Typography, TextField, Stack } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import TempSignImage from '../assets/cs2340-fall-background.png';
import './Sign.css'

export function Sign() {

  return (
    <div className='sign-container'>
      <Typography>Default Sign Text</Typography>
    </div>
  )
}

export function SignTextFormatter() {

  const [font, setFont] = useState('Arial');

  const handleChange = (event) => {
    setFont(event.target.value);
  };

  return (
    <Stack spacing={2} direction="row">
      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
        <InputLabel id="demo-select-small-label">Font</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          label="Font"
          value={font}
          onChange={handleChange}
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Times New Roman" >Times New Roman </MenuItem>
          <MenuItem value="Courier">Courier</MenuItem>
          <MenuItem value="Bradley Hand">Bradley Hand</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="outlined-uncontrolled"
        label="Size"
        defaultValue="14"
        size="small"
        sx={{ m: 1, minWidth: 70, width: '70px' }}
      />
      <IconButton>
        <FormatBoldIcon />
      </IconButton>
      <IconButton>
        <FormatItalicIcon />
      </IconButton>
      <IconButton>
        <FormatUnderlinedIcon />
      </IconButton>
      <IconButton>
        <FormatColorTextIcon />
      </IconButton>
    </Stack>
  );

}
export function EditSign() {

  return (
    <div
      className='formatting-container'
    >
      <SignTextFormatter />
      <TextField
          id="outlined-multiline-static"
          label="Sign Text"
          multiline
          rows={4}
          defaultValue="Default Value"
          margin = "normal"
          fullWidth
        />
    </div>
  );
};
