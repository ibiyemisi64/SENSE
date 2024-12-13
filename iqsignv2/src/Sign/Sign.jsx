import React, { useEffect, useState } from 'react';
import { Grid2, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, Typography, TextField, Stack } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import DefaultClassSign from '../assets/backgrounds/class.png';
import TopBar from "../Topbar/TopBar.jsx";
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { getCurrentSignData } from './hooks/getSignData.jsx'

const Sign = ({ signData }) => {

  return (
      <>
    <Box
      component="img"
      sx={{
        maxHeight: { xs: 233, md: 357 },
        maxWidth: { xs: 350, md: 500 },
        boxShadow: 3
      }}
      alt="User's current sign."
      src={signData?.imageurl}
    >

    </Box>
      </>
  );
}

export const SignImageLink = () => {
  return (
    <Sign />
  );
};

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
        inputprops={{'data-testid':'sign-component'}}
      >
        <MenuItem aria-label="Arial" value="Arial">Arial</MenuItem>
        <MenuItem aria-label="Times New Roman" value="Times New Roman" >Times New Roman </MenuItem>
        <MenuItem aria-label="Courier" value="Courier">Courier</MenuItem>
        <MenuItem aria-label="Bradley Hand" value="Bradley Hand">Bradley Hand</MenuItem>
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
        <FormatBoldIcon aria-label={"Bold"} />
      </IconButton>
      <IconButton>
        <FormatItalicIcon aria-label={"Italic"} />
      </IconButton>
      <IconButton>
        <FormatUnderlinedIcon aria-label={"Underlined"} />
      </IconButton>
      <IconButton>
        <FormatColorTextIcon aria-label={"Text Color"} />
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
        sx={{ mt: 4 }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, backgroundColor: 'black', color: 'white' }}
      >
        SAVE
      </Button>
    <Button
        variant="contained"
        color="black"
        sx={{ ml: 2, mt: 3, backgroundColor: 'green', color: 'white' }}
    >
        Display Sign
    </Button>
    </Box >
  );

}

export function SignEditor() {
  return (
    <>
      <TopBar></TopBar>
      <Grid2
        container
        spacing={4}  // Add some spacing between the items
        sx={{
          background: 'white',
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          alignItems: 'left',
          justifyContent: 'left',
          marginTop: '100px'
        }}
      >

        <Grid2 item xs={12} sm={6}>
          <SignTextFormatter />
        </Grid2>


        <Grid2 item container direction="column" alignItems="flex-start">
          <Sign />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor: 'black', color: 'white'}}
            startIcon={<EditIcon />} 
            component={Link} to="/gallery"
          >
            Edit Background
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
}

export default Sign;