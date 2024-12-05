import React, { useState } from 'react';
import { Grid2, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, Typography, TextField, Stack } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';

export default function Sign() {

  return (
    <Box id="outlined-uncontrolled" component="div" sx={{
      backgroundImage: `url('./assests/cs2340-fall-background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minWidth: 500,
      minHeight: 300,
      mt: 4,
      justifyContent: 'center',
      display: 'flex',
      boxShadow: 3

    }}>
      <Typography sx={{
        m: 1,
        padding: 5
      }} align='center' color='textSecondary'>Default Sign Text</Typography>
    </Box>
  )
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
    <Stack direction="row" spacing={2} sx={{ mt: 4 }} fullWidth >
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
      <SignTextFormatterMenu fullWidth />
      <TextField
        id="outlined-multiline"
        label="Sign Text"
        multiline
        rows={4}
        defaultValue="Default Sign Text"
        sx={{
          mt: 4
        }}
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
    <Grid2 container
      fullWidth
      sx={{
        padding: 1,
        background: 'white',
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid2 item fullWidth>
        <SignTextFormatter fullWidth />
      </Grid2>
      <Grid2 item fullWidth>
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
};
