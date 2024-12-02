import React, { useState } from 'react';
import { Grid2, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, Typography, TextField, Stack } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import DefaultClassSign from '../assets/backgrounds/class.png';


export default function Sign() {
  return (
    <Box
      component="img"
      sx={{
        maxHeight: { xs: 233, md: 357 },
        maxWidth: { xs: 350, md: 500 },
        boxShadow: 3
      }}
    alt="User's current sign."
    src={DefaultClassSign}
    >

    </Box>
  );
}

export function SignTextFormatterSizeMenuItem() {
  return (
    <TextField
      id="outlined-uncontrolled"
      label="Size"
      defaultValue="14"
      size="small"
      sx={{ m: 1, minWidth: 70, maxWidth: 70 }}
    />
  )
}

export function SignTextFormatterFontMenuItem() {
  const [font, setFont] = useState('Arial');

  const handleChange = (event) => {
    setFont(event.target.value);
  };

  return (
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
  )
}

export function SignTextFormatterMenu() {

  return (
    <Stack direction="row" spacing={2} >
      <SignTextFormatterFontMenuItem />
      <SignTextFormatterSizeMenuItem />
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
  )
}
export function SignTextFormatter() {

  return (
    <Box
      sx={{
        width: '100%', // Ensure the Box takes up the full width of its container
      }}
    >
      <SignTextFormatterMenu />
      <TextField
        id="outlined-multiline"
        label="Sign Text"
        multiline
        rows={4}
        defaultValue="Default Sign Text"
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, backgroundColor: 'black', color: 'white' }}
      >
        SAVE
      </Button>
    </Box >
  );

}

export function SignEditor() {
  return (
    <Grid2
      container
      spacing={4}  // Add some spacing between the items
      sx={{
        background: 'white',
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        alignItems: 'flex-start', // Align to the start
        justifyContent: 'center',
      }}
    >
      {/* Sign Text Formatter */}
      <Grid2 item xs={12} sm={6}> {/* Adjusted item size for responsiveness */}
        <SignTextFormatter fullWidth />
      </Grid2>

      {/* Sign with Background */}
      <Grid2 item xs={12} sm={6}> {/* Adjusted item size for responsiveness */}
        <Sign />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, backgroundColor: 'black', color: 'white' }}
        >
          Edit Background
        </Button>
      </Grid2>
    </Grid2>
  );
}
