import React, { useState } from 'react';
import TempSignImage from '../assets/cs2340-fall-background.png';
import './Sign.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';


export function Sign() {
  const [text, setText] = useState('Default Sign Text');

  // Function to update the sign text
  const updateText = (newText) => {
    setText(newText);
  };

  return (
    <div className='sign-container' style={{
      backgroundImage: `url(${TempSignImage})`,
    }}>
      {text}
    </div>
  )
}

export function EditSign() {
  const [text, setText] = useState('Default Sign Text');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleBoldClick = () => {
    setIsBold(!isBold);
  };

  const handleItalicClick = () => {
    setIsItalic(!isItalic);
  };

  const handleUnderlineClick = () => {
    setIsUnderline(!isUnderline);
  };

  const getTextStyle = () => {
    let style = {};
    if (isBold) style.fontWeight = 'bold';
    if (isItalic) style.fontStyle = 'italic';
    if (isUnderline) style.textDecoration = 'underline';
    return style;
  };

  const [font, setFont] = useState('Arial');

  const handleChange = (event) => {
    setFont(event.target.value);
  };


  return (
    <div
      className='formatting-container'
    >

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
        <IconButton onClick={handleBoldClick}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton onClick={handleItalicClick}>
          <FormatItalicIcon />
        </IconButton>
        <IconButton onClick={handleUnderlineClick}>
          <FormatUnderlinedIcon />
        </IconButton>
        <IconButton>
          <FormatColorTextIcon />
        </IconButton>
      </Stack>
      <textarea className='formatting-edit-container' rows="auto" minrows="3" cols="auto" value={text} onChange={handleTextChange} style={getTextStyle()} />

    </div>
  );
};
