import * as React from 'react';
import List from '@mui/material/List';
import { Grid2, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import Sign from './Sign';

export function HomeMenu() {
  return (
    <List
      className="list-group"
    >
      <ListItemButton>
        <ListItemText primary="Current Status: Available" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <CollectionsIcon />
        </ListItemIcon>
        <ListItemText primary="Template Gallery" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <VisibilityIcon />
        </ListItemIcon>
        <ListItemText primary="Preview" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary="Image Link" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </List>
  );
}

export default function Home() {

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
        <HomeMenu />
      </Grid2>
      <Grid2 item fullWidth>
        <Sign />
      </Grid2>

    </Grid2>

  );
};
