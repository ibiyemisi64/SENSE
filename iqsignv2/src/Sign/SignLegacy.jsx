/*
 * SignLegacy.jsx
 *
 * Purpose:
 *
 *
 * Copyright 2024 Brown University --
 *
 * All Rights Reserved
 *
 * Permission to use, copy, modify, and distribute this software and its
 * documentation for any purpose other than its incorporation into a
 * commercial product is hereby granted without fee, provided that the
 * above copyright notice appear in all copies and that both that
 * copyright notice and this permission notice appear in supporting
 * documentation, and that the name of Brown University not be used in
 * advertising or publicity pertaining to distribution of the software
 * without specific, written prior permission.
 *
 * BROWN UNIVERSITY DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 * SOFTWARE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL BROWN UNIVERSITY
 * BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR ANY
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
 * WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS
 * ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
 * OF THIS SOFTWARE.
 */
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
import Sign from './Sign.jsx'

export function SignDisplayScaleItem() {
  const [scale, setScale] = useState('16 x 9');

  const handleChange = (event) => {
    setScale(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 70 }} size="small">
      <InputLabel id="demo-select-small-label">Scale</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        label="Scale"
        value={scale}
        onChange={handleChange}
        inputprops={{'data-testid':'sign-component'}}
      >
        <MenuItem aria-label="16 x 9" value="16 x 9">16 x 9</MenuItem>
        <MenuItem aria-label="3 x 4" value="3 x 4" >3 x 4 </MenuItem>
        <MenuItem aria-label="16 x 10" value="16 x 10">16 x 10</MenuItem>
        <MenuItem aria-label="other" value="other">other</MenuItem>
      </Select>
    </FormControl>
  )
}

export function SignTextFormatterLegacy() {

  return (
    <Box
      sx={{
        width: '100%', // Ensure the Box takes up the full width of its container
      }}
    >
      <SignFormatterMenuLegacy />
      <TextField
        id="outlined-multiline"
        label="Sign Contents"
        multiline
        rows={4}
        defaultValue="%bg cyan #bold #red Stepped in %fg blue @ sv-comic-char-rolled @ sv-comic-char-away @ sv-seagull"
        fullWidth
        sx={{ mt: 4 }}
      />
      <Typography sx={{ ml: 1, mt: 1 }}>
        <Link to="https://sherpa.cs.brown.edu:3336/instructions" underline="hover" sx={{ color: 'black' }}>
          View Instructions
        </Link>
      </Typography>
        <Typography sx={{ ml: 1, mt: 1 }}>
            <Link to="https://fontawesome.com/search?o=r&m=free&s=solid" underline="hover" sx={{ color: 'black' }}>
                Browse font-awesome icons
            </Link>
        </Typography>
        <Typography sx={{ ml: 1, mt: 1 }}>
            <Link to="https://sherpa.cs.brown.edu:3336/svgimages" underline="hover" sx={{ color: 'black' }}>
                Browse svg library
            </Link>
        </Typography>
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

export function SignDimensionMenuItem() {
  return (
    <>
    <TextField
      id="outlined-uncontrolled"
      label="Width"
      defaultValue="2048"
      size="small"
      sx={{ m: 1, minWidth: 70, maxWidth: 70 }}
    />
    <TextField
      id="outlined-uncontrolled"
      label="Height"
      defaultValue="1152"
      size="small"
      sx={{ m: 1, minWidth: 70, maxWidth: 70 }}
    />
    </>
  )
}

export function SignFormatterMenuLegacy() {

  return (
    <Stack direction="row" spacing={2} >
      <TextField
      id="outlined-uncontrolled"
      label="Sign Name"
      defaultValue="Hello"
      size="small"
      sx={{ m: 1, minWidth: 140, maxWidth: 140 }}
      />
      <SignDisplayScaleItem />
      <SignDimensionMenuItem />
    </Stack>
  )
}

export default function SignEditorLegacy() {
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
          <SignTextFormatterLegacy/>
        </Grid2>


        <Grid2 item container direction="column" alignItems="flex-start">
          <Sign />
        </Grid2>
      </Grid2>
    </>
  );
}
