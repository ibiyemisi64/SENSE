import React, { useState , useEffect} from 'react';
import { Grid2, Box, Button, MenuItem, Select, InputLabel, FormControl, Typography, TextField, Stack } from '@mui/material';
import TopBar from "../Topbar/TopBar.jsx";
import { Link } from 'react-router-dom';
import Sign from './Sign.jsx'
import { useSignData, useUpdateSign } from './hooks/getSignData.jsx'

export const SignDisplayScaleItem = ({ dim, setDim }) => {
  console.log("sign dim: " + {dim});
  const handleChange = (event) => {
    setDim(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 140 }} size="small">
      <InputLabel id="demo-select-small-label">Scale</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        label="Scale"
        value={dim}
        onChange={handleChange}
        inputprops={{'data-testid':'sign-component'}}
      >
        <MenuItem aria-label="16 x 9" value="16by9">16 x 9</MenuItem>
        <MenuItem aria-label="3 x 4" value="3by4" >3 x 4 </MenuItem>
        <MenuItem aria-label="16 x 10" value="16by10">16 x 10</MenuItem>
        <MenuItem aria-label="other" value="other">other</MenuItem>
      </Select>
    </FormControl>
  )
}


export const SignDimensionMenuItem = ({ width, setWidth, height, setHeight }) => {

  const handleChangeHeight = (event) => {
    setHeight(event.target.value.trim()); 
  };

  const handleChangeWidth = (event) => {
    setWidth(event.target.value.trim()); 
  };

  return (
    <>
    <TextField
      id="outlined-uncontrolled"
      label="Width"
      defaultValue={width}
      size="small"
      sx={{ m: 1, minWidth: 70, maxWidth: 70 }}
      onChange={handleChangeWidth}
    />
    <TextField
      id="outlined-uncontrolled"
      label="Height"
      defaultValue={height}
      size="small"
      sx={{ m: 1, minWidth: 70, maxWidth: 70 }}
      onChange={handleChangeHeight}
    />
    </>
  )
}

export const LegacySignFormatterMenu = ({ name, setName, dim, setDim, width, setWidth, height,setHeight }) => {
  const handleChange = (event) => {
    setName(event.target.value.trim()); 
  };

  return (
    <Stack direction="row" spacing={2} >
      <TextField
      id="outlined-uncontrolled"
      label="Sign Name"
      defaultValue={name}
      onChange={handleChange}
      size="small"
      sx={{ m: 1, minWidth: 140, maxWidth: 140 }}
      />
      <SignDisplayScaleItem dim={dim} setDim={setDim} />
      <SignDimensionMenuItem height={height} setHeight={setHeight} width={width} setWidth={setWidth}/>
    </Stack>
  )
}

export const LegacySignFormatterContents = ({ body, setBody }) => {
  const handleChange = (event) => {
    setBody(event.target.value); 
  };

  return (
    <>
    <TextField
        id="outlined-multiline"
        label="Sign Contents"
        multiline
        rows={4}
        defaultValue={body}
        onChange={handleChange}
        sx={{ mt: 4 ,width: "100%"}}
      />
    </>
  )
}

export function SignEditorSave({ signData }){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async ({ signData, loading, setLoading }) => {
        try {
            const result = await useUpdateSign({ signData, loading, setLoading });
        } catch (err) {
            console.error("Error calling updateSign:", err);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, backgroundColor: 'black', color: 'white' }}
                onClick={() => handleClick({ signData, loading, setLoading })}
                disabled={loading}
            >
                {loading ? 'Saving...' : 'SAVE'}
            </Button>

            {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error.message}</div>}
        </>
    );
};

export const LegacySignEditor = ({ signData }) => {
  const [name, setName] = useState(signData?.name);
  const [height, setHeight] = useState(signData?.height);
  const [width, setWidth] = useState(signData?.width);
  const [dim, setDim] = useState(signData?.dim);
  const [body, setBody] = useState(signData?.signbody);


  return (
    <Box
      sx={{
        width: '100%', 
      }}
    >
      <LegacySignFormatterMenu name={name} setName={setName} dim={dim} setDim={setDim} width={width} setWidth={setWidth} height={height} setHeight={setHeight} />
      <LegacySignFormatterContents body={body} setBody={setBody}/>
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
      <SignEditorSave signData={signData} />
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

export function LegacySignEditorPage(){
  const { signData, isLoading } = useSignData(); 

  if (isLoading) {
    return <div>Loading...</div>;
  } 

  return (
    <>
      <TopBar></TopBar>
      <Grid2
        container
        spacing={4}
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
        <Grid2 xs={12} sm={6}>
          <LegacySignEditor signData={signData}/>
        </Grid2>

        <Grid2 container direction="column" alignItems="flex-start">
          <Sign signData={signData} />
        </Grid2>

      </Grid2>
    </>
  );
}

export default function SignEditorLegacy() {
  return LegacySignEditorPage();
}
