import React, { useState } from 'react';
import TempSignImage from '../assets/cs2340-fall-background.png';
import './Sign.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';

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

  return (
    <div
      className='formatting-container'
    >
      
      <Stack spacing={2} direction="row">
        <Button onClick={handleBoldClick}>Bold</Button>
        <Button onClick={handleItalicClick}>Italic</Button>
        <Button onClick={handleUnderlineClick}>Underline</Button>
      </Stack>
      <textarea className='formatting-edit-container' rows="auto" minrows="3" cols = "auto" value={text} onChange={handleTextChange} style={getTextStyle()} />
      <div>
        
      </div>
    </div>
  );
};
